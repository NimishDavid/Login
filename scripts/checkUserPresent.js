$("#employee_id").change(function() {
    var emp = $("#employee_id").val();
    axios.post('/admin/checkUser', {
        empId : emp
      })
      .then(function (response) {
          var resText = response.data;
          alert(resText);
      })
      .catch(function (error) {
        console.log(error);
      });
});
