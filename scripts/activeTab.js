$(document).ready(function() {
    // -----------------------------------------------------------------------
    $.each($('.navbar').find('li'), function() {
      if (window.location.pathname.indexOf($(this).find('a').attr('href')) > -1)
      {
          $(this).toggleClass('active');
          $(this).parent().closest( "li" ).toggleClass('active');
      }
    });
    // -----------------------------------------------------------------------
});
