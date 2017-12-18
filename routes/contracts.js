const express = require('express');
const bodyParser = require('body-parser');
const config = require('../knexfile')['development'];
const knex = require('knex')(config);
const router = express.Router();

router.use(bodyParser.json());

// helper functions
function getAll() {
  let selects = [
    'contracts.id',
    'contracts.budget',
    'contracts.complete',
    'contracts.active',
    'contracts.target_id',
    'contracts.client_id',
    'client.name as client_name',
    'client.photo_url as client_photo_url',
    'target.name as target_name',
    'target.security',
    'target.location',
    'target.photo_url as target_photo_url'
  ];

  return knex('contracts').select(selects)
  .join(function() {
    this.select('clients.id', 'people.name', 'people.photo_url')
    .from('clients').join('people', 'people.id', 'clients.person_id')
    .as('client')
  }, 'client.id', 'contracts.client_id')
  .join(function() {
    this.select('targets.id', 'people.name', 'people.photo_url', 'targets.security', 'targets.location')
    .from('targets').join('people', 'people.id', 'targets.person_id')
    .as('target')
  }, 'target.id', 'contracts.target_id')
}

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
  getAll()
  .then((contracts) => {
    res.render('contracts/list', {contracts});
  });
});

// Read all incomplete
router.get('/incomplete', (req, res) => {
  getAll().where('complete', false)
  .then((contracts) => {
    res.render('contracts/list', {contracts});
  });
});

// Read all complete
router.get('/complete', (req, res) => {
  getAll().where('complete', true)
  .then((contracts) => {
    res.render('contracts/list', {contracts});
  })
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
    return knex('assassins').join('people', 'person_id', 'people.id')
      .join('assassins_contracts', 'assassins_id', 'assassins.id')
      .where('contracts_id', contract.id)
    .then((assassins) => {
      contract.assassins = assassins;
    });
  })
  .then(() => {
    // res.render('contracts/single', contract);
    res.send(contract);
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
