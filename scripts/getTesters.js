function getTesters(that) {
  var $project = that.val();
  if(!$project) {
    location.reload();
  }
  axios.post('/getTesters', {
      proj: $project
    })
    .then(function (response) {
        var testers = response.data;
        var replace = "";
        testers.forEach(function(item, index) {
          replace += "<div class='col-md-12'><form class='' action='/admin/manageProjectTeam/manageTesters/removeTesters' method='post' onsubmit='return confirm(\"Do you really want to remove the tester from the project?\");'><div class='col-md-2'><p>"+item.testerID+"</p><input type='hidden' name='user_id' value='"+item.testerID+"'></div><div class='col-md-3'><p>"+item.testerName+"</p></div><div class='col-md-3'><p>"+item.projectName+"</p><input type='hidden' name='project_id' value='"+item.projectId+"'></div><div class='col-md-1'><button type='submit' class='removeBtn'><i class='fa fa-trash' aria-hidden='true'></i></button></div></form></div>";
        });
        $('#testersRemove').html(replace);
    })
    .catch(function (error) {
      console.log(error);
    });
}
