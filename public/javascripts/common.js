//  ad blocker code snippet credit: https://stackoverflow.com/questions/4869154/how-to-detect-adblock-on-my-website
async function detectAdBlock() {
    let adBlockEnabled = false
    const googleAdUrl = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
    try {
        await fetch(new Request(googleAdUrl)).catch(_ => adBlockEnabled = true)
    } catch (e) {
        adBlockEnabled = true
    } finally {
        if (adBlockEnabled) {
            document.querySelector(".main-section").remove();
            document.querySelector(".ad-blocker-detected").classList.remove("d-none");
            // alert("blocked");
        }
    }
}

$(document).ready(function () {
    detectAdBlock();
    amplitude.getInstance().logEvent("change page ", {
        path: window.location.href
    });
    if (localStorage.getItem("home") == null || localStorage.getItem("env") == null || localStorage.getItem("api") == null) {
        $.ajax({
            type: "GET",
            url: "/api/env",
            success: function (data) {
                localStorage.setItem("home", data.home);
                localStorage.setItem("env", data.env);
                localStorage.setItem("api", data.api);
            }
        });
    }
    if (localStorage.getItem("userdata") == null) {
        if (localStorage.getItem("token") !== null) {
            const userId = JSON.parse(atob(localStorage.getItem("token").split(".")[1])).userId;
            $.ajax({
                type: "GET",
                url: localStorage.getItem("api") + "/users/" + userId,
                headers: {
                    Authorization: localStorage.getItem("token")
                },
                beforeSend: function () { },
                success: function (data) {
                    localStorage.setItem("userdata", JSON.stringify(data));
                    showProfilePic();
                    window.location = window.location.href;
                }
            });
        } else {
            $(".user-icon-box").html(`<a href="/login"> <button class="btn btn-sm btn-primary navbar-login-btn"> <i  class="fa fa-user mx-1"> </i> Login</button> </a>`);
        }
    } else {
        showProfilePic();
    }

    function showProfilePic() {
        const userData = JSON.parse(localStorage.getItem("userdata"));
        var profile_pic = userData.profileImage;
        if (profile_pic !== null) {
            $(".user-icon-box img").attr("src", profile_pic);
            $(".navbar-user-pic").attr("src", profile_pic);
        } else {
            $(".user-icon-box img").attr("src", "https://static.ncdn.in/public/images/dummy/user_dummy.jpg");
            $(".navbar-user-pic").attr("src", "https://static.ncdn.in/public/images/dummy/user_dummy.jpg");
        }
    };

    $(".mobile-search-box").click(function () {
        $(".logo-box").slideToggle("hide");
        $(".search-box").slideToggle("show");
        $(".search-btn-close").slideToggle("show");
        $(".search-btn").slideToggle("hide");
    });

    // notice close
    $(".close-notice").click(function () {
        $(".notice-box").html("");
    });

});