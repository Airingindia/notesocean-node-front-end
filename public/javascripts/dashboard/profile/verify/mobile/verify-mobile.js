$(document).ready(function () {
    const userdata = JSON.parse(localStorage.getItem("userdata"));
    $(".user-Mobile-label").html(userdata.phone);
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

        if (count == 6) {
            // verify otp
            $.ajax({
                type: "POST",
                url: sessionStorage.getItem("api"),
                headers: {
                    Authorization: localStorage.getItem("token")
                },
                beforeSend: function () {
                    $(".verify-btn").prop("disabled", true);
                    $(".verify-btn").html(`<i class="fa fa-spinner fa-spin mx-1"> </i> <span> verifing... </span>`);
                },
                success: function (data) {
                    console.log(data);
                }
            })

        } else {
            $("input").each(function () {
                if ($(this).val().length == 0) {
                    $(this).css({ "border": "1px solid red" });
                }
            });
        }
    })
})