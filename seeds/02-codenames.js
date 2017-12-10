exports.seed = function(knex, Promise) {
  const fs = require('fs');
  let assassinsCsv = fs.readFileSync('./data/assassins.csv', 'UTF-8');

  // clean the initial input a little
  let assassins = assassinsCsv.trim().replace(/"/g, '').split('\n').map((e) => e.split(', '));
  assassins.shift(1);

  // make lookup from name to codename
  let codenamesToNames = {};
  assassins.forEach((e) => {
    if (e[1] !== '') {
      codenamesToNames[e[1]] = e[0];
    }
  });

  let assassinNameToId = {};
  let codenames = [];

  return knex('assassins').select('people.name', 'assassins.id')
    .leftJoin('people', 'assassins.person_id', '=', 'people.id')
    .then((results) => {
      // make lookup from assassin name to id
      results.forEach((e) => {
        assassinNameToId[e.name] = e.id;
      });

      // build the code_names array
      for (let codename in codenamesToNames) {
        let assassinIdCodeName = {};
        assassinIdCodeName.assassin_id = assassinNameToId[codenamesToNames[codename]];
        assassinIdCodeName.code_name = codename;
        codenames.push(assassinIdCodeName);
      }
      console.log(codenames);
    })
    .then(() => {
      return knex('code_names').del();
    })
    .then(function () {
      return knex('code_names').insert(codenames);
    });
};
