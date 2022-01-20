
$(document).ready(function () {

    // get env details

    $.ajax({
        type: "GET",
        url: "/api/env",
        success: function (data) {
            sessionStorage.setItem("home", data.home);
            sessionStorage.setItem("env", data.env);
            sessionStorage.setItem("api", data.api);
        }
    });

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

        $.ajax({
            type: "POST",
            url: "http://localhost:8081/users",
            data: {
                firstName: firstName,
                lastName: lastName,
                email: email,
                phone: mobile,
                password: choosePassword
            },
            success: function (data) {
                console.log(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
            }
        })
    });


});