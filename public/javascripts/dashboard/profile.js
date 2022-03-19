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
        $(".first-name").val(userInfo.firstName);
        $(".last-name").val(userInfo.lastName);
        $(".email").val(userInfo.email);
        $(".mobile").val(userInfo.phone);
        $(".address").val(userInfo.address);
        $(".country").val(userInfo.country);
        if (userInfo.emailVerified) {
            $(".email").removeClass("is-invalid");
            $(".email").addClass("is-valid");
        } else {
            $(".email").addClass("is-invalid");
            $(".email").removeClass("is-valid");
        }
    }

    //    change  profile picture
    $(".pic-chnage-btn").click(function () {
        var input = document.createElement("input");
        input.type = "file";
        input.accept = ".png,.jpg,.jpeg";
        $(input).click();
        $(input).on("change", function () {
            var file = this.files[0];
            var objUrl = URL.createObjectURL(file);
            // update  pic with ajax
            $.ajax({
                type: "PUT",
                url: sessionStorage.getItem("api"),
                data: file,
                beforeSend: function () { },
                success: function (data) {
                    // show succes messge to user
                }
            })
        })
    });

});



var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl, { html: true })
});