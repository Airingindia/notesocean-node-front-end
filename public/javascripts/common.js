$(document).ready(function () {
    // var deviceId = amplitude.getInstance().options.deviceId;
    // console.log("deviceId: " + deviceId);
    $.ajax({
        type: "GET",
        url: "/api/env",
        success: function (data) {
            sessionStorage.setItem("home", data.home);
            sessionStorage.setItem("env", data.env);
            sessionStorage.setItem("api", data.api);
        }
    });
});