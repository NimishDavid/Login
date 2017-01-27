$(document).ready(function () {
    $('.checkBtn1').click(function() {
      checked = $('#developersAdd').find("input[type=checkbox]:checked").length;

      if(!checked) {
        alert("You must check at least one checkbox.");
        return false;
      }

    });
    $('.checkBtn2').click(function() {
      checked = $('#developersRemove').find("input[type=checkbox]:checked").length;

      if(!checked) {
        alert("You must check at least one checkbox.");
        return false;
      }

    });
});
