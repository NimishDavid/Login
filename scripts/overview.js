$(function() {
  $('.chartTotal').easyPieChart({
    animate: 1000,
    scaleColor: false,
    lineWidth: 10,
    lineCap: "butt",
    barColor: "#4ec9ce"
  });
  $('.chartOpen').easyPieChart({
    animate: 1000,
    scaleColor: false,
    lineWidth: 10,
    lineCap: "butt",
    barColor: "#E7912A"
  });
  $('.chartClosed').easyPieChart({
    animate: 1000,
    scaleColor: false,
    lineWidth: 10,
    lineCap: "butt",
    barColor: "#bacf0b"
  });
  $('.chartApproval').easyPieChart({
    animate: 1000,
    scaleColor: false,
    lineWidth: 10,
    lineCap: "butt",
    barColor: "#f377ab"
  });
  $('.chartCritical').easyPieChart({
    animate: 1000,
    scaleColor: false,
    lineWidth: 10,
    lineCap: "butt",
    barColor: "#ff5252"
  });
  $('.chartHigh').easyPieChart({
    animate: 1000,
    scaleColor: false,
    lineWidth: 10,
    lineCap: "butt",
    barColor: "#d550ff"
  });
});

function getDetails(that) {
  var $project = that.val();
  console.log($project);
  if(!$project) {
    location.reload();
  }
  axios.post('/getTesters', {
      proj: $project
    })
    .then(function (response) {
        var testers = response.data;
        console.log(testers);
        var replace = "";
        testers.forEach(function(item, index) {
          replace += "<div class='row'><p>"+item.testerName+"</p></div>";
        });
        $('#testers').html(replace);
    })
    .catch(function (error) {
      console.log(error);
    });
  axios.post('/getDevs', {
      proj: $project
    })
    .then(function (response) {
        var developers = response.data;
        var replace = "";
        developers.forEach(function(item, index) {
          replace += "<div class='row'><p>"+item.devName+"</p></div>";
        });
        $('#developers').html(replace);
    })
    .catch(function (error) {
      console.log(error);
    });
  axios.post('/getBugsProject', {
      proj: $project
    })
    .then(function (response) {
        var bugs = response.data;
        var total = 0, open = 0, assigned = 0, review = 0, approval = 0, closed = 0, rejected = 0, major = 0, critical = 0, minor = 0, high = 0, medium = 0, low = 0;
        console.log(bugs);
        bugs.forEach(function(item, index) {
          total++;
          switch(item.status) {
            case "Open" : open++;break;
            case "Assigned" : assigned++;break;
            case "Review" : review++;break;
            case "Approval" : approval++;break;
            case "Review Reject" : rejected++;break;
            case "Approval Reject" : rejected++;break;
            case "Closed" : closed++;break;
            default : break;
          }
          switch(item.severity) {
            case "Major" : major++;break;
            case "Critical" : critical++;break;
            case "Minor" : minor++;break;
            default : break;
          }
          switch(item.priority) {
            case "High" : high++;break;
            case "Medium" : medium++;break;
            case "Low" : low++;break;
            default : break;
          }
        });
        $('.openCounter').html(open);
        $('.assignedCounter').html(assigned);
        $('.reviewCounter').html(review);
        $('.approvalCounter').html(approval);
        $('.rejectedCounter').html(rejected);
        $('.closedCounter').html(closed);
        $('.criticalCounter').html(critical);
        $('.majorCounter').html(major);
        $('.minorCounter').html(minor);
        $('.highCounter').html(high);
        $('.mediumCounter').html(medium);
        $('.lowCounter').html(low);
        //update instance after 5 sec
        setTimeout(function() {
            $('.chartTotal').data('easyPieChart').update(total/total*100);
            $('#totalBugs').html(total);
            $('.chartOpen').data('easyPieChart').update((open/total)*100);
            $('#openBugs').html(open);
            $('.chartClosed').data('easyPieChart').update(closed/total*100);
            $('#closedBugs').html(closed);
            $('.chartApproval').data('easyPieChart').update(approval/total*100);
            $('#approvalBugs').html(approval);
            $('.chartCritical').data('easyPieChart').update(critical/total*100);
            $('#criticalBugs').html(critical);
            $('.chartHigh').data('easyPieChart').update(high/total*100);
            $('#highBugs').html(high);
        }, 100);
    })
    .catch(function (error) {
      console.log(error);
    });
}
