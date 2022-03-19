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
    if (localStorage.getItem("userdata") == null) {
        if (localStorage.getItem("token") !== null) {
            const userId = JSON.parse(atob(localStorage.getItem("token").split(".")[1])).userId;
            $.ajax({
                type: "GET",
                url: sessionStorage.getItem("api") + "/users/" + userId,
                headers: {
                    Authorization: localStorage.getItem("token")
                },
                beforeSend: function () { },
                success: function (data) {
                    localStorage.setItem("userdata", JSON.stringify(data));
                    showProfilePic();
                }
            });
        } else {
            $(".user-icon-box a").html(`<button class="btn btn-sm btn-primary navbar-login-btn"> Login</button>`);
        }
    } else {
        showProfilePic();
    }

    function showProfilePic() {
        const userData = JSON.parse(localStorage.getItem("userdata"));
        const profile_pic = userData.profileImage;
        if (profile_pic !== null) {
            $(".user-icon-box img").attr("src", profile_pic);
        } else {
            $(".user-icon-box img").attr("src", "/images/dummy/user_dummy.jpg");
        }
    };

    $(".mobile-search-box").click(function () {
        $(".logo-box").slideToggle("hide");
        $(".search-box").slideToggle("show");
        $(".search-btn-close").slideToggle("show");
        $(".search-btn").slideToggle("hide");
    })





});