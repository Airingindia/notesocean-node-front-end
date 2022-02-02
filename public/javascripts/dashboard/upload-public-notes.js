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
        url: sessionStorage.getItem("api") + "/upload-public-notes",
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




