$(document).ready(function () {
    // send reset password email
    $(".send-code").click(function () {
        let email = $(`input[name="email"]`).val();
        //    validate email using regex
        if (email.match(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/)) {
            // send email
            var resetData = {};
            $.ajax({
                type: "GET",
                url: app.getApi() + "/authenticate/forget-email/" + email,
                beforeSend: function () {
                    $(".send-code").html("Sending...");
                    $(".send-code").prop("disabled", true);
                },
                success: function (data) {
                    $(".send-code").html("Send Code");
                    $(".send-code").prop("disabled", false);
                    // check data has secret key
                    if (data.secret) {
                        resetData = data;
                    } else {
                        app.alert(400, "Email not found");
                        return false;
                    }
                    $(".email-form").addClass("d-none");
                    $(".verify-form").removeClass("d-none");

                    $(".reset-password").click(function () {
                        let code = $(`input[name="code"]`).val();
                        let password = $(`input[name="new-password"]`).val();
                        let confirmPassword = $(`input[name="confirm-password"]`).val();
                        // check both password are same
                        if (password === confirmPassword) {
                            resetData.code = code;
                            resetData.password = password;
                            // send reset password request to  /authenticate/forget-email/
                            $.ajax({
                                type: "POST",
                                url: app.getApi() + "/authenticate/forget-email/",
                                data: JSON.stringify(resetData),
                                contentType: "application/json",
                                processData: false,
                                beforeSend: function () {
                                    $(".reset-password").html("Resetting...");
                                    $(".reset-password").prop("disabled", true);
                                },
                                success: function (data) {
                                    $(".reset-password").html("Reset Password");
                                    $(".reset-password").prop("disabled", false);
                                    if (data) {
                                        app.alert(200, "Password reset successfully");
                                        setTimeout(function () {
                                            window.location.href = "/login";
                                        }, 2000);
                                    } else {
                                        app.alert(400, "Invalid code");
                                    }
                                },
                                error: function (err) {
                                    app.alert(err.status, err.responseJSON.message ? err.responseJSON.message : "Something went wrong");
                                }
                            })
                        } else {
                            app.alert(400, "Password not matched");
                        }
                    });
                },
                error: function (err) {
                    app.alert(err.status, err?.responseJSON?.message ? err?.responseJSON?.message : "Something went wrong");
                }
            })
        } else {
            app.alert(400, "Invalid email address");
        }
    })
});