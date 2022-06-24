
$(document).ready(function () {
    // form validations 
    $("form").submit(function (event) {
        event.preventDefault();
        let firstName = $("form input[name='fistName']").val();
        let lastName = $("form input[name='lastName']").val();
        let email = $("form input[name='email']").val();
        let mobile = $("form input[name='phone']").val();
        let choosePassword = $("form input[name='password']").val();
        var form = new FormData();
        const usersData = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: mobile,
            password: choosePassword
        }
        form.append("users", new Blob([JSON.stringify(usersData)], { type: "application/json" }));
        $.ajax({
            type: "POST",
            url: atob(getCookie("api")) + "/users",
            processData: false,
            contentType: false,
            data: form,
            beforeSend: function () {
                $(".signup-btn").prop("disabled", true);
                $(".signup-btn").html(`<i class="fa fa-spinner fa-spin mx-1"> </i>  <span> please wait ... </span>`);
            },
            success: function (data) {
                localStorage.setItem("userInfo", JSON.stringify(data));
                new Noty({
                    theme: "nest",
                    type: "success",
                    text: '<i class="fa fa-check-circle">  </i> Account Created Successfully',
                    timeout: 3000,
                }).show();
                setTimeout(function () {
                    $.ajax({
                        type: "POST",
                        url: atob(getCookie("api")) + "/authenticate/email-sign-in",
                        processData: false,
                        contentType: "application/json",
                        data: JSON.stringify({
                            email: email,
                            password: choosePassword
                        }),
                        success: function (data) {
                            const authToken = data.token;
                            setCookie("token", authToken, 100);
                            window.location = "/dashboard";
                        }, error: function (jqXHR, textStatus) {
                            new Noty({
                                theme: "nest",
                                type: "error",
                                text: '<i class="fa fa-check-circle">  </i> Failed to auto login  , please login again',
                                timeout: 3000,
                            }).show();
                            setTimeout(() => {
                                window.location = "/login";
                            }, 1000);
                        }
                    })
                }, 1000);
            },
            error: function (err) {
                $(".signup-btn").prop("disabled", false);
                $(".signup-btn").html(`Signup`);
                if (err.status == 0) {
                    new Noty({
                        theme: "nest",
                        type: "error",
                        text: '<i class="fa fa-check-circle">  </i> Failed  to connect server , please check your internet connection ',
                        timeout: 5000,
                    }).show();
                }
                else if (err.status == 406) {
                    $(".signup-btn").prop("disabled", false);
                    $(".signup-btn").html(`Signup`);
                    const errortext = err.responseJSON.description;
                    new Noty({
                        theme: "nest",
                        type: "error",
                        text: '<i class="fa fa-check-circle">  </i> Failed  , ' + errortext,
                        timeout: 5000,
                    }).show();
                }
                else {
                    new Noty({
                        theme: "nest",
                        type: "error",
                        text: '<i class="fa fa-check-circle">  </i> Somthing went wrong , please try again later',
                        timeout: 5000,
                    }).show();

                    amplitude.getInstance().logEvent("error", {
                        page: "signup",
                        coause: "undefined response from server"
                    });
                }
            },

        })
    });

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
});