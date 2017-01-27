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
          replace += "<div class='col-sm-12'><div class='col-sm-1'><label><input type='checkbox' name='testers[]' value= '"+item.testerID+"' ></label></div><div class='col-sm-3'><p>"+item.testerName+"</p></div><div class='col-sm-3'><p>"+item.projectName+"</p><input type='hidden' name='project_id' value='"+item.projectId+"'></div></div>";
        });
        $('#testersRemove').html(replace);
    })
    .catch(function (error) {
      console.log(error);
    });
}
