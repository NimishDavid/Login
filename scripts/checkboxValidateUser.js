$(document).ready(function () {
    $('.checkBtn').click(function() {
      checked = $('#usersRemove').find("input[type=checkbox]:checked").length;

      if(!checked) {
        alert("You must check at least one checkbox.");
        return false;
      }

    });
});
