const express = require('express');
const assassins = require('./routes/assassins');

const port = process.env.PORT || 8080;
const app = express();
app.set('view engine', 'pug');

app.use(express.static('public'));

/*
  ROUTES
*/
app.use('/assassins', assassins);

app.get('/', (req, res) => {
  res.render('index', {name: 'Jason'});
});

app.listen(port, () => {
  console.log('listening on ', port);
})
