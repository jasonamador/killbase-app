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
      console.log("SUCCESS");
      console.log(e);
    })
    .catch((e) => {
      console.log(e);
    });

  });
});
