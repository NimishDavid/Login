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
          replace += "<div class='col-sm-12'><div class='col-sm-1'><label><input type='checkbox' name='developers[]' value= '"+item.devID+"' ></label></div><div class='col-sm-3'><p>"+item.devName+"</p></div><div class='col-sm-3'><p>"+item.projectName+"</p><input type='hidden' name='project_id' value='"+item.projectId+"'></div></div>";
        });
        $('#developersRemove').html(replace);
    })
    .catch(function (error) {
      console.log(error);
    });
}
