// const e = require("express");

$(document).ready(function () {
    // get notes details
    const private_notes_id = window.location.pathname.split("/")[3];
    $.ajax({
        type: "GET",
        url: localStorage.getItem("api") + "/notes/" + private_notes_id,
        headers: {
            Authorization: localStorage.getItem("token")
        },
        beforeSend: function () {

        },
        success: function (data) {
            $(".loading-public-notes").addClass("d-none");
            $(".public-notes-details-container").removeClass("d-none");
            let src = `https://view.officeapps.live.com/op/embed.aspx?src=${data.file}`;
            $("iframe").attr("src", src);
        },
        error: function (errorData) {
            $(".notes-removed").removeClass("d-none");
        }


    })
})