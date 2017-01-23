$('#exampleModal').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget); // Button that triggered the modal
  var bugId = button.data('bug'); // Extract info from data-* attributes
  console.log(bugId);
  axios.post('/getBugDetails', {
      bug : bugId
    })
    .then(function (response) {
        var bugDetails = response.data;
        console.log(bugDetails[0].name);
        modal.find('#bug_name').val(bugDetails[0].bugName);
        modal.find('#bug_id').val(bugDetails[0].bugID);
        modal.find('#bug_type').val(bugDetails[0].bugType);
        modal.find('#description').val(bugDetails[0].description);
        modal.find('#priority').val(bugDetails[0].priority);
        modal.find('#severity').val(bugDetails[0].severity);
        modal.find('#current_status').val(bugDetails[0].status);
        modal.find('#project_id').val(bugDetails[0].projectName);
        modal.find('#tester_id').val(bugDetails[1].userName);
        modal.find('#project_manager').val(bugDetails[0].userName);
        modal.find('#file').val(bugDetails[0].file);
        modal.find('#method').val(bugDetails[0].method);
        modal.find('#line').val(bugDetails[0].line);
        // if(bugDetails[0].status == 'Open') {
        //     modal.find('#statDropdown').html("<select class='form-control' name='status' onchange='rejectCheck($(this))'>
        //      <option value=''>Select status</option>
        //      <option value='Approve Reject'>Reject</option>
        //      <option value='Closed'>Closed</option>
        //     </select>");
        // }
        modal.find("#scrImg").attr("src",'/screenshots/'+bugDetails[0].screenshot);
        if(typeof(bugDetails[2]) == 'undefined') {
            modal.find('#developer_id').val("Unassigned");
        }else {
            modal.find('#developer_id').val(bugDetails[2].userName);
        }
    })
    .catch(function (error) {
      console.log(error);
    });
    var modal = $(this);
})
