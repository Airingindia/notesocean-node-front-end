$(document).ready(function () {

    window.onload = function () {
        $("form").submit(function (event) {
            event.preventDefault();
            let email = $("form input[type='email'").val();
            let password = $("form input[type='password']").val();
            const userData = {
                "email": email,
                "password": password
            }
            $.ajax({
                type: "POST",
                url: atob(getCookie("api")) + "/authenticate/email-sign-in",
                processData: false,
                contentType: "application/json",
                data: JSON.stringify(userData),
                beforeSend: function () {
                    $(".login-btn").prop("disabled", true);
                    $(".login-btn").html("please wait ...");
                },
                success: function (data) {
                    $(".login-btn").html("Login");
                    $(".login-btn").prop("disabled", false);
                    const authToken = data.token;
                    setCookie("token", authToken, 100);
                    new Noty({
                        theme: "nest",
                        type: "success",
                        text: '<i class="fa fa-check-circle">  </i>  Login Successful',
                        timeout: 3000,
                    }).show();
                    window.location = "/dashboard";
                },
                complete: function (data) {
                    if (data.status == 400) {
                        new Noty({
                            theme: "nest",
                            type: "error",
                            text: '<i class="fa fa-check-circle">  </i> Incorrect email address or password',
                            timeout: 3000,
                            closeWith: ['click', 'button'],
                        }).show();
                        $(".login-btn").html("Login");
                        $(".login-btn").prop("disabled", false);
                    }
                    if (data.status == 0) {
                        new Noty({
                            theme: "nest",
                            type: "error",
                            text: '<i class="fa fa-check-circle">  </i> Failed to connect server , please try again',
                            timeout: 3000,
                            closeWith: ['click', 'button'],
                        }).show();
                        $(".login-btn").html("Login");
                        $(".login-btn").prop("disabled", false);
                    }
                }
            })
        });
    }

    if (getCookie("token") !== undefined) {
        // auto login
        window.location = "/dashboard";
        // console.log(getCookie("token"));
    }
    function setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
})