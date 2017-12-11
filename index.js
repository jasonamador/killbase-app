const express = require('express');
const assassins = require('./routes/assassins');

const port = process.env.PORT || 8080;
const app = express();

/*
  ROUTES
*/
app.use('/assassins', assassins);

app.listen(port, () => {
  console.log('listening on ', port);
})
