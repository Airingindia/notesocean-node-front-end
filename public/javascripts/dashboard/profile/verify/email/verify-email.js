$(document).ready(function () {
    // get userdata 
    $.ajax({
        type: "GET",
        url: atob(getCookie("api")) + "/users/" + JSON.parse(atob(getCookie("token").split(".")[1])).userId,
        beforeSend: function () {

        },
        success: function (data) {
            if (data.emailVerified) {
                window.location = "/dashboard/profile/verified-email";
            } else {
                show();
                sendCode();
            }
        }, error: function () {
            window.location = "/dashboard/profile";
        }
    })
    const userdata = JSON.parse(localStorage.getItem("userdata"));
    function show() {
        $(".user-email-label").html(userdata.email);
        $("input").each(function () {
            $(this).on("input", function () {

                if ($(this).val().length == 1) {
                    if (isNaN($(this).val()) == false) {
                        $(this).next().focus();
                    } else {
                        $(this).val("");
                    }
                }

            });

            // detect key code
            $(this).keyup(function (event) {
                if (event.keyCode === 8 || event.keyCode == 46) {
                    $(this).prev().focus();
                }
            });

        });

        $("input").each(function () {
            $(this).on("input", function () {
                $(this).css({ "border": "1px solid #ccc" });
            })
            $(this).on("focus", function () {
                $(this).css({ "border": "1px solid #ccc" });
            })
            $(this).click(function () {
                $(this).css({ "border": "1px solid #ccc" });
            })
        });
    }

    function verify() {
        $(".verify-btn").click(function () {
            var count = 0;
            var code = "";
            $("input").each(function () {
                if ($(this).val().length !== 0) {
                    count++;
                    code += $(this).val();
                }
            });

            if (count == 6) {
                if (localStorage.getItem("emailData") !== null) {
                    var data = JSON.parse(localStorage.getItem("emailData"));
                    data.code = Number(code);
                    data = JSON.stringify(data);
                    // verify otp
                    $.ajax({
                        type: "POST",
                        url: atob(getCookie("api")) + "/authenticate/verify-email",
                        headers: {
                            Authorization: getCookie("token")
                        },
                        processData: false,
                        contentType: "application/json",
                        data: data,
                        beforeSend: function () {
                            $(".verify-btn").prop("disabled", true);
                            $(".verify-btn").html(`<i class="fa fa-spinner fa-spin mx-1"> </i> <span> verifing... </span>`);
                        },
                        success: function (data) {
                            $(".verify-btn").prop("disabled", false);
                            $(".verify-btn").html(`verify`);
                            if (data) {
                                const userdata = JSON.parse(localStorage.getItem("userdata"));
                                userdata.emailVerified = true;
                                localStorage.setItem("userdata", JSON.stringify(userdata));
                                $(".notice-box").html(` <div id="liveToast" class="toast fade show border-0" role="alert" aria-live="assertive" aria-atomic="true">
                            <div class="toast-header bg-success text-light">
                                <strong class="me-auto">Success !</strong> <i class="fa fa-times close close-notice" data-dismiss="toast" aria-label="Close"> </i>
                            </div>
                            <div class="toast-body">
                               <span> your email is successfully verified </span>
                            </div>
                        </div>`);
                                setTimeout(() => {
                                    $(".notice-box").html("");
                                    window.location = "/dashboard/profile/verified-email";
                                }, 2000);
                            } else {
                                $(".notice-box").html(` <div id="liveToast" class="toast fade show border-0" role="alert" aria-live="assertive" aria-atomic="true">
                        <div class="toast-header bg-danger text-light">
                            <strong class="me-auto">Error !</strong> <i class="fa fa-times close close-notice" data-dismiss="toast" aria-label="Close"> </i>
                        </div>
                        <div class="toast-body">
                           <span> Incorrect verification code, please enter valide code </span>
                        </div>
                    </div>`);
                                setTimeout(() => {
                                    $(".notice-box").html("");
                                }, 5000);
                            }
                        }, error: function () {
                            $(".verify-btn").prop("disabled", false);
                            $(".verify-btn").html(`verify`);

                            $(".notice-box").html(` <div id="liveToast" class="toast fade show border-0" role="alert" aria-live="assertive" aria-atomic="true">
                        <div class="toast-header bg-danger text-light">
                            <strong class="me-auto">Error !</strong> <i class="fa fa-times close close-notice" data-dismiss="toast" aria-label="Close"> </i>
                        </div>
                        <div class="toast-body">
                           <span> Failed to validate your code , please try again  </span>
                        </div>
                    </div>`);
                            setTimeout(() => {
                                $(".notice-box").html("");
                            }, 5000);
                        }
                    });
                } else {
                    window.location = "/dashboard/profile";
                }
            } else {
                $("input").each(function () {
                    if ($(this).val().length == 0) {
                        $(this).css({ "border": "1px solid red" });
                    }
                });
            }
        });
    }

    function sendCode() {
        $.ajax(
            {
                type: "GET",
                url: atob(getCookie("api")) + "/authenticate/verify-email",
                headers: {
                    Authorization: getCookie("token")
                }, beforeSend: function () {

                },
                success: function (data) {
                    localStorage.setItem("emailData", JSON.stringify(data))
                    verify();
                }, error: function () {
                    $(".notice-box").html(` <div id="liveToast" class="toast fade show border-0" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header bg-danger text-light">
                        <strong class="me-auto">Error !</strong> <i class="fa fa-times close close-notice" data-dismiss="toast" aria-label="Close"> </i>
                    </div>
                    <div class="toast-body">
                       <span> Failed to send verification to your email , plese try after sometimes  </span>
                    </div>
                </div>`);
                    setTimeout(() => {
                        $(".notice-box").html("");
                    }, 5000);
                }
            }
        )
    };

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
})