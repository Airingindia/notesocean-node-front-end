$(document).ready(function () {
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

    $(".verify-btn").click(function () {
        var count = 0;
        var code = "";
        $("input").each(function () {
            if ($(this).val().length !== 0) {
                count++;
                code += $(this).val();
            }
        });

        if (count == 4) {
            // verify otp
            alert(code);

        } else {
            $("input").each(function () {
                if ($(this).val().length == 0) {
                    $(this).css({ "border": "1px solid red" });
                }
            });
        }
    })
})