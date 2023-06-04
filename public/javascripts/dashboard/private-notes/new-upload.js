//Disabling autoDiscover
Dropzone.autoDiscover = false;
$(function () {
    var uploading_file = "";
    Dropzone.autoDiscover = false;
    var myDropzone = new Dropzone(".dropzone", {
        dictDefaultMessage: `<a class="">
        <div class="upload-box-div-child1">
            <p class="upload-box-text">Click to Upload your private notes</p><img class="upload-box-img" src="https://static.ncdn.in/icons/upload_icon.png" />
        </div>
        <p class="upload-box-details-text">Notes you upload here are safe and secure, accessible only to you </p>
    </a>`,
        autoProcessQueue: true,
        maxFilesize: 100,
        addRemoveLinks: true,
        parallelUploads: 4,
        maxFiles: 4,
        uploadMultiple: false,
        timeout: 90000,
        acceptedFiles: ".pdf,.txt,.png,.jpg,.jpeg,.doc,.docx,.xls,.xls,.ppt,.pptx,.csv",
        url: app.getApi() + "/notes",
        method: "post",
        headers: {
            Authorization: getCookie("token"),
        }
    });
    myDropzone.on("sending", function (file, xhr, formData) {
        formData.append("notes", new Blob([JSON.stringify({ "name": file.name })], { type: "application/json" }));
        uploading_file = file.name;
    });

    myDropzone.on("complete", function (file) {
        //should remove after implement api
        let response = file;
        console.log("res",);
        if (file.accepted == true) {
            if (file.status == "success") {

                myDropzone.removeFile(file);
                let name = file.name;
                let size = file.size;
                let uuid = JSON.parse(response.xhr.response).uuid;
                let fileType = file.type.split("/")[1];
                let img = "/images/icons/" + fileType + ".png";
                let actual_size = bytesToSize(size);
                let ago_time = "just now";

                $(".notes-container-row").prepend(`
                <div class="col-12 col-lg-3 col-md-6 col-xs-12 mb-3 h-100">
                <div class="card card-details">
                  <div class='image-card-wrapper'>
                  <img class="card-img-top  mx-auto mt-3 w-50" src="${img}" /> 

                  </div>
                  <div class='info-card-container'>
                      <div class='info-card-1'>
                        <div class='infos'>${ago_time}</div>
                        <div class='infos'>&#x2022</div>
                        <div class='infos'>${actual_size}</div>
                      </div>
                      <div class='info-card-2'>
                          <div class='info-name'>${name}</div>
                      </div>
                  </div>
                  </div>

                </div>

                `);
            }
            if (file.status == "error") {
                new Noty({
                    theme: "nest",
                    type: "error",
                    text: JSON.parse(response?.xhr?.response)?.message ? JSON.parse(response.xhr.response)?.message : "error uploading " + file.name,
                    timeout: 3000,
                }).show();
                myDropzone.removeFile(file);
            }
        } else {
            new Noty({
                theme: "nest",
                type: "warning",
                text: "unsupported file",
                timeout: 3000,
            }).show();
            myDropzone.removeFile(file);
        }
        if (response.xhr.status == 401) {
            window.location = "/session-expire";
        }
    });
    myDropzone.on("addedfile", function (file) {
        console.log(file);
        return false;
    });
});

function timeDifference(previous) {
    const current = Date.now();
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
        return Math.round(elapsed / 1000) + " seconds ago";
    } else if (elapsed < msPerHour) {
        return Math.round(elapsed / msPerMinute) + " minutes ago";
    } else if (elapsed < msPerDay) {
        return Math.round(elapsed / msPerHour) + " hours ago";
    } else if (elapsed < msPerMonth) {
        return Math.round(elapsed / msPerDay) + " days ago";
    } else if (elapsed < msPerYear) {
        return Math.round(elapsed / msPerMonth) + " months ago";
    } else {
        return Math.round(elapsed / msPerYear) + " years ago";
    }
}

function bytesToSize(bytes) {
    var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes == 0) return "0 Byte";
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
}





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

$(document).ready(function () {
    $(".upload-mobile-box").click(() => {
        let input = document.createElement("input");
        input.type = "file"
        input.accept = ".pdf,.txt,.png,.jpg,.jpeg,.doc,.docx,.xls,.xls,.ppt,.pptx,.csv";
        input.click();
        input.addEventListener("change", function () {
            let file = this.files[0];
            let name = file.name;
            let size = file.size;
            let formData = new FormData();
            formData.append("notes", new Blob([JSON.stringify({ "name": file.name })], { type: "application/json" }));
            formData.append("file", file);

            $.ajax({
                url: app.getApi() + "/notes",
                type: "POST",
                data: formData,
                processData: false,
                contentType: false,
                headers: {
                    Authorization: getCookie("token"),
                },
                beforeSend: function (xhr) {
                    $(".upload-mobile-text").html(`
                        Uploading 
                        <i class="fa fa-spinner fa-spin mx-2"></i>
                    `);
                },
                xhr: function () {
                    var xhr = new window.XMLHttpRequest();
                    xhr.upload.addEventListener("progress", function (evt) {
                        if (evt.lengthComputable) {
                            var percentComplete = ((evt.loaded / evt.total) * 100).toFixed(2);
                            $(".upload-mobile-text").html(`
                                Uploading -  ${percentComplete}% 
                                <i class="fa fa-spinner fa-spin mx-2"></i>
                               
                            `);
                        }
                    }, false);
                    return xhr;
                },
                success: function (response) {
                    $(".upload-mobile-text").html(`
                        New 
                        <i class="fa fa-cloud-upload mx-2"></i>
                    `);
                    let name = response.name;
                    if (name.length > 30) {
                        name = name.substring(0, 30) + "...";
                    }
                    let size = response.size;
                    let uuid = response.uuid;
                    let fileType = response.fileType;
                    let img = "/images/icons/" + fileType + ".png";
                    let actual_size = bytesToSize(size);
                    let ago_time = "just now";

                    $(".notes-container-row").prepend(`
                    <div class="col-12 col-lg-3 col-md-6 col-xs-12 mb-3 h-100">
                    <div class="card card-details">
                      <div class='image-card-wrapper'>
                      <img class="card-img-top  mx-auto mt-3 w-50" src="${img}" /> 
    
                      </div>
                      <div class='info-card-container'>
                          <div class='info-card-1'>
                            <div class='infos'>${ago_time}</div>
                            <div class='infos'>&#x2022</div>
                            <div class='infos'>${actual_size}</div>
                          </div>
                          <div class='info-card-2'>
                              <div class='info-name'>${name}</div>
                          </div>
                      </div>
                      </div>
    
                    </div>
    
                    `);

                },
                error: function (err) {
                    $(".upload-mobile-text").html(`
                    New
                    <i class="fa fa-cloud-upload mx-2"></i>
                `);
                    new Noty({
                        theme: "nest",
                        type: "error",
                        text: JSON.parse(err?.responseText)?.message ? JSON.parse(err.responseText)?.message : "error uploading " + file.name,
                        timeout: 3000,
                    }).show();
                }
            })
        })
    })
})
