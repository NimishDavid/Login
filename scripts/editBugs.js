$(".update").click(function() {

        var $bug = $(this).closest("tr").find(".bug_id").text();        // Retrieves the text within <td>
        document.location.href = "/home/editBugDetails/"+$bug;
        // axios.defaults.headers.common['bugs'] = $bug;
        // axios.post('/home/editBugDetails', {
        //     params: {
        //         bugID: $bug
        //     }
        // })
        // .then(function (response) {
        //     var resText = response.data;
        //     // alert(resText);
        //     document.location.href = "/home/editBugDetails";
        //
        // })
        // .catch(function (error) {
        //     console.log(error);
        // });
});
