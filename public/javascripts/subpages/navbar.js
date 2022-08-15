$(document).ready(function () {
    if (getCookie("token") !== undefined) {
        $(".loading-nav-item").addClass("d-none");
        $(".dashboard-nav-item").removeClass("d-none");
        if (localStorage.getItem("userdata") !== null) {
            let pic = JSON.parse(localStorage.getItem("userdata")).profileImage.replace("https://s3.ap-south-1.amazonaws.com/profiles.notesocean.com", "https://profiles.ncdn.in/fit-in/25x25");
            $(".dashboard-nav-item img").attr("src", pic);
            $(".user-profile-name").html(" " + JSON.parse(localStorage.getItem("userdata")).firstName + " " + JSON.parse(localStorage.getItem("userdata")).lastName);
        } else {
            $(".dashboard-nav-item img").attr("src", "/images/dummy/user_dummy.jpg");
            $(".user-profile-name").html(" " + JSON.parse(localStorage.getItem("userInfo")).firstName + " " + JSON.parse(localStorage.getItem("userInfo")).lastName);
        }
    } else {
        $(".login-navbar-item").removeClass("d-none");
        $(".loading-nav-item").addClass("d-none");
    }


    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
    function setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    // function hideHomepageSearchbar() {
    //     if (window.location.pathname == "/") {
    //         $(".search-box").addClass("d-none");
    //     }
    // }

    hideHomepageSearchbar();

    function mavbar() {
        $(".mobile-menus-bars-button").click(function () {
            $(".mobile-menu-wrapper").css({ display: "flex" })
            $(".mobile-search-wrapper").css({ display: "none" });
        });

        $(".mobile-menus-wrapper-close-btn").click(function () {
            $(".mobile-menu-wrapper").css({ display: "none" });
            $(".mobile-search-wrapper").css({ display: "none" });
        });

        $(".mobile-menu-search-btn").click(function () {
            $(".mobile-menu-wrapper").css({ display: "none" });
            $(".mobile-search-wrapper").css({ display: "flex" });
        })
    }

    mavbar();
})