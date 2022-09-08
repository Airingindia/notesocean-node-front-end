$(document).ready(function () {
    // get userdata 
    const userdata = JSON.parse(localStorage.getItem("userInfo"));
    console.log(userdata);
    $.ajax({
        type: "GET",
        url: app.getApi() + "/users/" + JSON.parse(getCookie("token").split(".")[1]).userUuid,
        beforeSend: function () {

        },
        success: function (data) {
            if (data.emailVerified) {
                window.location = "/dashboard";
            } else {
                show();
                sendCode();
            }
        }, error: function () {
            window.location = "/dashboard";
        }
    })

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
                        url: app.getApi() + "/authenticate/verify-email",
                        headers: {
                            Authorization: decodeURIComponent(getCookie("token"))
                        },
                        processData: false,
                        contentType: "application/json",
                        data: data,
                        beforeSend: function () {
                            $(".verify-btn").prop("disabled", true);
                            $(".verify-btn").html(`<i class="fa fa-spinner fa-spin mx-1"> </i> <span> verifing... </span>`);
                        },
                        success: function (data) {
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
                        }, error: function (error) {
                            new Noty({
                                theme: "nest",
                                type: "error",
                                text: 'Wrong code!',
                                timeout: 3000,
                                closeWith: ['click', 'button'],
                            }).show();
                        }
                    });
                } else {
                    window.location = "/dashboard";
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
                url: app.getApi() + "/authenticate/verify-email",
                headers: {
                    Authorization: decodeURIComponent(getCookie("token"))
                }, beforeSend: function () {

                },
                success: function (data) {
                    localStorage.setItem("emailData", JSON.stringify(data))
                    verify();
                }, error: function () {
                    window.location = "/dashboard";
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