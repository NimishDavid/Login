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

function getDevelopersAdd(that) {
  var $project = that.val();
  if(!$project) {
    location.reload();
  }
  axios.post('/getDevelopersAdd', {
      proj: $project
    })
    .then(function (response) {
        var developers = response.data;
        var replace = "";
        developers.forEach(function(item, index) {
          replace += "<div class='col-md-12'><div class='col-md-1'><label><input type='checkbox' name='developers[]' value= '"+item.developerId+"' ></label></div><div class='col-md-6'><p>"+item.developerName+"</p></div></div>";
        });
        $('#developersAdd').html(replace);
    })
    .catch(function (error) {
      console.log(error);
    });
}

function addDevelopersCheck() {
  var $project = $("#project_id")     // Gets a descendent with class="stat"
  .find(":selected").val();
  if(!$project) {
      alert("Please select a project first");
      event.preventDefault();
      event.stopPropagation();
  }
}

function removeDevelopersCheck() {
  var $project = $("#projectDeveloper")     // Gets a descendent with class="stat"
  .find(":selected").val();
  if(!$project) {
      alert("Please select a project first");
      event.preventDefault();
      event.stopPropagation();
  }
}
