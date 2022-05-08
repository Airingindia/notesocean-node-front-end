//  ad blocker code snippet credit: https://stackoverflow.com/questions/4869154/how-to-detect-adblock-on-my-website
async function detectAdBlock() {
    let adBlockEnabled = false
    const googleAdUrl = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
    try {
        await fetch(new Request(googleAdUrl)).catch(_ => adBlockEnabled = true)
    } catch (e) {
        adBlockEnabled = true;
        amplitude.getInstance().logEvent("adblocked", {
            lavel: "low"
        });
    } finally {
        if (adBlockEnabled) {
            if (window.location.pathname.indexOf("dashboard") == 1) {
                document.querySelector(".second-side").innerHTML = `
                <div class="text-center" style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:100%">
                <h1 class="text-danger"> <i class="fa fa-info-circle text-dager"> </i> Opps! </h1>
                <h2  class="text-danger"> Failed to Connect Server </h2>
                        <p> Your Adblocker or third app party are blocking the request 
                        <br>
                        They can intercept your browsing data , please remove that application or try diffrent browser </p>
                </div>
               `;
            } else {
                document.querySelector(".main-section").remove();
                document.querySelector(".ad-blocker-detected").classList.remove("d-none");
            }
        }
    }
}
//  ad blocker snippet - https://www.geeksforgeeks.org/how-to-detect-adblocker-using-javascript/
function adb() {
    let fakeAd = document.createElement("div");
    fakeAd.className = "textads banner-ads banner_ads ad-unit ad-zone ad-space adsbox"

    fakeAd.style.height = "1px"

    document.body.appendChild(fakeAd)

    let x_width = fakeAd.offsetHeight;
    let msg = document.getElementById("msg")


    if (x_width) {
        detectAdBlock();
    } else {
        amplitude.getInstance().logEvent("adblocked", {
            "lavel": "moderate"
        });
        if (window.location.pathname.indexOf("dashboard") == 1) {
            document.querySelector(".second-side").innerHTML = `
            <div class="text-center" style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:100%">
                    <h1 class="text-danger"> <i class="fa fa-info-circle text-dager"> </i> Opps! </h1>
                    <h2  class="text-danger"> Failed to Connect Server </h2>
                    <p> Your Adblocker or third app party blocking request 
                    <br>
                    They can intercept your files , please remove that application or try diffrent browser </p>
                    
            </div>
           `;
        } else {
            document.querySelector(".main-section").remove();
            document.querySelector(".ad-blocker-detected").classList.remove("d-none");
        }

    }
}

// adb();

// detect dark mode snippet
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    amplitude.getInstance().logEvent("color-mode", {
        mode: "dark"
    });
} else {
    amplitude.getInstance().logEvent("color-mode", {
        mode: "light"
    });
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
            $("nav .login-button").removeClass("d-none");
            $("nav .user-icon-box").addClass("d-none");
        }
    } else {
        showProfilePic();
        $(".login-button").addClass("d-none");
        $(".user-icon-box").removeClass("d-none");
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

    // hide homepage header search bar

    function hideHomepageSearchbar() {
        if (window.location.pathname == "/") {
            $(".search-box").addClass("d-none");
        }
    }

    hideHomepageSearchbar();

});