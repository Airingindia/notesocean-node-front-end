
$(document).ready(function () {
    $('#countries').select2({
        placeholder: 'Select your country',
        selectOnClose: false,
        width: '100%'
    });

    $.ajax({
        type: "GET",
        url: app.getApi() + "/countries",
        success: function (data) {
            for (let i = 0; i < data.requested.length; i++) {
                const short_code = data.requested[i].iso3;
                const name = data.requested[i].niceName;
                $("#countries").append(`<option value="${short_code}"> ${name} </option>`);
            }
            setTimeout(() => {
                $.getJSON('https://ipapi.co/json', function (data) {
                    // $('#countries').val(data.country_code_iso3);
                    $('#countries').select2().val(data.country_code_iso3).trigger("change");
                });
            }, 1000)
        },
        error: function (err) {
            app.alert(err.status, err?.responseJSON?.message ? err?.responseJSON?.message : "Something went wrong");
        }
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


    $("form.signup-form").submit(function (event) {
        event.preventDefault();
        let firstName = $("form input[name='fistName']").val();
        let lastName = $("form input[name='lastName']").val();
        let email = $("form input[name='email']").val();
        let mobile = $("form input[name='phone']").val();
        let choosePassword = $("form input[name='password']").val();
        let address = $("form input[name='address']").val();
        let country = $("#countries").val();
        var form = new FormData();
        const usersData = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: mobile,
            password: choosePassword,
            address: address,
            country: country
        }
        form.append("users", new Blob([JSON.stringify(usersData)], { type: "application/json" }));
        $.ajax({
            type: "POST",
            url: app.getApi() + "/users",
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
                        url: app.getApi() + "/authenticate/email-sign-in",
                        processData: false,
                        contentType: "application/json",
                        data: JSON.stringify({
                            email: email,
                            password: choosePassword
                        }),
                        success: function (data) {
                            const authToken = data.token;
                            setCookie("token", authToken, 1);
                            window.location = "/dashboard";
                        }, error: function (err) {
                            app.alert(err.status, err?.responseJSON?.message ? err?.responseJSON?.message : "Something went wrong");
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
                app.alert(err.status, err?.responseJSON?.message ? err?.responseJSON?.message : "Something went wrong");
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
});