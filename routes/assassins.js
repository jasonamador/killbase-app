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
  // Insert the person
  knex('people').insert({name: assassin.name, photo_url: assassin.photo_url})
    .returning('id')
    .then((ids) => {
      // Insert the assassin
      assassin.person_id = ids[0];
      delete assassin.name;
      delete assassin.photo_url;
      return knex('assassins').insert(assassin).returning('id');
    })
    .then((ids) => {
      codenames = codenames.map((e) => {return {code_name: e, assassin_id: ids[0]}});
      return knex('code_names').insert(codenames)
        .then(() => {
          res.send(assassin);
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
  knex('assassins').select('assassins.id', 'people.name', 'assassins.weapon', 'assassins.email as email', 'assassins.price', 'assassins.rating', 'assassins.kills', 'assassins.age', 'assassins.active')
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

// Read active
router.get('/active', (req, res) => {
  knex('assassins').select('assassins.id', 'people.name', 'assassins.weapon', 'assassins.email as email', 'assassins.price', 'assassins.rating', 'assassins.kills', 'assassins.age', 'assassins.active').where('assassins.active', true)
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

// Read retired
router.get('/retired', (req, res) => {
  knex('assassins').select('assassins.id', 'people.name', 'assassins.weapon', 'assassins.email as email', 'assassins.price', 'assassins.rating', 'assassins.kills', 'assassins.age', 'assassins.active').where('assassins.active', false)
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
router.get('/:id', (req, res) => {
  knex('assassins').select('assassins.id', 'people.name', 'people.photo_url', 'assassins.weapon', 'assassins.email as email', 'assassins.price', 'assassins.rating', 'assassins.kills', 'assassins.age', 'assassins.active')
    .join('people', 'assassins.person_id', 'people.id')
    .where('assassins.id', req.params.id).first()
    .then((assassin) => {
      knex('code_names').select().join('assassins', 'code_names.assassin_id', 'assassins.id')
      .where('assassins.id', req.params.id)
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

// Retire one
router.patch('/:id/retire', (req, res) => {
  console.log('retire');
  knex('assassins').where('id', req.params.id).update('active', false)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((e) => {
      console.log(e);
      res.sendStatus(500);
    });
});

// Update one
router.patch('/:id', (req, res) => {
  console.log('update');
  knex('assassins').where('assassins.id', req.params.id).update(req.body)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((e) => {
      console.error(e);
      res.sendStatus(500);
    });
});


// Delete one
router.delete('/:id', (req, res) => {
  knex('assassins').del()
  .where('id', req.params.id)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((e) => {
      console.log(e);
      res.sendStatus(500);
    });
});

router.use((req, res) => {
  res.sendStatus(404);
});

module.exports = router;
