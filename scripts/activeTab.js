$(document).ready(function() {
  console.log(window.location.pathname);
    // -----------------------------------------------------------------------
    $.each($('.navbar').find('li'), function() {
      console.log($(this));
        $(this).toggleClass('active',
            window.location.pathname.indexOf($(this).find('a').attr('href')) > -1);
    });
    // -----------------------------------------------------------------------
});
