$(document).ready(function () {
    // get userdata 
    
   

    function show() {
        $("input").each(function () {
            $(this).on("input", function () {

                if ($(this).val().length == 1) {
                    if (isNaN($(this).val()) == false) {
                        $(this).next().focus();
                    } else {
                        $(this).val("");
                    }
                }

            });

            // detect key code
            $(this).keyup(function (event) {
                if (event.keyCode === 8 || event.keyCode == 46) {
                    $(this).prev().focus();
                }
            });

        });

        $("input").each(function () {
            $(this).on("input", function () {
                $(this).css({ "border": "1px solid #ccc" });
            })
            $(this).on("focus", function () {
                $(this).css({ "border": "1px solid #ccc" });
            })
            $(this).click(function () {
                $(this).css({ "border": "1px solid #ccc" });
            })
        });
        
    }

    var lastKeyCode = 0;

    $('input[type="number"]').bind('keydown', function(e) {
        lastKeyCode = e.keyCode;
    });
    // Bind on the input having changed.  As long as the previous character
    // was not a space, BS or Del, trim the input.
    $('input[type="number"]').bind('input', function(e) {
        if(lastKeyCode != 32 && lastKeyCode != 8 && lastKeyCode != 46) {
            $(this).val($(this).val().replace(/^\s+|\s+$/g, ''));
        }
    });


    show();
    $(".resend-btn").click(function(){
      window.location = location.href;
    });

    function sendCode(){
        $.ajax(
            {
                type: "GET",
                url: app.getApi() + "/authenticate/verify-email",
                headers: {
                    Authorization: getCookie("token")
                }, beforeSend: function () {
    
                },
                success: function (data) {
                    $(".user-email-label").html(data.email);
                    app.alert(200,"code sent to your email address!");

                    // verify

                    $(".verify-btn").click(function () {
                        var count = 0;
                        if ($("input").val().length ==6) {
                            count = 6;
                        }

                        data.code = Number($("input").val());
            
                        if (count == 6) {
                            $.ajax({
                                type: "POST",
                                url: app.getApi() + "/authenticate/verify-email",
                                headers: {
                                    Authorization: getCookie("token")
                                },
                                processData: false,
                                contentType: "application/json",
                                data: JSON.stringify(data),
                                beforeSend: function () {
                                    $(".verify-btn").prop("disabled", true);
                                    $(".verify-btn").html(`<i class="fa fa-spinner fa-spin mx-1"> </i> <span> verifing... </span>`);
                                },
                                success: function (data) {
                                    if(data){
                                    const userdata = JSON.parse(localStorage.getItem("userInfo"));
                                    userdata.emailVerified = true;
                                    localStorage.setItem("userInfo", JSON.stringify(userdata));
                                    new Noty({
                                        theme: "nest",
                                        type: "success",
                                        text: 'Email verified successfully!',
                                        timeout: 3000,
                                        closeWith: ['click', 'button'],
                                    }).show();

                                    window.location = "/dashboard";

                                    }else{
                                        app.alert(400,"Invalid code , please enter correct code")
                                    }
                                    $(".verify-btn").prop("disabled", false);
                                    $(".verify-btn").html(`Verify`);
                                }, error: function (error) {
                                   app.alert(error.status,"Somthing went wrong , please try again later");
                                   $(".verify-btn").prop("disabled", false);
                                   $(".verify-btn").html(`Verify`);
                                }
                            });
                        } else {
                            $("input").css({ "border": "1px solid red"});
                            app.alert(400 ,"Enter 6 digit code!");
                        }
                    });
                }, error: function (error) {
                    app.alert(error.status, "Faild to send verification code!, please try again")
                    window.location = "/dashboard";
                }
            }
        )
    }

    sendCode();
   

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
    function setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
})