$(document).ready(function () {
    const userid = window.location.pathname.split("/")[2];
    if (localStorage.getItem("token") !== null) {
        const viewerid = JSON.parse(atob(localStorage.getItem("token").split(".")[1])).userId;
        amplitude.getInstance().logEvent("view profile", {
            path: window.location.href,
            viewedBy: viewerid,
            profile: userid
        });
    } else {
        amplitude.getInstance().logEvent("view profile", {
            path: window.location.href,
            viewedBy: "Guest",
            profile: userid
        });
    }
    // get user details
    // $.ajax({
    //     type: "GET",
    //     url: sessionStorage.getItem("api") + "/users/" + userid,
    //     beforeSend: function () {

    //     },
    //     success: function (data) {
    //         console.log(data);
    //     }
    // })
});