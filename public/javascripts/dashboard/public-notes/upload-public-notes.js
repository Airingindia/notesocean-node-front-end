//Disabling autoDiscover
Dropzone.autoDiscover = false;
$(function () {
    Dropzone.autoDiscover = false;
    var myDropzone = new Dropzone(".dropzone", {
        dictDefaultMessage: `<i class='fa fa-file' style='color:red;font-size:30px'> </i> <br>  <br> <h6> Drop your PDF here </h6>`,
        autoProcessQueue: false,
        maxFilesize: 100,
        addRemoveLinks: true,
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
            $('.upload-notes-btn').html("Upload");
            $('.upload-notes-btn').prop('disabled', false);
            let status = data.status;
            $(".progress").css({ display: "none" });
            if (status == "success") {
                swal("success", "your note are uploaded successfully", "success");
            } else {
                swal("error", "somthing sent wrong , please try again", "error");
            }
            myDropzone.removeAllFiles();
        }
    });
    myDropzone.on("sending", function (file, xhr, formData) {
        let title = $(".note-title").val();
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
    });

    myDropzone.on("complete", function (file) {
        myDropzone.removeFile(file);
        $("form").trigger("reset");
        $(".chips .chip").each(function () {
            $(this).remove();
        });
        $(".progress").css({ display: "none" });
        $(".note-title").val("");
    });

    myDropzone.on("totaluploadprogress", function (progress) {
        $(".progress").css({ display: "block" });
        document.querySelector(".progress-bar").style.width = progress + "%";
        $(".progress-bar").html(progress + "%");
    });

    $('.upload-notes-btn').click(function () {
        // check all field is not null
        let title = $(".note-title").val();
        // formData.append("name",);// append file description
        let tags = [];
        $(".chip").each(function () {
            tags.push($(this).html().split("<i class=\"fa fa-times-circle mx-1\"></i>")[0]);
        });
        let description = $(".note-descriptions").val();

        if (title.length > 10 && tags.length > 3 && description.length > 10) {
            myDropzone.processQueue();
            $(this).html(`<i class="fa fa-spinner fa-spin"> </i> Uploading ...`);
            $(this).prop("disabled", true);
        } else {
            swal("warning", "All field are required ", "warning");
        }
    });
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




