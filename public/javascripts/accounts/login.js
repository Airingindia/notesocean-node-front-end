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
                if (userinfo == null || userinfo == undefined) {
                    $.ajax({
                        type: "GET",
                        url: app.getApi() + "/users/self",
                        processData: false,
                        contentType: "application/json",
                        headers: {
                            Authorization: authToken
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
                            app.alert(err.status, err?.responseJSON?.message ? err?.responseJSON?.message : "Something went wrong");
                            window.location = "/dashboard";
                        }
                    })
                } else {
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
                app.alert(err.status, err?.responseJSON?.message ? err?.responseJSON?.message : "Something went wrong");
                $(".login-btn").html("Login");
                $(".login-btn").prop("disabled", false);
            }
        })
    });

    function oauthSignIn() {
        let client_id =  "668870100811-hsad60ke75oidb448jsiortuv7ols51j.apps.googleusercontent.com"
        let secret =    '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';
        let redirect_uri = 'https://dev.notesocean.com/login';

        // Google's OAuth 2.0 endpoint for requesting an access token
        var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
      
        // Create <form> element to submit parameters to OAuth 2.0 endpoint.
        var form = document.createElement('form');
        form.setAttribute('method', 'GET'); // Send as a GET request.
        form.setAttribute('action', oauth2Endpoint);
      
        // Parameters to pass to OAuth 2.0 endpoint.
        var params = {'client_id': `${client_id}`,
                      'redirect_uri': `${redirect_uri}`,
                      'response_type': 'token',
                      'scope': 'https://www.googleapis.com/auth/plus.login  https://www.googleapis.com/auth/userinfo.email',
                      'include_granted_scopes': 'true',
                      'state': 'pass-through value'};
      
        console.log("line125",params)
        // Add form parameters as hidden input values.
        for (var p in params) {
          var input = document.createElement('input');
          input.setAttribute('type', 'hidden');
          input.setAttribute('name', p);
          input.setAttribute('value', params[p]);
          form.appendChild(input);
        }
      
        // Add form to page and submit it to open the OAuth 2.0 endpoint.
        document.body.appendChild(form);
        form.submit();
      }

      $('.google-sign-in-container').click(function(){
        oauthSignIn()
      })

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

    const url = window.location.href;

    // Extract the query parameters from the URL
    const params = new URLSearchParams(url.split('#')[1]);
    
    // Get the value of the 'access_token' parameter
    const accessToken = params.get('access_token');
    if(accessToken!=undefined || accessToken!=null){
        console.log("line157".accessToken)
        validGoogleAuthByToken(accessToken)
    }

    function validGoogleAuthByToken(token) {
        $.ajax({
            type: "POST",
            url: app.getApi() + "/authenticate/google-sign-in",
            processData: false,
            contentType: "application/json",
            data: JSON.stringify({token:token}),
            beforeSend: function (xhr) {
                console.log("before send");
            },
            success: function (data) {
                const authToken = data.token;
                let userinfo = localStorage.getItem("userInfo");


                setCookie("token", authToken, 100);
                $.ajax({
                    type: "GET",
                    url: app.getApi() + "/users/self",
                    processData: false,
                    contentType: "application/json",
                    headers: {
                        Authorization: authToken
                    },
                    beforeSend: function (xhr) {
                        console.log("before send");
                    },
                    success: function (data) {
                        console.log("line 180",data,"token",authToken,)
                        localStorage.setItem("userInfo", JSON.stringify(data));
                        setCookie("token", authToken, 100);
                        window.location = "/dashboard";
                    
                        app.alert(200, "Login successful");
                    },
                    error: function (err) {
                        app.alert(err.status, err?.responseJSON?.message ? err?.responseJSON?.message : "Something went wrong");
                        window.location = "/dashboard";
                    }
                })
                 
                
            },
            error: function (err) {
                console.log("line 181",err);
            }
        })
    }
})