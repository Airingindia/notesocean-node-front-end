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
        parallelUploads: 1,
        maxFiles: 1,
        uploadMultiple: false,
        acceptedFiles: ".pdf,.ppt,.pptx,.xls,.xlsx,.doc,.docs",
        url: atob(decodeURIComponent(getCookie("api"))) + "/products",
        method: "post",
        headers: {
            Authorization: getCookie("token"),
        },
        success: function (data) {
            let uploadedfile = JSON.parse(data.xhr.response);
            let uploadedId = uploadedfile.id;
            let uploadedfilename = uploadedfile.name;
            let status = data.status;
            console.log(data);

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
                            // $("form").trigger("reset");
                            myDropzone.removeAllFiles();
                            window.location = window.location.href;
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
                url: atob(decodeURIComponent(getCookie("api"))) + "/requests/" + requestUuid,
                headers: {
                    Authorization: getCookie("token"),
                },
                contentType: "applicatiob/json",
                processData: false,
                beforeSend: function () {

                },
                success: function (data) {
                    if (data != undefined) {
                        $(".request-subject").html(data.subject);
                        $(".request-user").html(data.users.firstName + " " + data.users.lastName);
                        $(".request-message").html(data.message);
                    } else {
                        $(".request-error").removeClass("d-none");
                        $("form").remove();
                    }

                },
                error: function (error) {
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

        if (file.xhr.status == 406) {
            new Noty({
                theme: "nest",
                type: "error",
                text: "he file was corrupted, or not of valid type",
                timeout: 4000,
            }).show();
        }

        if (file.xhr.status == 401) {
            window.location = "/session-expire";
        }
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
            $(".title-char-count").html("( " + $(this).val().length + " )");
            if ($(this).val().length > 50) {
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
            $(".desctiption-char-count").html("( " + $(this).val().length + " )");
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




