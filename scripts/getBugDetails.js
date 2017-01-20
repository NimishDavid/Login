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
        modal.find('#bug_name').val(bugDetails[0].name);
        modal.find('#bug_id').val(bugDetails[0].id);
        modal.find('#bug_type').val(bugDetails[0].bug_type);
        modal.find('#description').val(bugDetails[0].description);
        modal.find('#priority').val(bugDetails[0].priority);
        modal.find('#severity').val(bugDetails[0].severity);
        modal.find('#status').val(bugDetails[0].status);
        modal.find('#project_id').val(bugDetails[0].project_id);
        modal.find('#tester_id').val(bugDetails[0].tester_id);
        modal.find('#developer_id').val(bugDetails[0].developer_id);
        modal.find('#file').val(bugDetails[0].file);
        modal.find('#method').val(bugDetails[0].method);
        modal.find('#line').val(bugDetails[0].line);
    })
    .catch(function (error) {
      console.log(error);
    });
    var modal = $(this);
})
