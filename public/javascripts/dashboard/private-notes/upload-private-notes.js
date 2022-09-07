//Disabling autoDiscover
Dropzone.autoDiscover = false;
$(function () {
    var uploading_file = "";
    Dropzone.autoDiscover = false;
    var myDropzone = new Dropzone(".dropzone", {
        dictDefaultMessage: `<i class='fa fa-file' style='color:red;font-size:50px'> </i> <br>  <br> <h4> Drag or drop your files to upload </h4> <br>
        <small> <b> Note : </b>  you can upload only these supported file types  </small> <br>
        <small> 
        pdf txt ppt xls xlsx doc docx pptx gsheet xltx png jpeg jpg webp psd 
        </small> `,
        autoProcessQueue: true,
        maxFilesize: 100,
        addRemoveLinks: true,
        parallelUploads: 4,
        maxFiles: 4,
        uploadMultiple: false,
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
        if (file.accepted == true) {
            if (file.status == "success") {
                new Noty({
                    theme: "nest",
                    type: "success",
                    text: file.name + " uploaded",
                    timeout: 3000,
                }).show();
                myDropzone.removeFile(file);
            }
            if (file.status == "error") {
                new Noty({
                    theme: "nest",
                    type: "success",
                    text: "Faild to upload, plese try after sometimes ",
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
