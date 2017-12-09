exports.seed = function(knex, Promise) {
  const fs = require('fs');
  let assassinsCsv = fs.readFileSync('./data/assassins.csv', 'UTF-8');
  let assassins = assassinsCsv.trim().replace(/"/g, '').split('\n').map((e) => e.split(', '));
  let peopleIds = {};
  let assassinsObjs = [];
  let names = [];

  return knex('people').select()
    .then((result) => {
      result.forEach((e) => {
        peopleIds[e.name] = e.id;
      });
      for (let i = 1; i < assassins.length; i++) {
        if (!names.includes(assassins[i][0])) {
          names.push(assassins[i][0]);
          assassinsObjs.push({
            person_id: peopleIds[assassins[i][0]],
            weapon: assassins[i][2],
            contact_info: assassins[i][3],
            age: assassins[i][4],
            price: assassins[i][5],
            rating: assassins[i][6],
            kills: assassins[i][7],
          });
        }
      }
    })
    .then(() => {
      return knex('assassins').del();
    })
    .then(function () {
      return knex('assassins').insert(assassinsObjs);
    });
};
