const express = require('express');
const bodyParser = require('body-parser');
const config = require('../knexfile')['development'];
const knex = require('knex')(config);
const router = express.Router();

router.use(bodyParser.json());

// New contract form view
router.get('/new', (req, res) => {
  res.render('contracts/new');
});

// Create
router.post('/', (req, res) => {
  let contract = {
    budget: req.body.budget,
    complete: false,
    active: true,
  };

  let clientPerson = {
    name: req.body.clientName,
    photo_url: req.body.clientPhotoURL,
  };

  let targetPerson = {
    name: req.body.targetName,
    photo_url: req.body.targetPhotoURL,
  };

  let target = {
    location: req.body.targetLocation,
    security: req.body.targetSecurity,
  };

  let client = {
  };

  // create and insert the target
  let insertTarget = knex('people').insert(targetPerson).returning('id')
    .then((id) => {
      target.person_id = id[0];
      return knex('targets').insert(target).returning('id')
        .then((id) => {
          contract.target_id = id[0];
        });
    });

  // create and insert the client
  let insertClient = knex('people').insert(clientPerson).returning('id')
    .then((id) => {
      client.person_id = id[0];
      return knex('clients').insert(client).returning('id')
        .then((id) => {
          contract.client_id = id[0];
        });
    });

  // insert the contract
  Promise.all([insertTarget, insertClient]).then(() => {
    return knex('contracts').insert(contract).then(() => {
      res.sendStatus(200);
    })
  });
});

// Create assassins_contracts (assign an assassin)
router.post('/:contract_id/assign/:assassin_id', (req, res) => {
  knex('assassins_contracts').insert( {
    assassins_id: req.params.assassin_id,
    contracts_id: req.params.contract_id
  }).then(() => {
    res.sendStatus(200);
  });
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

// Read one
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
