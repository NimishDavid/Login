$(".update").click(function() {
    var $stat = $(".stat")     // Gets a descendent with class="stat"
    .find(":selected").val();
    if(!$stat) {
        alert("Please select status");
    }
    else {
        var $bug = $('#bug_id').val();         // Retrieves the text within <td>
        if($stat == 'Approve Reject') {
          var $reason = $("#reason").val();
          if(!$reason) {
            alert("Please enter a reason");
          }
          else {
            axios.post('/admin/approveBugs', {
                reason : $reason,
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
        }
        else {
          axios.post('/admin/approveBugs', {
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
    }
});
