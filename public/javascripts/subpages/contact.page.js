$(document).ready(function () {
    $("form").submit(function (event) {
        event.preventDefault();
        amplitude.getInstance().logEvent("website contact", {
            status: "init",
            name: $("input[name='name']").val(),
            email: $("input[name='email']").val(),
            phone: $("input[name='phone']").val(),
            subject: $("input[name='subject']").val(),
            message: $("textarea[name='message']").val()
        });
        const device_id = amplitude.getInstance().options.deviceId;
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
                    amplitude.getInstance().logEvent("website contact", {
                        status: "success"
                    });
                    window.location = "/contact-us/success";
                } else {
                    amplitude.getInstance().logEvent("website contact", {
                        status: "error"
                    });
                    window.location = "/contact-us/error";
                }
            }
        });
    })
});