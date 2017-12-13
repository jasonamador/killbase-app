const express = require('express');
const bodyParser = require('body-parser');
const config = require('../knexfile')['development'];
const knex = require('knex')(config);
const router = express.Router();

router.use(bodyParser.json());

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
        knex('targets').select('people.name', 'targets.id', 'targets.photo_url', 'targets.location', 'targets.security')
          .leftJoin('people', 'people.id', 'targets.person_id').then((targets) => {
              targets.forEach((e) => {
                targetIdsToNames[e.id] = e.name;
              });
              contracts.forEach((e) => {
                e.targetName = targetIdsToNames[e.target_id];
              });
            })
            .then(() => {
              res.render('contracts', {contracts});
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

router.get('/:id', (req, res) => {

});

router.post('/', (req, res) => {

});

module.exports = router;
