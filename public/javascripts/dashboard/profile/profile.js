$(document).ready(function () {
    // get profile info
    //check if user has stored profile information 
    function first() {
        $.ajax({
            type: "GET",
            url: atob(decodeURIComponent(getCookie("api"))) + "/users/" + JSON.parse(atob(decodeURIComponent(getCookie("token")).split(".")[1])).userUuid,
            headers: {
                Authorization: getCookie("token")
            },
            success: function (data) {
                localStorage.setItem("userdata", JSON.stringify(data));
                showUserInfo(data);
            }
        })
    }
    function showUserInfo(userInfo) {
        $(".first-name").val(userInfo.firstName);
        $(".last-name").val(userInfo.lastName);
        $(".email").val(userInfo.email);
        $(".mobile").val(userInfo.phone);
        $(".address").val(userInfo.address);
        $(".country").val(userInfo.country);
        if (userInfo.profileImage !== null) {
            $(".user-profile-img").attr("src", userInfo.profileImage);
        }
        if (userInfo.emailVerified) {
            $(".email").removeClass("is-invalid");
            $(".email").addClass("is-valid");
            $(".email").next().html(`<span> Verified </span> `);
        } else {
            $(".email").addClass("is-invalid");
            $(".email").removeClass("is-valid");
            $(".email").next().next().html(`<span> Email is not verified </span> <a href="/dashboard/profile/verify-email" class="mx-2"> Verify</a>`);
        }

        if (userInfo.phoneVerified) {
            $(".mobile").removeClass("is-invalid");
            $(".mobile").addClass("is-valid");
            $(".mobile").next().next().html(`<span>Verified</span>`);
        } else {
            $(".mobile").addClass("is-invalid");
            $(".mobile").removeClass("is-valid");
            $(".mobile").next().next().html(`<span> Mobile  is not verified </span> <a href="/dashboard/profile/verify-mobile" class="mx-2"> Verify</a>`);
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
            const data = JSON.parse(localStorage.getItem("userdata"));
            var imgObj = URL.createObjectURL(file);
            var jsonData = {
                firstName: data.firstName,
                email: data.email,
                lastName: data.lastName,
                phone: data.phone,
                address: data.address,
                country: data.country
            }

            var formdata = new FormData();
            formdata.append("users", new Blob([JSON.stringify(jsonData)], { type: "application/json" }));
            formdata.append("file", file);
            // update  pic with ajax
            $.ajax({
                type: "PUT",
                url: atob(getCookie("api")) + "/users/" + JSON.parse(atob(getCookie("token").split(".")[1])).userId,
                processData: false,
                contentType: false,
                data: formdata,
                headers: {
                    Authorization: getCookie("token")
                },
                beforeSend: function () {
                    $(".pic-uploading-roller").removeClass("d-none");
                    $(".user-profile-img").addClass("d-none");
                    $(".pic-chnage-btn").html(` <span> Updating ... </span>`);
                },
                success: function (data) {
                    $(".pic-chnage-btn").html(`Change`);
                    $(".pic-uploading-roller").addClass("d-none");
                    $(".user-profile-img").removeClass("d-none");
                    $(".profile-update-btn").prop("disabled", false);
                    localStorage.setItem("userdata", JSON.stringify(data));
                    $(".user-profile-img").attr("src", imgObj);
                    $(".notice-box").html(` <div id="liveToast" class="toast fade show border-0" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header bg-success text-light">
                    <strong class="me-auto">Success!</strong> <i class="fa fa-times close close-notice" data-dismiss="toast" aria-label="Close"> </i>
                </div>
                <div class="toast-body">
                   <span>  Picture updated </span>
                </div>
            </div>`);
                    setTimeout(() => {
                        $(".notice-box").html("");
                    }, 3000);
                },
                error: function (err) {
                    $(".pic-chnage-btn").html(`Change`);
                    $(".pic-uploading-roller").addClass("d-none");
                    $(".user-profile-img").removeClass("d-none");
                    $(".profile-update-btn").prop("disabled", false);
                    $(".profile-update-btn").prop("disabled", false);
                    $(".profile-update-btn").html(`Update`);
                    $(".notice-box").html(` <div id="liveToast" class="toast fade show border-0" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header bg-danger text-light">
                        <strong class="me-auto">Error!</strong> <i class="fa fa-times close close-notice" data-dismiss="toast" aria-label="Close"> </i>
                    </div>
                    <div class="toast-body">
                       <span>Picture not updated </span>
                    </div>
                </div>`);
                    setTimeout(() => {
                        $(".notice-box").html("");
                    }, 3000);
                }
            })
        })
    });

    if (localStorage.getItem("countriesData") == null) {
        $.getScript('/vendors/data/countries.json', function (data) {
            data = JSON.parse(data);
            localStorage.setItem("countriesData", JSON.stringify(data));
            for (let i = 0; i < data.length; i++) {
                const short_code = data[i].abbreviation;
                const name = data[i].country;
                $(".country").append(`<option value="${short_code}"> ${name} </option>`);
            }
            first();
        });
    } else {
        const data = JSON.parse(localStorage.getItem("countriesData"));
        for (let i = 0; i < data.length; i++) {
            const short_code = data[i].abbreviation;
            const name = data[i].country;
            $(".country").append(`<option value="${short_code}"> ${name} </option>`);
        }
        first();
    }

    // update user profile information
    $(".profile-update-btn").click(function () {
        const firstName = $(".first-name").val();
        const lastName = $(".last-name").val();
        const email = $(".email").val();
        const mobile = $(".mobile").val();
        const address = $(".address").val();
        const country = $(".country").val();
        const data = {
            firstName: firstName,
            lastName: lastName,
            phone: mobile,
            address: address,
            country: country,
            email: email
        };
        var formdata = new FormData();
        formdata.append("users", new Blob([JSON.stringify(data)], { type: "application/json" }));
        var inputCount = 0;

        $(".input-item").each(function () {

            if ($(this).val().trim().length !== 0) {
                // first and late name validation
                $(this).addClass("is-valid");
                $(this).removeClass("is-invalid");
                $(this).next().html(`<span>Looks good </span>`);
                inputCount++;
            } else {

                $(this).addClass("is-invalid");
                $(this).removeClass("is-valid");
                $(this).next().next().html(`<span>This field should not be empty </span>`);
                const id = $(this).attr("id");
                $(id).click();
                window.location = window.location.pathname + "#" + id;
                return;
            }
        });

        if (inputCount == 6) {
            $.ajax({
                type: "PUT",
                url: atob(getCookie("api")) + "/users/" + JSON.parse(atob(getCookie("token").split(".")[1])).userId,
                processData: false,
                contentType: false,
                data: formdata,
                headers: {
                    Authorization: getCookie("token")
                },
                beforeSend: function () {
                    $(".profile-update-btn").prop("disabled", true);
                    $(".profile-update-btn").html(`<i class="fa fa-spinner fa-spin mx-2"> </i> <span> please wait ... </span>`);
                },
                success: function (data) {
                    $(".profile-update-btn").prop("disabled", false);
                    $(".profile-update-btn").html(`Update`);
                    localStorage.setItem("userdata", JSON.stringify(data));
                    $(".notice-box").html(` <div id="liveToast" class="toast fade show border-0" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header bg-success text-light">
                    <strong class="me-auto">Success!</strong> <i class="fa fa-times close close-notice" data-dismiss="toast" aria-label="Close"> </i>
                </div>
                <div class="toast-body">
                   <span>  Profile updated </span>
                </div>
            </div>`);
                    setTimeout(() => {
                        $(".notice-box").html("");
                    }, 3000);
                },
                error: function (err) {
                    $(".profile-update-btn").prop("disabled", false);
                    $(".profile-update-btn").html(`Update`);
                    $(".notice-box").html(` <div id="liveToast" class="toast fade show border-0" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header bg-danger text-light">
                        <strong class="me-auto">Error!</strong> <i class="fa fa-times close close-notice" data-dismiss="toast" aria-label="Close"> </i>
                    </div>
                    <div class="toast-body">
                       <span> ${err.responseJSON.description} </span>
                    </div>
                </div>`);
                    setTimeout(() => {
                        $(".notice-box").html("");
                    }, 3000);
                }
            });
        }
    });


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
});