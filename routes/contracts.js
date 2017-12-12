const express = require('express');
const bodyParser = require('body-parser');
const config = require('../knexfile')['development'];
const knex = require('knex')(config);
const router = express.Router();

router.use(bodyParser.json());

router.get('/', (req, res) => {

});

router.get('/:id', (req, res) => {

});

router.post('/', (req, res) => {

});

module.exports = router;
