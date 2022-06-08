$(document).ready(function () {
    if (localStorage.getItem("token") !== null) {
        $(".loading-nav-item").addClass("d-none");
        $(".dashboard-nav-item").removeClass("d-none");

        if (localStorage.getItem("userdata") !== null) {
            let pic = JSON.parse(localStorage.getItem("userdata")).profileImage.replace("https://s3.ap-south-1.amazonaws.com/profiles.notesocean.com", "https://profiles.ncdn.in/fit-in/25x25");
            $(".dashboard-nav-item img").attr("src", pic);

            $(".user-profile-name").html(" " + JSON.parse(localStorage.getItem("userdata")).firstName + " " + JSON.parse(localStorage.getItem("userdata")).lastName);
        }

    } else {
        $(".login-navbar-item").removeClass("d-none");
        $(".loading-nav-item").addClass("d-none");
    }
})