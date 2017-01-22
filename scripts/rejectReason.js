function rejectCheck(that) {
        if ((that.val() == "Review Reject")||(that.val() == "Approve Reject")) {
            that.closest("tr").find(".stat").find(".ifReject")[0].style.display = "block";
        } else {
            that.closest("tr").find(".stat").find(".ifReject")[0].style.display = "none";
        }
}
