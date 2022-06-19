//Disabling autoDiscover
Dropzone.autoDiscover = false;
$(function () {
    Dropzone.autoDiscover = false;
    var myDropzone = new Dropzone(".dropzone", {
        dictDefaultMessage: `<i class='fa fa-file' style='color:red;font-size:50px'> </i> <br>  <br> <h4> Drag or drop your files to upload </h4> <br>
        <small> <b> Note : </b>  you can upload only these supported file types  </small> <br>
        <small> 
        pdf ppt xls xlsx doc docx pptx gsheet xltx 
        </small>`,
        autoProcessQueue: false,
        maxFilesize: 100,
        addRemoveLinks: true,
        clickable: true,
        parallelUploads: 1,
        maxFiles: 1,
        uploadMultiple: false,
        acceptedFiles: ".pdf,.ppt,.pptx,.xls,.xlsx,.doc,.docs",
        url: localStorage.getItem("api") + "/products",
        method: "post",
        headers: {
            Authorization: localStorage.getItem("token"),
        },
        success: function (data) {
            let uploadedfile = JSON.parse(data.xhr.response);
            let uploadedId = uploadedfile.id;
            let uploadedfilename = uploadedfile.name;
            let status = data.status;

            if (status == "success") {
                swal({
                    title: "Upload success!",
                    text: "Your Notes has been uploaded successfully",
                    icon: "success",
                    buttons: ["Upload Another", "Preview"],
                    dangerMode: true,
                })
                    .then((willDelete) => {
                        if (willDelete) {
                            window.location = "/notes/" + uploadedId;
                        } else {
                            $("form").trigger("reset");
                            myDropzone.removeAllFiles();
                        }
                    });
            } else {
                swal("error", "somthing sent wrong , please try again", "error");
            }
            myDropzone.removeAllFiles();
        }
    });

    myDropzone.on("sending", function (file, xhr, formData) {
        let title = $(".note-title").val();
        let description = $(".note-descriptions").val();
        $(".upload-notes-btn").html(`<i class="fa fa-spinner fa-spin"> </i> Uploading ...`);
        $(".upload-notes-btn").prop("disabled", true);
        // formData.append("name",);// append file description
        let tags = [];
        $(".chip").each(function () {
            tags.push($(this).html().split("<i class=\"fa fa-times-circle mx-1\"></i>")[0]);
        });
        var json = {
            name: title,
            tags: tags.toString(),
            description: description
        };
        formData.append("products", new Blob([JSON.stringify(json)], { type: "application/json" }));

        // new Noty({
        //     theme: "nest",
        //     type: "error",
        //     text: '<i class="fa fa-check-circle">  </i>  ' + name + " : Failed to create collection",
        //     timeout: 4000,
        // }).show();


    });

    myDropzone.on("addedfile", function (file) {
        if (myDropzone.files.length == 0) {
            $(".dropzone").addClass("is-invalid");
            $(".dropzone").removeClass("is-valid");
        } else {
            $(".dropzone").addClass("is-valid");
            $(".dropzone").removeClass("is-invalid");
        }
    })

    myDropzone.on("complete", function (file) {
        myDropzone.removeFile(file);
        $("form").trigger("reset");
        $(".chips .chip").each(function () {
            $(this).remove();
        });
        $(".progress").css({ display: "none" });
        $(".note-title").val("");
        $(".note-descriptions").val("");

        // remove validtion
        $(".note-descriptions").removeClass("is-invalid");
        $(".note-descriptions").removeClass("is-valid");
        $(".dropzone").removeClass("is-invalid");
        $(".dropzone").removeClass("is-valid");
        $(".progress").css({ display: "none" });
        $(".note-title").removeClass("is-valid");
        $(".note-title").removeClass("is-invalid");
        $('.upload-notes-btn').html("Upload");
        $('.upload-notes-btn').prop('disabled', false);
        if (file.xhr.status == 500) {
            new Noty({
                theme: "nest",
                type: "error",
                text: "something went wrong uploading file , please try again later",
                timeout: 4000,
            }).show();
        }
        console.log(file.xhr.status);
    });


    $(".upload-notes-btn").click(function () {
        $("form").submit();
        $(".modal").modal("hide");
    });
    $('form').submit(function (event) {
        event.preventDefault();
        // check all field is not null
        console.log(myDropzone.files.length);
        if ($(".note-title").hasClass("is-valid") && $(".note-descriptions").hasClass("is-valid") && myDropzone.files.length > 0) {
            myDropzone.processQueue();
        } else if (!$(".note-title").hasClass("is-valid")) {
            $(".note-title").addClass("is-invalid")
        } else if (!$(".note-descriptions").hasClass("is-valid")) {
            $(".note-descriptions").addClass("is-invalid");
        }
        else if (myDropzone.files.length == 0) {
            $(".dropzone").addClass("is-invalid");
            $(".dropzone").removeClass("is-valid");
        }
    });

    function validate() {
        $(".note-title").on("input", function () {
            if ($(this).val().length > 50) {
                $(".note-title").addClass("is-valid");
                $(".note-title").removeClass("is-invalid");
            }
            else if ($(this).val().length == 0) {
                $(".note-title").addClass("is-invalid");
                $(".note-title").removeClass("is-valid");
                $(".invalid-title-error").html("Title can't be empty'");
                $(".notes-title").addClass("animate__heartBeat");
            }
            else {
                $(".note-title").addClass("is-invalid");
                $(".note-title").removeClass("is-valid");
                $(".invalid-title-error").html("Title should be at least 50 characters");
            }
        });
        $(".note-title").on("change", function () {
            if ($(this).val().length == 0) {
                $(".note-title").addClass("is-invalid");
                $(".note-title").removeClass("is-valid");
                $(".invalid-title-error").html("Title can't be empty'");
            }
        });

        $(".note-title").on("blur", function () {
            if ($(this).val().length == 0) {
                $(".note-title").addClass("is-invalid");
                $(".note-title").removeClass("is-valid");
                $(".invalid-title-error").html("Title can't be empty'");
            }
        });

        // description validations

        $(".note-descriptions").on("input", function () {
            if ($(this).val().length > 100) {
                $(".note-descriptions").addClass("is-valid");
                $(".note-descriptions").removeClass("is-invalid");
            }
            else if ($(this).val().length == 0) {
                $(".note-descriptions").addClass("is-invalid");
                $(".note-descriptions").removeClass("is-valid");
                $(".invalid-descriptions-error").html("Descriptions can't be empty'");
            }
            else {
                $(".note-descriptions").addClass("is-invalid");
                $(".note-descriptions").removeClass("is-valid");
                $(".invalid-descriptions-error").html("Descriptions should be at least 100 characters");
            }
        });
        $(".note-descriptions").on("change", function () {
            if ($(this).val().length == 0) {
                $(".note-descriptions").addClass("is-invalid");
                $(".note-descriptions").removeClass("is-valid");
                $(".invalid-descriptions-error").html("Descriptions can't be empty'");
            }
        });

        $(".note-descriptions").on("blur", function () {
            if ($(this).val().length == 0) {
                $(".note-descriptions").addClass("is-invalid");
                $(".note-descriptions").removeClass("is-valid");
                $(".invalid-descriptions-error").html("Descriptions can't be empty'");
            }
        });
    };
    validate();



    $(".accept-upload").click(function () {
        $(".modal").modal("show");
        let checkbox = $(".form-check-input");
        $(checkbox).click(function () {
            if ($(checkbox).prop("checked")) {
                $(".upload-notes-btn").prop("disabled", false);
            } else {
                $(".upload-notes-btn").prop("disabled", true);
            }
        })

    });
});
var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl, { html: true })
});




