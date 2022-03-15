$(document).ready(function () {
    //    input label toggle
    $("input").each(function () {
        $(this).click(function () {
            $(this).parent().find('label').removeClass('d-none');
            $(this).parent().find('i').css({
                "margin-top": "25px"
            });
            $(this).attr("placeholder", "");
        });
        $(this).on("blur", function () {
            $(this).parent().find('label').addClass('d-none');
            const placeholder = $(this).parent().find('label').attr("for");
            $(this).attr("placeholder", placeholder);
            $(this).parent().find('i').css({
                "margin-top": "0px"
            });
        });

        $(this).on("change", function () {
            $(this).parent().find('label').addClass('d-none');
            const placeholder = $(this).parent().find('label').attr("for");
            $(this).attr("placeholder", placeholder);
        });
    });;

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
            url: sessionStorage.getItem("api") + "/authenticate/email-sign-in",
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
                localStorage.setItem("token", authToken);
                setCookie("token", authToken, 100);
                $(".notice-box").html(` <div id="liveToast" class="toast fade show border-0" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header bg-success text-light">
                    <strong class="me-auto"> <i  class="fa fa-check-circle text-white mx-1"> </i>  Success!</strong>
                </div>
                <div class="toast-body">
                    Login successful
                </div>
            </div>`);
                window.location = "/dashboard";
            },
            error: function (err) {
                $(".login-btn").html("Login");
                $(".login-btn").prop("disabled", false);
                const errortext = err.responseJSON.description;
                $(".notice-box").html(` <div id="liveToast" class="toast  fade show border-0" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header bg-danger text-light">
                    <strong class="me-auto">  <i  class="fa fa-info-circle text-white mx-1"> </i> Error!</strong>
                </div>
                <div class="toast-body">
                    ${errortext}
                </div>
            </div>`);
            }
        })
    });

    if (localStorage.getItem("token") !== null) {
        // auto login
        window.location = "/dashboard";
        // console.log("okay");
    }

    $(".google-auth-btn").click(function () {
        window.location = sessionStorage.getItem("api") + "/authenticate/google-sign-in";
    });

    function setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    // log out

})