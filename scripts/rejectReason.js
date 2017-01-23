function rejectCheck(that) {
        if ((that.val() == "Review Reject")||(that.val() == "Approve Reject")) {
            $(".ifReject")[0].style.display = "block";
        } else {
            $(".ifReject")[0].style.display = "none";
        }
}
