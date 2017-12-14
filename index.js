const express = require('express');
const contracts = require('./routes/contracts');
const assassins = require('./routes/assassins');
const morganBody = require('morgan-body');
const bodyParser = require('body-parser');

const port = process.env.PORT || 8080;
const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(bodyParser.json());

/*
  ROUTES
*/
app.use('/contracts', contracts);
app.use('/assassins', assassins);

app.get('/', (req, res) => {
  res.render('index', {name: 'Jason'});
});

app.listen(port, () => {
  console.log('listening on ', port);
});

morganBody(app);
