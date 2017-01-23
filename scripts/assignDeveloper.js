$(".update").click(function() {
    var $dev = $(".dev_id")     // Gets a descendent with class="dev_id"
    .find(":selected").val();
    if(!$dev) {
        alert("Please select a developer");
    }
    else {
        var $bug = $('#bug_id').val();         // Retrieves the text within <td>
        axios.post('/admin/bugReports/unassignedBugs', {
            dev : $dev,
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
