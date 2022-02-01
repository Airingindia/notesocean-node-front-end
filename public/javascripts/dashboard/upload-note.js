//Disabling autoDiscover
Dropzone.autoDiscover = false;
$(function () {
    Dropzone.autoDiscover = false;
    var myDropzone = new Dropzone(".dropzone", {
        dictDefaultMessage: `<i class='fa fa-file' style='color:red;font-size:50px'> </i> <br>  <br> <h4> Drag or drop your files to upload </h4> <br>
        <small> <b> Note : </b>  you can upload only these supported file types  </small> <br>
        <small> 
        pdf txt ppt xls xlsx doc docx pptx gsheet xltx
        </small> `,
        autoProcessQueue: true,
        maxFilesize: 100,
        addRemoveLinks: true,
        parallelUploads: 5,
        maxFiles: 5,
        uploadMultiple: true,
        acceptedFiles: ".pdf,.txt,.ppt,.xls,.xlsx,.doc,.docx,.pptx,.gsheet,.xltx",
        url: sessionStorage.getItem("api") + "/upload-notes",
        method: "post",
        headers: {
            Authorization: localStorage.getItem("token"),
        },
        success: function (data) {
            let status = data.status;
            console.log(status);
            if (status == "success") {
                swal("success", "your files are uploaded successfully", "success");
            } else {
                swal("error", "somthing sent wrong , please try again", "success");
            }
            myDropzone.removeAllFiles();
        }
    });
    myDropzone.on("sending", function (file, xhr, formData) {
        formData.append("test", "test");// append file description
    });

    myDropzone.on("complete", function (file) {
        // myDropzone.removeFile(file);  should remove after implement api
    });
});