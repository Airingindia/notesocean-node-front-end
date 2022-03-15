
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

    // form validations 
    $("form").submit(function (event) {
        event.preventDefault();
        let firstName = $("form input[name='fistName']").val();
        let lastName = $("form input[name='lastName']").val();
        let email = $("form input[name='email']").val();
        let mobile = $("form input[name='mobile']").val();
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
            url: sessionStorage.getItem("api") + "/users",
            processData: false,
            contentType: false,
            data: form,
            beforeSend: function () {
                $(".signup-btn").prop("disabled", true);
                $(".signup-btn").html(`<i class="fa fa-spinner fa-spin mx-1"> </i>  <span> please wait ... </span>`);
            },
            success: function (data) {
                localStorage.setItem("userInfo", JSON.stringify(data));
                $(".notice-box").html(` <div id="liveToast" class="toast fade show border-0" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header bg-success text-light">
                    <strong class="me-auto">  <i  class="fa fa-check-circle text-white mx-1"> </i> Success!</strong>
                </div>
                <div class="toast-body">
                    Your account has been created successfully!, we are logging you in your dashboard
                </div>
            </div>`);

                setTimeout(function () {
                    $.ajax({
                        type: "POST",
                        url: sessionStorage.getItem("api") + "/authenticate/email-sign-in",
                        processData: false,
                        contentType: "application/json",
                        data: JSON.stringify({
                            email: email,
                            password: choosePassword
                        }),
                        success: function (data) {
                            const authToken = data.token;
                            localStorage.setItem("token", authToken);
                            setCookie("token", authToken, 100);
                            window.location = "/dashboard";
                        }, error: function (jqXHR, textStatus) {
                            $(".notice-box").html(` <div id="liveToast" class="toast fade show border-0" role="alert" aria-live="assertive" aria-atomic="true">
                            <div class="toast-header bg-danger text-light">
                                <strong class="me-auto">  <i  class="fa fa-info-circle text-white mx-1"> </i> Error!</strong>
                            </div>
                            <div class="toast-body">
                                Login failed!, Forwading to login to page
                            </div>
                        </div>`);
                            window.location = "/account/login";
                        }
                    })
                }, 2000);
            },
            error: function (err) {
                const errortext = err.responseJSON.description;
                $(".notice-box").html(` <div id="liveToast" class="toast  fade show border-0" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header bg-danger text-light">
                    <strong class="me-auto"> <i  class="fa fa-info-circle text-white mx-1"> </i> Error!</strong>
                </div>
                <div class="toast-body">
                    ${errortext}
                </div>
            </div>`);
                setTimeout(function () { $(".notice-box").html("") }, 5000);
            }
        })
    });

    $(".google-auth-btn").click(function () {
        window.location = sessionStorage.getItem("api") + "/authenticate/google-sign-in";
    });


    function setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
});