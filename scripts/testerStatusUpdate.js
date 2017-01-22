$(".update").click(function() {
    var $stat = $(this).closest("tr").find(".stat")     // Gets a descendent with class="stat"
    .find(":selected").val();
    if(!$stat) {
        alert("Please select status");
    }
    else {
      var $bug = $(this).closest("tr").find(".bug_id").text();         // Retrieves the text within <td>
      if($stat == 'Review Reject') {
        var $reason = $(this).closest("tr").find(".stat").find(".ifReject").find(".reason").val();
        if(!$reason) {
          alert("Please enter a reason");
        }
        else {
          axios.post('/tester/reviewBugs', {
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
        console.log("Else entered");
          axios.post('/tester/reviewBugs', {
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
