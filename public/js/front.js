$(() => {
  $('#deleteLink').on('click', (e) => {
    e.preventDefault();
    $.ajax({
      url: $('#deleteLink').attr('href'),
      type: 'DELETE'
    }).then(() => {
      $('#deletedIndicator').removeClass('hidden');
    }).catch((e) => {
      console.log(e);
    });
  });

  $('#undo').on('click', (e) => {
    e.preventDefault();
    $.ajax({
      url: $('#undo').attr('href'),
      type: 'PATCH',
      contentType: 'application/json',
      data: JSON.stringify({
        'active': 'true'
      }),
    })
    .then(() => {
      $('#deletedIndicator').addClass('hidden');
    })
    .catch((e) => {
      console.log(e);
    });
  });

  $('#postNewContract').on('click', (e) => {
    e.preventDefault();
    let array = $('#createContractForm').serializeArray();
    let contract = {};
    array.forEach((e) => {
      contract[e.name] = e.value;
    });
    // should probably validate this data
    $.ajax({
      url: '/contracts',
      type: '/post',
      contentType: 'application/json',
      data: JSON.stringify(contract),
      dataType: 'json'
    })
    .then((contract) => {
      window.location.href = '/contracts';
    });
  });

  $('#postNewAssassin').on('click', (e) => {
    e.preventDefault();
    let array = $('#createAssassinForm').serializeArray();
    let assassin = {};
    array.forEach((e) => {
      assassin[e.name] = e.value;
    });
    // should probably validate this data
    $.ajax({
      url: '/assassins',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(assassin),
      dataType: 'json'
    })
    .then((assassin) => {
      window.location.href = '/assassins';
    })
    .catch((e) => {
      console.log(e);
    });

  });
});
