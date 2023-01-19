$(document).ready(function () {
    $("form").submit(function (event) {
        event.preventDefault();
        let subject = $("input[type='text']").val();
        let message = $("textarea").val();
        $.ajax({
            type: "POST",
            url: app.getApi() + "/requests",
            headers: {
                Authorization: getCookie("token")
            },
            processData: false,
            contentType: "application/json",
            data: JSON.stringify({
                subject: subject,
                message: message
            }),
            beforeSend: function () {
                $("section form button").html("please wait...");
                $("section form button").prop("disabled", true);
            },
            success: function (data) {
                $("section form button").html("Request");
                $("section form button").prop("disabled", false);
                new Noty({
                    theme: "nest",
                    type: "success",
                    text: 'your request successfully subbmited, we will update your once aynone upload ',
                    timeout: 5000,
                }).show();

                window.location = "/request/" + data.uuid;
            },
            error: function (error) {
                $("section form button").html("Request");
                $(" section form  button").prop("disabled", false);
                app.alert(err.status, err?.responseJSON?.message ? err?.responseJSON?.message : "Something went wrong");
            }
        });
    });

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

});