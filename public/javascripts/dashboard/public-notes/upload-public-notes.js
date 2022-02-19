//Disabling autoDiscover
Dropzone.autoDiscover = false;
$(function () {
    Dropzone.autoDiscover = false;
    var myDropzone = new Dropzone(".dropzone", {
        dictDefaultMessage: `<i class='fa fa-file' style='color:red;font-size:30px'> </i> <br>  <br> <h6> Drop your PDF here </h6>`,
        autoProcessQueue: false,
        maxFilesize: 100,
        addRemoveLinks: true,
        clickable: true,
        parallelUploads: 1,
        maxFiles: 1,
        uploadMultiple: false,
        acceptedFiles: ".pdf",
        url: sessionStorage.getItem("api") + "/products",
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
                            window.location = "/dashboard/public-notes/" + uploadedId;
                        }
                    });
                // swal("success", "your note are uploaded successfully", "success");
            } else {
                swal("error", "somthing sent wrong , please try again", "error");
            }
            myDropzone.removeAllFiles();
        }
    });
    myDropzone.on("sending", function (file, xhr, formData) {
        let title = $(".note-title").val();
        $(".upload-notes-btn").html(`<i class="fa fa-spinner fa-spin"> </i> Uploading ...`);
        $(".upload-notes-btn").prop("disabled", true);
        // formData.append("name",);// append file description
        let tags = [];
        $(".chip").each(function () {
            tags.push($(this).html().split("<i class=\"fa fa-times-circle mx-1\"></i>")[0]);
        });
        var json = {
            name: title,
            tags: tags.toString()
        };
        formData.append("products", new Blob([JSON.stringify(json)], { type: "application/json" }));
        console.log(xhr);


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
    });

    myDropzone.on("totaluploadprogress", function (progress) {
        $(".progress").css({ display: "block" });
        document.querySelector(".progress-bar").style.width = progress + "%";
        $(".progress-bar").html(progress + "%");
    });

    $('.upload-notes-btn').click(function () {
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
            if ($(this).val().length > 20) {
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
                $(".invalid-title-error").html("Title should be at least 20 characters");
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
            if ($(this).val().length > 30) {
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
                $(".invalid-descriptions-error").html("Descriptions should be at least 30 characters");
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
});

$(document).ready(function () {
    function tags() {
        $(".tag-input").on("blur", function () {
            let tag = $(this).val();
            // alert(tag);
            if (tag !== "") {
                addtag(tag);
            }
            $(this).val("");
        });

        $(".tag-input").keyup(function (event) {
            if (event.keyCode === 13 || event.keyCode == 188) {
                let tag = $(this).val();
                // alert(tag);
                if (tag !== "") {
                    addtag(tag);
                }
                $(this).val("");
            }
        });


        function addtag(tag) {
            if (tag.indexOf(",") !== -1) {
                let taglist = tag.split(",");
                for (let i = 0; i < taglist.length; i++) {
                    if (taglist[i].trim().length > 1) {
                        $(".tag-input").before(`<div class="chip btn" contenteditable="true">  ${taglist[i].trim()}  <i class="fa fa-times-circle mx-1"> </i> </div>`);
                    }
                }
            } else {
                if (tag.trim().length > 1) {
                    $(".tag-input").before(`<div class="chip btn" contenteditable="true">  ${tag.trim()}  <i class="fa fa-times-circle mx-1"> </i> </div>`);
                }
            }
            remove();
        }

        function remove() {
            $(".chips .chip i").each(function () {
                $(this).click(function () {
                    let parent = $(this).parent();
                    $(parent).remove();
                });
            });
        }

        remove();

        function clearAlltags() {
            $(".cleartags").click(function () {
                $(".chips .chip").each(function () {
                    $(this).remove();
                });
            });

        }

        function showClearBtn() {
            let chipLength = $(".chip").length;
            if (chipLength !== 0) {
                $(".cleartags").css({ "display": "block" });
            } else {
                $(".cleartags").css({ "display": "none" });
            }
        }

        setInterval(() => {
            showClearBtn();
        }, 2000);
        clearAlltags();
    }

    tags();

    // hide popover on click 

});

var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl, { html: true })
});




