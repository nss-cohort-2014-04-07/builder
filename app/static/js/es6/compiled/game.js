(function() {
  'use strict';
  $(document).ready(init);
  function init() {
    $('#login').click(login);
    $('#seed').click(seed);
    $('#getforest').click(getForest);
    $('#forest').on('click', '.tree.alive', grow);
    $('#forest').on('click', '.tree.alive.adult .chop', chop);
  }
  function chop(e) {
    var tree = $(this).parent();
    var treeId = tree.data('id');
    var userId = $('#username').data('id');
    $.ajax({
      url: ("/tree/" + treeId + "/chop/" + userId),
      type: 'PUT',
      dataType: 'html',
      success: (function(t) {
        tree.replaceWith(t);
        $.ajax({
          url: ("/user/" + userId + "/dashboard"),
          type: 'GET',
          dataType: 'html',
          success: (function(user) {
            $('#dashboard').empty().append(user);
          })
        });
      })
    });
    e.stopPropagation();
  }
  function grow() {
    var tree = $(this);
    var treeId = $(this).data('id');
    $.ajax({
      url: ("/tree/" + treeId + "/grow"),
      type: 'PUT',
      dataType: 'html',
      success: (function(t) {
        tree.replaceWith(t);
      })
    });
  }
  function getForest() {
    var userId = $('#username').data('id');
    $.ajax({
      url: ("/forest/" + userId),
      type: 'GET',
      dataType: 'html',
      success: (function(trees) {
        $('#forest').empty().append(trees);
      })
    });
  }
  function seed() {
    var userId = $('#username').data('id');
    $.ajax({
      url: '/seed',
      type: 'POST',
      dataType: 'html',
      data: {userId: userId},
      success: (function(tree) {
        $('#forest').append(tree);
      })
    });
  }
  function login(e) {
    var data = $(this).closest('form').serialize();
    $.ajax({
      url: '/login',
      type: 'POST',
      data: data,
      success: (function(user) {
        $('#login').prev().val('');
        $('#dashboard').empty().append(user);
      })
    });
    e.preventDefault();
  }
})();

//# sourceMappingURL=game.map
