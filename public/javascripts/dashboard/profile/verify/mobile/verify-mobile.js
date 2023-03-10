$(document).ready(function () {
    const userdata = JSON.parse(localStorage.getItem("userInfo"));
    $(".user-Mobile-label").html(userdata.phone);
    // $("input").each(function () {
    //     $(this).on("input", function () {

    //         if ($(this).val().length == 1) {
    //             if (isNaN($(this).val()) == false) {
    //                 $(this).next().focus();
    //             } else {
    //                 $(this).val("");
    //             }
    //         }

    //     });

    //     // detect key code
    //     $(this).keyup(function (event) {
    //         if (event.keyCode === 8 || event.keyCode == 46) {
    //             $(this).prev().focus();
    //         }
    //     });

    // });

    // $("input").each(function () {
    //     $(this).on("input", function () {
    //         $(this).css({ "border": "1px solid #ccc" });
    //     })
    //     $(this).on("focus", function () {
    //         $(this).css({ "border": "1px solid #ccc" });
    //     })
    //     $(this).click(function () {
    //         $(this).css({ "border": "1px solid #ccc" });
    //     })
    // });


    function sendCode() {
        $.ajax(
            {
                type: "GET",
                url: app.getApi() + "/authenticate/verify-phone",
                headers: {
                    Authorization: app.getToken()
                }, beforeSend: function () {

                },
                success: function (data) {
                    $(".user-email-label").html(data.phone);
                    app.alert(200, "code sent to your phone!");

                    // verify

                    $(".verify-btn").click(function () {
                        var count = 0;
                        data.code = $("input").val();
                        $.ajax({
                            type: "POST",
                            url: app.getApi() + "/authenticate/verify-phone",
                            headers: {
                                Authorization: app.getToken()
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
                                    userdata.phoneVerified = true;
                                    localStorage.setItem("userInfo", JSON.stringify(userdata));
                                    new Noty({
                                        theme: "nest",
                                        type: "success",
                                        text: 'Phone verified successfully!',
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
                                app.alert(400, "Somthing went wrong , please try again later");
                                $(".verify-btn").prop("disabled", false);
                                $(".verify-btn").html(`Verify`);
                            }
                        });
                    });
                }, error: function (error) {
                    app.alert(error.status, "Faild to send verification code!, please try again")
                    // window.location = "/dashboard";
                }
            }
        )
    }
    $(".resend-btn").click(function () {
        window.location = location.href;
    });
    sendCode();
})