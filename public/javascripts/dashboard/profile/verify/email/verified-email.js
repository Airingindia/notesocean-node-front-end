$(document).ready(function () {
    const userdata = JSON.parse(localStorage.getItem("userdata"));
    if (userdata.emailVerified == false) {
        window.location = "/dashboard/profile/verify-email";
    }
});