const express = require('express');
const bodyParser = require('body-parser');
const config = require('../knexfile')['development'];
const knex = require('knex')(config);
const sha1 = require('sha1')
const router = express.Router();

router.use(bodyParser.json());

// Create one
router.post('/', (req, res) => {
  let assassin = req.body;
  let codenames= [];
  codenames.push(assassin.codename);
  delete assassin.codename;
  knex('people').insert({name: assassin.name, photo_url: assassin.photo_url})
    .then(() => {
      return knex('people').select('id').where('name', assassin.name).first()
        .then((person) => {
          assassin.person_id = Number.parseInt(person.id);
          delete assassin.name;
          delete assassin.photo_url;
          return knex('assassins').insert(assassin);
        })
        .then(() => {
          return knex.raw(`UPDATE assassins SET hashed_id = ENCODE(DIGEST(assassins.id::text, 'sha1'), 'hex') FROM assassins b WHERE assassins.id = b.id`);
        })
        .then(() => {
          return knex('assassins').select('id').where('person_id', assassin.person_id).first()
            .then((a) => {
              codenames = codenames.map((e) => {return {code_name: e, assassin_id: a.id}});
              return knex('code_names').insert(codenames)
                .then(() => {
                  res.send(assassin);
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

// Form view
router.get('/new', (req, res) => {
  res.render('assassins/new');
});

// Read all
router.get('/', (req, res) => {
  knex('assassins').select('assassins.id', 'assassins.hashed_id', 'people.name', 'assassins.weapon', 'assassins.email as email', 'assassins.price', 'assassins.rating', 'assassins.kills', 'assassins.age').where('assassins.active', 'true')
    .leftJoin('people', 'assassins.person_id', 'people.id')
    .then((assassins) => {
      knex('code_names').select()
      .then((codenamesDb) => {
        let codenames = {};
        codenamesDb.forEach((codename) => {
          if (!codenames[codename.assassin_id]) {
            codenames[codename.assassin_id] = [];
          }
          codenames[codename.assassin_id].push(codename.code_name);
        });
        assassins.forEach((assassin) => {
          if (codenames[assassin.id]) {
            assassin.codenames = codenames[assassin.id];
          } else {
            assassin.codenames = [];
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
  knex('assassins').select('assassins.id', 'assassins.hashed_id', 'people.name', 'people.photo_url', 'assassins.weapon', 'assassins.email as email', 'assassins.price', 'assassins.rating', 'assassins.kills', 'assassins.age')
    .join('people', 'assassins.person_id', 'people.id')
    .where('assassins.hashed_id', req.params.hashed_id).first()
    .then((assassin) => {
      knex('code_names').select().join('assassins', 'code_names.assassin_id', 'assassins.id')
      .where('assassins.hashed_id', req.params.hashed_id)
      .then((codenamesDb) => {
        let codenames = {};
        codenamesDb.forEach((codename) => {
          if (!codenames[codename.assassin_id]) {
            codenames[codename.assassin_id] = [];
          }
          codenames[codename.assassin_id].push(codename.code_name);
        });
        if (codenames[assassin.id]) {
          assassin.codenames = codenames[assassin.id];
        } else {
          assassin.codenames = [];
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
