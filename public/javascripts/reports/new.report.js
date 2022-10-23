$(document).ready(function () {
    $("form").submit(function (event) {
        event.preventDefault();
        let reportObj = {
            basicInfo: {
                firstName: $(`input[name="firstName"]`).val(),
                lastName: $(`input[name="lastName"]`).val(),
                email: $(`input[name="email"]`).val(),
                mobile: $(`input[name="mobile"]`).val(),
                address: $(`textarea[name="address"]`).val()
            },
            legalInfo: {
                copyrightNumber: $(`input[name="copyrightNumber"]`).val(),
                proofURL: $(`input[name="proofURL"]`).val(),
            },
            reportInfo: {
                reportURL: $(`input[name="reportURL"]`).val(),
                reportDescription: $(`textarea[name="reportDescription"]`).val(),
            }
        }
        $.ajax({
            type: "POST",
            url: "/api/report",
            data: JSON.stringify(reportObj),
            contentType: "application/json",
            processData: false,
            beforeSend: function () {
                $(".report-btn").prop("disabled", true);
                $(".report-btn").html("Reporting...");
            },
            success: function (data) {
                $(".report-btn").prop("disabled", false);
                $(".report-btn").html("Reported!");
                window.location = "/report/success";
            }, error: function (data) {
                console.log(data);
                app.alert(data.status, data.responseJSON.message);
            }
        })
    })

});