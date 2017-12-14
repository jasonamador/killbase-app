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
      dataType: 'json'
    })
    .then(() => {
      $('#deletedIndicator').addClass('hidden');
    })
    .catch((e) => {
      console.log(e);
    });
  });
});
