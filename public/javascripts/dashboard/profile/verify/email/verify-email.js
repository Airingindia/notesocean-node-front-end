$(document).ready(function () {
    // get userdata 




    $(".resend-btn").click(function () {
        window.location = location.href;
    });

    function sendCode() {
        $.ajax(
            {
                type: "GET",
                url: app.getApi() + "/authenticate/verify-email",
                headers: {
                    Authorization: getCookie("token")
                }, beforeSend: function () {
                    app.alert(200, "Sending code to your email address!");
                },
                success: function (data) {
                    $(".user-email-label").html(data.email);
                    app.alert(200, "code sent to your email address!");

                    // verify

                    $(".verify-btn").click(function () {
                        var count = 0;
                        if ($("input").val().length == 6) {
                            count = 6;
                        }

                        data.code = $("input").val()

                        if (count == 6) {
                            $.ajax({
                                type: "POST",
                                url: app.getApi() + "/authenticate/verify-email",
                                headers: {
                                    Authorization: getCookie("token")
                                },
                                processData: false,
                                contentType: "application/json",
                                data: JSON.stringify(data),
                                beforeSend: function () {
                                    $(".verify-btn").prop("disabled", true);
                                    $(".verify-btn").html(`<i class="fa fa-spinner fa-spin mx-1"> </i> <span> verifing... </span>`);
                                },
                                success: function (data) {
                                    if (data) {
                                        const userdata = JSON.parse(localStorage.getItem("userInfo"));
                                        userdata.emailVerified = true;
                                        localStorage.setItem("userInfo", JSON.stringify(userdata));
                                        new Noty({
                                            theme: "nest",
                                            type: "success",
                                            text: 'Email verified successfully!',
                                            timeout: 3000,
                                            closeWith: ['click', 'button'],
                                        }).show();

                                        window.location = "/dashboard";

                                    } else {
                                        app.alert(400, "Invalid code , please enter correct code")
                                    }
                                    $(".verify-btn").prop("disabled", false);
                                    $(".verify-btn").html(`Verify`);
                                }, error: function (error) {
                                    app.alert(error.status, "Somthing went wrong , please try again later");
                                    $(".verify-btn").prop("disabled", false);
                                    $(".verify-btn").html(`Verify`);
                                }
                            });
                        } else {
                            $("input").css({ "border": "1px solid red" });
                            app.alert(400, "Enter 6 digit code!");
                        }
                    });
                }, error: function (error) {
                    app.alert(400, "Faild to send verification code!, please try again")
                }
            }
        )
    }

    sendCode();


    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    // logout
    $(".logout-btn").click(function () {
        app.logout();
    })
})