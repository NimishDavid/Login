$(".update").click(function() {
    var $dev = $(this).closest("tr").find(".dev_id")     // Gets a descendent with class="bug_id"
    .find(":selected").val();
    if(!$dev) {
        alert("Please select a developer");
    }
    else {
        var $bug = $(this).closest("tr").find(".bug_id").text();         // Retrieves the text within <td>
        axios.post('/home/unassignedBugs', {
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
