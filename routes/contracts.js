const express = require('express');
const bodyParser = require('body-parser');
const config = require('../knexfile')['development'];
const knex = require('knex')(config);
const router = express.Router();

router.use(bodyParser.json());

// Create
router.post('/', (req, res) => {
  console.log(req.body);
  res.send(req.body);
});

// Read all
router.get('/', (req, res) => {
  let clientIdsToNames = {};
  let targetIdsToNames = {};
  knex('contracts').select().then((contracts) => {
    knex('clients').select('people.name', 'clients.id')
      .leftJoin('people', 'people.id', 'clients.person_id')
      .then((clients) => {
        clients.forEach((e) => {
          clientIdsToNames[e.id] = e.name;
        });
        contracts.forEach((e) => {
          e.clientName = clientIdsToNames[e.client_id];
        });
      })
      .then(() => {
        knex('targets').select('people.name', 'targets.id', 'people.photo_url', 'targets.location', 'targets.security')
          .leftJoin('people', 'people.id', 'targets.person_id').then((targets) => {
              targets.forEach((e) => {
                targetIdsToNames[e.id] = e.name;
              });
              contracts.forEach((e) => {
                e.targetName = targetIdsToNames[e.target_id];
              });
            })
            .then(() => {
              res.render('contracts/list', {contracts});
            })
            .catch((e) => {
              console.error(e);
              res.sendStatus(500);
            })
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

// Read all incomplete
router.get('/incomplete', (req, res) => {
  let clientIdsToNames = {};
  let targetIdsToNames = {};
  knex('contracts').select().where('complete', 'false')
  .then((contracts) => {
    knex('clients').select('people.name', 'clients.id')
      .leftJoin('people', 'people.id', 'clients.person_id')
      .then((clients) => {
        clients.forEach((e) => {
          clientIdsToNames[e.id] = e.name;
        });
        contracts.forEach((e) => {
          e.clientName = clientIdsToNames[e.client_id];
        });
      })
      .then(() => {
        knex('targets').select('people.name', 'targets.id', 'people.photo_url', 'targets.location', 'targets.security')
          .leftJoin('people', 'people.id', 'targets.person_id').then((targets) => {
              targets.forEach((e) => {
                targetIdsToNames[e.id] = e.name;
              });
              contracts.forEach((e) => {
                e.targetName = targetIdsToNames[e.target_id];
              });
            })
            .then(() => {
              res.render('contracts/list', {contracts});
            })
            .catch((e) => {
              console.error(e);
              res.sendStatus(500);
            })
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

// Read all complete
router.get('/complete', (req, res) => {
  let clientIdsToNames = {};
  let targetIdsToNames = {};
  knex('contracts').select().where('complete', 'true')
  .then((contracts) => {
    knex('clients').select('people.name', 'clients.id')
      .leftJoin('people', 'people.id', 'clients.person_id')
      .then((clients) => {
        clients.forEach((e) => {
          clientIdsToNames[e.id] = e.name;
        });
        contracts.forEach((e) => {
          e.clientName = clientIdsToNames[e.client_id];
        });
      })
      .then(() => {
        knex('targets').select('people.name', 'targets.id', 'people.photo_url', 'targets.location', 'targets.security')
          .leftJoin('people', 'people.id', 'targets.person_id').then((targets) => {
              targets.forEach((e) => {
                targetIdsToNames[e.id] = e.name;
              });
              contracts.forEach((e) => {
                e.targetName = targetIdsToNames[e.target_id];
              });
            })
            .then(() => {
              res.render('contracts/list', {contracts});
            })
            .catch((e) => {
              console.error(e);
              res.sendStatus(500);
            })
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
  res.render('contracts/new');
});

// Read one
// needs different nesting scheme, maybe promise.all
router.get('/:id', (req, res) => {
  let contract;
  knex('contracts').where('id', req.params.id).first()
  .then((contractDb) => {
    contract = contractDb;
  })
  .then(() => {
    return knex('clients').where('id', contract.client_id).first()
    .then((client) => {
      contract.client = client;
    });
  })
  .then(() => {
    return knex('people').where('id', contract.client.person_id).first()
    .then((person) => {
      contract.client.person = person;
    });
  })
  .then(() => {
    return knex('targets').where('id', contract.target_id).first()
    .then((target) => {
      contract.target = target;
    });
  })
  .then(() => {
    return knex('people').where('id', contract.target.person_id).first()
    .then((person) => {
      contract.target.person = person;
    });
  })
  .then(() => {
    res.render('contracts/single', contract);
  })
  .catch(() => {
    res.sendStatus(500);
  });
});

// Update
router.patch('/:id', (req, res) => {
  res.send('UPDATE ' + req.params.id);
});

// Delete
router.delete('/:id', (req, res) => {
  res.send('DELETE ' + req.params.id);
});

router.use((req, res) => {
  res.sendStatus(404);
});


module.exports = router;
