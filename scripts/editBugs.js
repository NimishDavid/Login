$(".update").click(function() {

        var $bug = $(this).closest("tr").find(".bug_id").text();        // Retrieves the text within <td>
        document.location.href = "/tester/reportBug/editBugDetails/"+$bug;
});
