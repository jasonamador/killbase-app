const express = require('express');
const bodyParser = require('body-parser');
const config = require('../knexfile')['development'];
const knex = require('knex')(config);
const sha1 = require('sha1')
const router = express.Router();

router.use(bodyParser.json());

// Create
router.post('/', (req, res) => {
  let assassin = req.body;
  let codeNames = assassin.codeNames;
  delete assassin.codeNames;
  knex('people').insert({name: assassin.name})
    .then(() => {
      return knex('people').select('id').where('name', assassin.name).first()
        .then((person) => {
          assassin.person_id = Number.parseInt(person.id);
          delete assassin.name;
          return knex('assassins').insert(assassin);
        })
        .then(() => {
          return knex('assassins').select('id').where('person_id', assassin.person_id).first()
            .then((a) => {
              codeNames = codeNames.map((e) => {return {code_name: e, assassin_id: a.id}});
              return knex('code_names').insert(codeNames)
                .then(() => {
                  res.sendStatus(200);
                })
                .catch((e) => {
                  console.error(e);
                  res.sendStatus(500);
                });
            })
            .catch((e) => {
              console.error(e);
              res.sendStatus(500);
            });
        })
        .catch((e) => {
          console.error(e);
          res.sendStatus(500);
        });
    })
    .catch((e) => {
      console.error(e);
      res.sendStatus(500);
    });
});

// Read all
router.get('/', (req, res) => {
  knex('assassins').select('assassins.id', 'assassins.hashed_id', 'people.name', 'assassins.weapon', 'assassins.email as email', 'assassins.price', 'assassins.rating', 'assassins.kills', 'assassins.age').where('assassins.active', 'true')
    .leftJoin('people', 'assassins.person_id', 'people.id')
    .then((assassins) => {
      knex('code_names').select()
      .then((codeNamesDb) => {
        let codeNames = {};
        codeNamesDb.forEach((codeName) => {
          if (!codeNames[codeName.assassin_id]) {
            codeNames[codeName.assassin_id] = [];
          }
          codeNames[codeName.assassin_id].push(codeName.code_name);
        });
        assassins.forEach((assassin) => {
          if (codeNames[assassin.id]) {
            assassin.codeNames = codeNames[assassin.id];
          } else {
            assassin.codeNames = [];
          }
        });
        res.render('assassins/list', {assassins, sha1});
      })
      .catch((e) => {
        console.error(e);
        res.sendStatus(500);
      });
    });
  });

// Read one
router.get('/:hashed_id', (req, res) => {
  knex('assassins').select('assassins.id', 'assassins.hashed_id', 'people.name', 'assassins.weapon', 'assassins.email as email', 'assassins.price', 'assassins.rating', 'assassins.kills', 'assassins.age')
    .join('people', 'assassins.person_id', 'people.id')
    .where('assassins.hashed_id', req.params.hashed_id).first()
    .then((assassin) => {
      knex('code_names').select().join('assassins', 'code_names.assassin_id', 'assassins.id')
      .where('assassins.hashed_id', req.params.hashed_id)
      .then((codeNamesDb) => {
        let codeNames = {};
        codeNamesDb.forEach((codeName) => {
          if (!codeNames[codeName.assassin_id]) {
            codeNames[codeName.assassin_id] = [];
          }
          codeNames[codeName.assassin_id].push(codeName.code_name);
        });
        if (codeNames[assassin.id]) {
          assassin.codeNames = codeNames[assassin.id];
        } else {
          assassin.codeNames = [];
        }
        res.render('assassins/single', assassin);
      })
      .catch((e) => {
        console.error(e);
        res.sendStatus(500);
      })
    });
  });

// Update one
router.patch('/:hashed_id', (req, res) => {
  knex('assassins').where('assassins.hashed_id', req.params.hashed_id).update(req.body)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((e) => {
      console.error(e);
      res.sendStatus(500);
    });
});

// Delete one
router.delete('/:hashed_id', (req, res) => {
  knex('assassins').update('active', false)
  .where('hashed_id', req.params.hashed_id)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((e) => {
      console.log(e);
      res.sendStatus(500);
    });
});

module.exports = router;
