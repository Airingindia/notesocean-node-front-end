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
        url: localStorage.getItem("api") + "/notes",
        method: "post",
        headers: {
            Authorization: localStorage.getItem("token"),
        }
    });
    myDropzone.on("sending", function (file, xhr, formData) {
        formData.append("notes", new Blob([JSON.stringify({ "name": file.name })], { type: "application/json" }));
        uploading_file = file.name;
    });

    myDropzone.on("complete", function (file) {
        myDropzone.removeFile(file);  //should remove after implement api
        console.log(file);
        if (file.status == "success") {
            let responseJson = JSON.parse(file.xhr.response);
            $(".notice-box").html(` <div id="liveToast" class="toast fade show border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header bg-success text-light">
                <strong class="me-auto">Success!</strong> <i class="fa fa-times close close-notice" data-dismiss="toast" aria-label="Close"> </i>
            </div>
            <div class="toast-body">
              <span class="text-danger mx-1" style="font-weight:bold;"> ${file.name} </span>  <span>  uploaded successfully </span>
            </div>
        </div>`);
        }
        else if (file.hasOwnProperty("xhr")) {
            $(".notice-box").html(` <div id="liveToast" class="toast fade show border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header bg-danger text-light">
                <strong class="me-auto">Error!</strong> <i class="fa fa-times close close-notice" data-dismiss="toast" aria-label="Close"> </i>
            </div>
            <div class="toast-body">
              <span class="text-danger mx-1"> Somthing went wrong , please try after sometimes
            </div>
        </div>`);
        }
        else {
            $(".notice-box").html(` <div id="liveToast" class="toast fade show border-0" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header bg-warning text-light">
                    <strong class="me-auto">Warning!</strong> <i class="fa fa-times close close-notice" data-dismiss="toast" aria-label="Close"> </i>
                </div>
                <div class="toast-body">
                  <span class="text-danger mx-1" style="font-weight:bold;"> ${file.name} </span>  <span>  Unsopported File Type </span>
                </div>
            </div>`);
        }


        closeToast();
    });
    myDropzone.on("addedfile", function (file) {
        $(".notice-box").html("");
    });
});


function closeToast() {
    $(".close-notice").click(function () {
        $(".notice-box").html("");
    })
};
