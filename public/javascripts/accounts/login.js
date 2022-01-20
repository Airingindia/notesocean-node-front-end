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
        $.ajax({
            type: "POST",
            url: sessionStorage.getItem("api"),
            data: {

            },
            success: function (data) {
                console.log(data);
            },
            error: function (error) {
                console.log(error);
            }
        })
    })
})