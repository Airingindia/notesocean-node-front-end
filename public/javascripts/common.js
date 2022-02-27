$(document).ready(function () {
    amplitude.getInstance().logEvent("change page ", {
        path: window.location.href
    });
    if (sessionStorage.getItem("home") == null || sessionStorage.getItem("env") == null || sessionStorage.getItem("api") == null) {
        $.ajax({
            type: "GET",
            url: "/api/env",
            success: function (data) {
                sessionStorage.setItem("home", data.home);
                sessionStorage.setItem("env", data.env);
                sessionStorage.setItem("api", data.api);
            }
        });
    }
});