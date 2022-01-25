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
                $(".notice-box").html(` <div id="liveToast" class="toast fade show border-0" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header bg-success text-light">
                    <strong class="me-auto"> Success!</strong>
                </div>
                <div class="toast-body">
                    Login successful
                </div>
            </div>`);
                window.location = "/dashboard";
            },
            error: function (err) {
                const errortext = err.responseJSON.description;
                $(".notice-box").html(` <div id="liveToast" class="toast  fade show border-0" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header bg-danger text-light">
                    <strong class="me-auto">Error!</strong>
                </div>
                <div class="toast-body">
                    ${errortext}
                </div>
            </div>`);
            }
        })
    });


    // log out

})