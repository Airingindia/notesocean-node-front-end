$(document).ready(function () {

    function Showheader(){
        let userInfo = JSON.parse(localStorage.getItem("userInfo"));
        let pic = userInfo.profileImage !== null ?  userInfo.profileImage.replace("https://profiles.ncdn.in", "https://profiles.ncdn.in/fit-in/25x25") : "https://static.ncdn.in/public/user.png";
        $(".dashboard-nav-item img").attr("src", pic);
        $(".user-profile-name").html(" " + JSON.parse(localStorage.getItem("userInfo")).firstName + " " + JSON.parse(localStorage.getItem("userInfo")).lastName);
    }
    
    if (app.getCookie("token") !== undefined) {
        $(".loading-nav-item").addClass("d-none");
        $(".dashboard-nav-item").removeClass("d-none");
        if (localStorage.getItem("userInfo") !== null) {
           Showheader();
        } else {
            app.loaduserInfo().then(()=>{
                Showheader();
            }).catch(()=>{
                $(".dashboard-nav-item img").attr("src", "https://static.ncdn.in/public/user.png");
            $(".user-profile-name").html(" Dashboard");
            })
        }
    } else {
        $(".login-navbar-item").removeClass("d-none");
        $(".loading-nav-item").addClass("d-none");
    }
    
    function navbar() {
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

    navbar();
})