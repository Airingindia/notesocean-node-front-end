$(document).ready(function () {
    $("form.login-form").submit(function (event) {
        event.preventDefault();
        let remember = $("input.remember-me-checked");
        let isChecked = $(remember).prop("checked");
        let email = $("form input[type='email'").val();
        let password = $("form input[type='password']").val();
        const userData = {
            "email": email,
            "password": password
        }
        $.ajax({
            type: "POST",
            url: app.getApi() + "/authenticate/email-sign-in",
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
               let userinfo = localStorage.getItem("userInfo");
               if(userinfo == null || userinfo == undefined) {
                   $.ajax({
                          type: "GET",
                            url: app.getApi() + "/users/self",
                            processData: false,
                            contentType: "application/json",
                            headers: {
                              Authorization:authToken
                            },
                            beforeSend: function (xhr) {
                                console.log("before send");
                            },
                           success: function (data) {
                               localStorage.setItem("userInfo", JSON.stringify(data));
                               if (isChecked) {
                                   setCookie("token", authToken, 100);
                                   let loginDest = window.location.search.split("?dest=")[1];
                                   if (loginDest !== undefined) {
                                       window.location.href = loginDest + window.location.hash.trim();
                                   } else {
                                       window.location = "/dashboard";
                                   }
                               } else {
                                   setCookie("token", authToken, 1);
                                   let loginDest = window.location.search.split("?dest=")[1];
                                   if (loginDest !== undefined) {
                                       window.location.href = loginDest + window.location.hash.trim();
                                   } else {
                                       window.location = "/dashboard";
                                   }

                               }
                               app.alert(200, "Login successful");
                          },
                            error: function (err) {
                              app.alert(err.status,"Faild to get user info");
                              window.location = "/dashboard";
                            }
                   })
               }else{
                   if (isChecked) {
                       setCookie("token", authToken, 100);
                       let loginDest = window.location.search.split("?dest=")[1];
                       if (loginDest !== undefined) {
                           window.location.href = loginDest + window.location.hash.trim();
                       } else {
                           window.location = "/dashboard";
                       }
                   } else {
                       setCookie("token", authToken, 1);
                       let loginDest = window.location.search.split("?dest=")[1];
                       if (loginDest !== undefined) {
                           window.location.href = loginDest + window.location.hash.trim();
                       } else {
                           window.location = "/dashboard";
                       }

                   }
                   app.alert(200, "Login successful");
               }
            },
            error: function (err) {
               app.alert(err.status, err.responseJSON.description);
                $(".login-btn").html("Login");
                $(".login-btn").prop("disabled", false);
            }
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
})