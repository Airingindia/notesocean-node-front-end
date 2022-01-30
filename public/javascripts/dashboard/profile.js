$(document).ready(function () {
    // get profile info
    //check if user has stored profile information 
    const userid = sessionStorage.getItem('userid');
    const token = localStorage.getItem('token');
    if (localStorage.getItem('userInfo') !== null) {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        showUserInfo(userInfo);
    } else {
        if (userid !== null) {
            $.ajax({
                type: "GET",
                url: sessionStorage.getItem("api") + "/users/" + userid,
                headers: {
                    Authorization: token
                },
                success: function (data) {
                    const userInfo = JSON.stringify({
                        firstName: data.firstName,
                        lastName: data.lastName,
                        email: data.email,
                        address: data.address,
                        country: data.country,
                        phone: data.phone,
                        profileImage: data.profileImage,
                        emailVerified: data.emailVerified
                    });
                    console.log(data);
                    localStorage.setItem('userInfo', userInfo);
                    showUserInfo(userInfo);
                },
                error: function (err) {
                    window.location = "/account/login";
                }
            })
        } else {
            window.reload();
        }
    }

    function showUserInfo(userInfo) {
        console.log(userInfo);
        $(".user-info .first-name").html(userInfo.firstName);
        $(".user-info .last-name").html(userInfo.lastName);
        $(".user-info .email").html(userInfo.email);
        $(".user-info .mobile").html(userInfo.phone);
        $(".user-address .address").html(userInfo.address);
        $(".user-address .country").html(userInfo.country);
        if (userInfo.emailVerified) {
            $(".emailverified").removeClass("d-none");
        } else {
            $(".emailUnverified").removeClass("d-none");
        }
    }

});



var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl, { html: true })
});