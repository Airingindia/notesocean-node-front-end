$(document).ready(function () {
    $("form").submit(function (event) {
        event.preventDefault();
        const name = $("input[name='name']").val();
        const email = $("input[name='email']").val();
        const phone = $("input[name='phone']").val();
        const subject = $("input[name='subject']").val();
        const message = $("textarea[name='message']").val();
        $.ajax({
            type: "POST",
            url: "/api/contact-email",
            data: {
                name: name,
                email: email,
                phone: phone,
                subject: subject,
                message: message,
            },
            beforeSend: function () {
                $(".contact-send-btn").prop("disabled", true);
                $(".contact-send-btn").html("Please wait...");
            },
            success: function (data) {
                if (data.status == 200) {
                    window.location = "/contact-us/success";
                } else {
                    window.location = "/";
                }
            },
            error: function (err) {
                app.alert(err.status, err?.responseJSON?.message ? err?.responseJSON?.message : "Something went wrong");
            }
        });
    })
});