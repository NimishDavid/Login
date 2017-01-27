function getDevelopers(that) {
  var $project = that.val();
  if(!$project) {
    location.reload();
  }
  axios.post('/getDevs', {
      proj: $project
    })
    .then(function (response) {
        var developers = response.data;
        var replace = "";
        developers.forEach(function(item, index) {
          replace += "<div class='col-md-12'><form class='' action='/admin/manageProjectTeam/manageDevelopers/removeDevelopers' method='post' onsubmit='return confirm(\"Do you really want to remove the developer from the project?\");'><div class='col-md-2'><p>"+item.devID+"</p><input type='hidden' name='user_id' value='"+item.devID+"'></div><div class='col-md-3'><p>"+item.devName+"</p></div><div class='col-md-3'><p>"+item.projectName+"</p><input type='hidden' name='project_id' value='"+item.projectId+"'></div><div class='col-md-1'><button type='submit' class='removeBtn'><i class='fa fa-trash' aria-hidden='true'></i></button></div></form></div>";
        });
        $('#developersRemove').html(replace);
    })
    .catch(function (error) {
      console.log(error);
    });
}
