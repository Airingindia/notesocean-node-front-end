$(document).ready(function () {
    // get profile info
    //check if user has stored profile information 
    const userid = sessionStorage.getItem('userid');
    const token = localStorage.getItem('token');
    if (localStorage.getItem('userdata') !== null) {
        const userInfo = JSON.parse(localStorage.getItem('userdata'));
        showUserInfo(userInfo);
    }
    function showUserInfo(userInfo) {
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

        if (userInfo.phoneVerified) {
            $(".mobile").removeClass("is-invalid");
            $(".mobile").addClass("is-valid");
        } else {
            $(".mobile").addClass("is-invalid");
            $(".mobile").removeClass("is-valid");
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

    $.getScript('/vendors/data/countries.json', function (data) {
        data = JSON.parse(data);
        for (let i = 0; i < data.length; i++) {
            const short_code = data[i].abbreviation;
            const name = data[i].country;
            $(".country").append(`<option value="${short_code}"> ${name} </option>`);
        }
    });
});



var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl, { html: true })
});