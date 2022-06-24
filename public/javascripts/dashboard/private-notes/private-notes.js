$(document).ready(function () {
    // get all private notes

    function loaddata() {
        $.ajax({
            type: "GET",
            url: atob(getCookie("api")) + "/notes",
            headers: {
                Authorization: getCookie("token")
            },
            beforeSend: function () {
                $(".loading-private-notes").removeClass("d-none");
            },
            success: function (data) {
                showData(data);
            },
            error: function (err) {
                console.log(err);
            }
        });
    }

    loaddata();

    function showData(data) {
        $(".notes-container-row").html("");
        $(".loading-private-notes").addClass("d-none");
        if (data.length !== 0) {
            $(".no-private-notes").addClass("d-none");
            for (let i = 0; i < data.length; i++) {
                var name;
                if ($(window).width() < 769) {
                    name = data[i].name.substring(0, 12) + "..";
                }
                name = data[i].name;
                let fileType = data[i].fileType;
                let id = data[i].id;
                let size = data[i].size;
                let timestamp = data[i].timestamp;
                let ago_time = timeDifference(timestamp);
                let actual_size = bytesToSize(size);
                let url = data[i].file;
                let img = "/images/icons/" + fileType + ".png";
                let type = data[i].fileType;

                $(".notes-container-row").append(`
                <div class="col-6 col-lg-2 my-2">
                    <div class="card  border-0 rounded shadow w-100 h-100 private-note-item" data-name="${name}" data-id="${id}"  data-time="${ago_time}" data-size="${actual_size}" id="${id}" data-url="${url}" data-type="${type}">
                            
                            <img class="card-img-top w-50 mx-auto mt-4" src="${img}" /> 
                            <div class="card-body border-0 py-2">
                                <p class="card-title">${name} </p>
                            </div>
                            <div class="card-footer border-0 bg-white">
                                <p class="card-text text-muted"> <i class="fa fa-clock-o mx-1"></i><span> ${ago_time} </span></p>

                                <p class="card-text d-flex align-items-center justify-content-between">
                                
                                <span class="text-muted"> 
                                <i class="fa fa-database mx-1">
                                </i>
                                <span> ${actual_size} </span>
                                </span>                                    
                                </p>
                            </div>
                      
                    
                    </div>
                </div>
                `);
            }
            fileOpner();
        } else {
            $(".no-private-notes").removeClass("d-none");
        }
    }


    function timeDifference(previous) {
        const current = Date.now();
        var msPerMinute = 60 * 1000;
        var msPerHour = msPerMinute * 60;
        var msPerDay = msPerHour * 24;
        var msPerMonth = msPerDay * 30;
        var msPerYear = msPerDay * 365;

        var elapsed = current - previous;

        if (elapsed < msPerMinute) {
            return Math.round(elapsed / 1000) + ' seconds ago';
        }

        else if (elapsed < msPerHour) {
            return Math.round(elapsed / msPerMinute) + ' minutes ago';
        }

        else if (elapsed < msPerDay) {
            return Math.round(elapsed / msPerHour) + ' hours ago';
        }

        else if (elapsed < msPerMonth) {
            return Math.round(elapsed / msPerDay) + ' days ago';
        }

        else if (elapsed < msPerYear) {
            return Math.round(elapsed / msPerMonth) + ' months ago';
        }

        else {
            return Math.round(elapsed / msPerYear) + ' years ago';
        }
    };

    function bytesToSize(bytes) {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 Byte';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }
    function openContext() {
        $(".private-note-delete-btn").click(function () {

        });

        // update name
        $(".action-note-update-btn").click(function () {
            let input = $(".action-note-input");
            const json = JSON.stringify({
                name: $(input).val()
            });
            if ($(input).hasClass("is-valid")) {
                $.ajax({
                    type: "PUT",
                    url: atob(getCookie("api")) + "/notes/" + id,
                    headers: {
                        Authorization: getCookie("token")
                    },
                    contentType: "application/json",
                    processData: false,
                    data: json,
                    beforeSend: function () {
                        $(".action-note-update-btn").html(`<i class="fa fa-spinner f-spin mx-1 "> </i> <span> Please wait... </span>`);
                        $(".action-note-update-btn").prop("disabled", true);
                    },
                    success: function (data) {

                        $(".action-note-update-btn").html(`Update`);
                        $(".action-note-update-btn").prop("disabled", false);
                        swal("success", "Note name updated successfully", "success");
                    },
                    error: function (errorData) {
                        $(".action-note-update-btn").html(`Update`);
                        $(".action-note-update-btn").prop("disabled", false);
                        swal("Opps!", "somthing went wrong , please try after sometimes", "error");
                    }

                })
            }
        })
    };


    function validate() {
        $(".action-note-input").on("input", function () {
            if ($(this).val().length > 10) {
                $(".action-note-input").addClass("is-valid");
                $(".action-note-input").removeClass("is-invalid");
            }
            else if ($(this).val().length == 0) {
                $(".action-note-input").addClass("is-invalid");
                $(".action-note-input").removeClass("is-valid");
                $(".invalid-name").html("Name can't be empty'");
                $(".notes-title").addClass("animate__heartBeat");
            }
            else {
                $(".action-note-input").addClass("is-invalid");
                $(".action-note-input").removeClass("is-valid");
                $(".invalid-name").html("Name should be at least 10 characters");
            }
        });
        $(".action-note-input").on("change", function () {
            if ($(this).val().length == 0) {
                $(".action-note-input").addClass("is-invalid");
                $(".action-note-input").removeClass("is-valid");
                $(".invalid-name").html("Name can't be empty'");
            }
        });

        $(".action-note-input").on("blur", function () {
            if ($(this).val().length == 0) {
                $(".action-note-input").addClass("is-invalid");
                $(".action-note-input").removeClass("is-valid");
                $(".invalid-name").html("Name can't be empty'");
            }
        });
    };
    validate();

    function fileOpner() {
        $(".private-note-item").each(function () {
            $(this).click(function () {
                const parent = $(this).parent();
                const url = $(this).attr("data-url");
                const type = $(this).attr("data-type");
                const note_id = $(this).attr("data-id");
                const name = $(this).attr("data-name");
                $(".private-notes-moda-title").html(name);
                var src;
                if (type == "doc" || type == "csv" || type == "docx" || type == "ppt" || type == "pptx") {
                    src = `<iframe style="display:inline;width:100%;height:100%;" src="https://view.officeapps.live.com/op/embed.aspx?src=${url}" </iframe>`;
                    $(".viewer").html(src);
                } else if (type == "png" || type == "jpeg" || type == "jpg") {
                    src = `<img src="${url}" > `;
                    $(".viewer").html(`<center> ${src} </center>`);
                } else {
                    src = `<iframe width="100%" height="100%" src="${url}" </iframe>`;
                    $(".viewer").html(src);
                }

                $("#file-open-modal").modal("show");
                // delete function
                $(".private-notes-delete-btn").click(function () {
                    // delete 
                    swal({
                        title: "Are you sure?",
                        text: "Once deleted, you will not be able to recover this Note! ",
                        icon: "warning",
                        buttons: ["Cancel", "Delete"],
                        dangerMode: true,
                    })
                        .then((willDelete) => {
                            if (willDelete) {
                                $.ajax({
                                    type: "DELETE",
                                    url: atob(getCookie("api")) + "/notes/" + note_id,
                                    contentType: "application/json",
                                    processData: false,
                                    headers: {
                                        Authorization: getCookie("token")
                                    },
                                    beforeSend: function () {
                                        $(".private-note-delete-btn").html(`<i class="fa fa-spinner fa-spin mx-1"> </i> Please wait ...`);
                                        $(".private-note-delete-btn").prop("disabled", true);
                                    },
                                    success: function (data) {
                                        $(".private-note-delete-btn").html(`Delete`);
                                        $(".private-note-delete-btn").prop("disabled", false);
                                        swal("Success ! Your note deleted succesfully!", {
                                            icon: "success",
                                            button: "continue"
                                        }).then((function () {
                                            $("#file-open-modal").modal("hide");
                                            $(parent).remove();
                                            // window.location = "/dashboard/private-notes";
                                        }));

                                    },
                                    error: function (err) {
                                        swal("Error!", "Somthing went wrong , please try after sometimes", "error");
                                    }
                                })
                            }
                        });
                });
                // download private notes
                $(".private-notes-download").click(function () {
                    download(url, name);
                });
                // rename private notes
                // $(".private-notes-rename-btn").click(function () {
                //     alert(note_id);
                // })

            });
        });
    }

    function download(uri, name) {
        var link = document.createElement("a");
        link.setAttribute('download', name);
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    // search private notes
    $("form").submit(function (event) {
        event.preventDefault();
        const input = $("input").val();
        if (input.length !== 0) {
            $.ajax({
                type: "GET",
                url: atob(getCookie("api")) + "/notes/search/" + input,
                headers: {
                    Authorization: getCookie("token")
                },
                beforeSend: function () {
                    $(".loading-private-notes").removeClass("d-none");
                },
                success: function (data) {
                    console.log(data);
                    showData(data.notes);
                }
            })
        } else {
            loaddata();
        }
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