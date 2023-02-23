//Disabling autoDiscover
Dropzone.autoDiscover = false;
$(function () {
    Dropzone.autoDiscover = false;
    var myDropzone = new Dropzone(".dropzone", {
        dictDefaultMessage: `<i class='fa fa-file' style='color:red;font-size:50px'> </i> <br>  <br> <h6> Drag or drop your pdf to upload </h6> `,
        autoProcessQueue: false,
        maxFilesize: 100,
        addRemoveLinks: true,
        clickable: true,
        maxFiles: 1,
        uploadMultiple: false,
        acceptedFiles: ".pdf",
        // 20 minute of timeout
        timeout: (20 * 60 * 1000),
        url: app.getApi() + "/products",
        method: "post",
        headers: {
            Authorization: getCookie("token"),
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
        let upload = window.location.pathname.split("/")[1];
        let requestUuid = window.location.pathname.split("/")[2];
        if (upload == "upload") {
            formData.append("requests", requestUuid.toString());
        }
    });

    function checkRequestUpload() {
        let upload = window.location.pathname.split("/")[1];
        let requestUuid = window.location.pathname.split("/")[2];
        if (upload == "upload") {
            $.ajax({
                type: "GET",
                url: app.getApi() + "/requests/" + requestUuid,
                headers: {
                    Authorization: getCookie("token"),
                },
                contentType: "applicatiob/json",
                processData: false,
                beforeSend: function () {

                },
                success: function (data) {
                    if (data != undefined) {
                        $(".request-uploader").removeClass("d-none");
                        $(".request-subject").html(data.subject);
                        $(".request-user").html(data.users.firstName + " " + data.users.lastName);
                        $(".request-message").html(data.message);
                    } else {
                        $(".request-error").removeClass("d-none");
                        $("form").remove();
                    }

                },
                error: function (error) {
                    app.alert(err.status, err?.responseJSON?.message ? err?.responseJSON?.message : "Something went wrong");
                    $(".request-error").removeClass("d-none");
                    $("form").remove();
                }
            })
        }
    }
    checkRequestUpload();


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
        let response = file;
        $(".progress").css({ display: "none" });

        $('.upload-notes-btn').html("Upload");
        $('.upload-notes-btn').prop('disabled', false);
        let uploadedfile = JSON.parse(file.xhr.response);
        let uploadedId = uploadedfile.uuid;
        let status = file.status;
        myDropzone.removeFile(file);
        if (status == "success") {
            $("form").trigger("reset");
            $(".note-descriptions").removeClass("is-invalid");
            $(".note-descriptions").removeClass("is-valid");
            $(".dropzone").removeClass("is-invalid");
            $(".dropzone").removeClass("is-valid");
            $(".note-title").removeClass("is-valid");
            $(".note-title").removeClass("is-invalid");
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

                        myDropzone.removeAllFiles();
                        window.location = window.location.href;
                    }
                });
        }
        else if (file.status == "error") {
            new Noty({
                theme: "nest",
                type: "error",
                text: JSON.parse(response?.xhr?.response)?.message ? JSON.parse(response.xhr.response)?.message : "error uploading " + file.name,
                timeout: 3000,
            }).show();
        }

    });


    $(".upload-notes-btn").click(function () {
        $("form").submit();
        $(".modal").modal("hide");
    });
    $('form').submit(function (event) {
        event.preventDefault();
        validate();
        let title = $(".note-title").hasClass("is-valid");
        let description = $(".note-descriptions").hasClass("is-valid");
        let file = $(".dropzone").hasClass("is-valid");
        if (title && description && file) {
            myDropzone.processQueue();
        }
    });

    // static title and description size
    const titleSize = Number(30);
    const descriptionSize = Number(50);

    function validate() {
        $(".note-title").on("input", function () {
            $(".title-char-count").html("( " + $(this).val().trim().length + " )");
            if ($(this).val().trim().length > titleSize) {
                $(".note-title").addClass("is-valid");
                $(".note-title").removeClass("is-invalid");
            }
            else if ($(this).val().length == 0) {
                $(".note-title").addClass("is-invalid");
                $(".note-title").removeClass("is-valid");
                $(".invalid-title-error").html("Title can't be empty");
                $(".notes-title").addClass("animate__heartBeat");
            }
            else {
                $(".note-title").addClass("is-invalid");
                $(".note-title").removeClass("is-valid");
                $(".invalid-title-error").html("Title should be at least " + titleSize + " characters");
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
            $(".desctiption-char-count").html("( " + $(this).val().trim().length + " )");
            if ($(this).val().trim().length > descriptionSize) {
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
                $(".invalid-descriptions-error").html("Descriptions should be at least " + descriptionSize + " characters");
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

    // check validation  evrry 5 seconds

    setInterval(function () {
        validate();
    }, 5000);



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
});




