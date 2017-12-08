const express = require('express');
const config = require('./knexfile')['development'];
const knex = require('knex')(config);

const port = process.env.PORT || 8000;
const app = express();

app.listen(port, () => {
  console.log('listening on ', port);
})
