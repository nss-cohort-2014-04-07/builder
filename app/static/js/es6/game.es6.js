/* jshint unused:false */

(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    $('#login').click(login);
    $('#seed').click(seed);
  }

  function seed(){
    var userId = $('#username').data('id');

    $.ajax({
      url: '/seed',
      type:'POST',
      data: {userId:userId},
      success: r => {
        var tree = `<div class='tree seed' data-id=${r._id}>
                    </div>`;
        $('#forest').append(tree);
      }
    });
  }

  function login(e){
    var data = $(this).closest('form').serialize();

    $.ajax({
      url: '/login',
      type:'POST',
      data: data,
      success: r => {
        $('#login').prev().val('');
        $('#username').attr('data-id', r._id);
        $('#username').text(r.username);
      }
    });

    e.preventDefault();
  }
})();
