$(".update").click(function() {
    var $stat = $(".stat")     // Gets a descendent with class="stat"
    .find(":selected").val();
    if(!$stat) {
        alert("Please select status");
    }
    else {
        var $bug = $('#bug_id').val();         // Retrieves the text within <td>
        axios.post('/developer/bugReport', {
            status : $stat,
            bug : $bug
          })
          .then(function (response) {
              var resText = response.data;
              alert(resText);
              location.reload({ msg : "success" });
          })
          .catch(function (error) {
            console.log(error);
          });
    }
});
