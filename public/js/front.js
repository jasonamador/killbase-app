$(() => {
  $('#assassinDeleteLink').on('click', (e) => {
    e.preventDefault();
    $.ajax({
      url: $('#assassinDeleteLink').attr('href'),
      type: 'DELETE'
    }).then(() => {
      $('#deletedIndicator').removeClass('hidden');
    }).catch((e) => {
      console.log(e);
    });
  });

  $('#assassinRetireLink').on('click', (e) => {
    e.preventDefault();
    $.ajax({
      url: $('#assassinRetireLink').attr('href'),
      type: 'PATCH'
    }).then(() => {
      $('#retiredIndicator').removeClass('hidden');
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
      $('#retiredIndicator').addClass('hidden');
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
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(contract),
      //dataType: 'json'
    })
    .then(() => {
      console.log('success');
      window.location.href = '/contracts';
    })
    .catch((e) => {
      console.log(e);
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

  $('#assignAssassinButton').on('click', (e) => {
    e.preventDefault();

    let contractId = $('#assignAssassinButton').attr('action');
    let assassinId = $('#assignAssassin').val();
    console.log(contractId + '/assign/' + assassinId);

    $.ajax({
      url: contractId + '/assign/' + assassinId,
      type: 'POST',
      contentType: 'application/json',
      data: '{}'
    })
    .then(() => {
      window.location.reload(true);
    });
  });
});
