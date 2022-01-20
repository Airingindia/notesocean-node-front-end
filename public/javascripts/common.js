$(document).ready(function () {
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