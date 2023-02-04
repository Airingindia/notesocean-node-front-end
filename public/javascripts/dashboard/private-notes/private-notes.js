$(document).ready(function () {

    dash.getUserNotesCount().then(data => {
        let count = data.userNotesCount;
        $(".total-notes").html(count);
    }).catch(err => {
        app.alert(err.status, "faild to load notes count !")
    })
    // get all private notes
    var wow = new WOW({ scrollContainer: ".second-side" });
    wow.init();
    var next = 0;
    var prev = 0;
    var checked = false;
    var hit = false;
    var isSearched = false;
    function check() {


        $(".second-side").scroll(function () {
            // get last div element of .public-notes-container
            let lastDiv = $(".public-item").last();
            //    get visibility of last div
            let lastDivVisiblity = lastDiv.css("visibility");
            console.log(lastDivVisiblity);
            if (lastDivVisiblity == "visible") {
                if (!hit) {
                    next += 1;
                    hit = true;
                    loaddata();
                }

            }
        });
    }
    function loaddata() {
        if (!isSearched) {
            $.ajax({
                type: "GET",
                url: app.getApi() + "/notes?page=" + next,
                headers: {
                    Authorization: decodeURIComponent(getCookie("token"))
                },
                beforeSend: function () {
                    $(".loading-private-notes").removeClass("d-none");
                },
                success: function (data) {
                    $(".loading-private-notes").addClass("d-none");
                    showData(data.requested);

                },
                error: function (err) {
                    app.alert(err.status, err?.responseJSON?.message ? err?.responseJSON?.message : "Something went wrong");
                }
            });
        }
    }

    loaddata();

    function showData(data) {
        if (data.length !== 0) {
            hit = false;
            loaderVisible(false);
            let adshow = 0;
            for (let i = 0; i < data.length; i++) {
                // adshow++;
                // if(adshow == 5){
                //     adshow = 0;
                //     $(".notes-container-row").append(`
                //     <div class="col-md-6 d-flex justify-content-center align-items-center">
                //     <ins class="adsbygoogle"
                //     style="display:inline-block;width:336px;height:280px"
                //     data-ad-client="ca-pub-3834928493837917"
                //     data-ad-slot="1394357315"></ins>
                //     </div>`);
                //     (adsbygoogle = window.adsbygoogle || []).push({});
                // }

                let name = data[i].name;
                if (name.length > 30) {
                    name = name.substring(0, 30) + "...";
                }
                let fileType = data[i].fileType;
                let id = data[i].uuid;
                let size = data[i].size;
                let timestamp = data[i].timestamp;
                let ago_time = timeDifference(timestamp);
                let actual_size = bytesToSize(size);
                let url = data[i].file;
                let img = "/images/icons/" + fileType + ".png";
                let type = data[i].fileType;


                $(".notes-container-row").append(`
                <div class="col-6 col-lg-2 my-2 public-item wow animate__animated  animate__fadeIn">
                    <div class="card border-0 shadow p-0 private-note-item" data-name="${name}" data-id="${id}"  data-time="${ago_time}" data-size="${actual_size}" id="${id}" data-url="${url}" data-type="${type}"  style="height:100%">
                            
                            <img class="card-img-top w-50 mx-auto mt-4" src="${img}" /> 
                            <div class="card-body border-0 py-2">
                               
                            </div>
                            <div class="card-footer border-0 bg-white">
                            <p class="card-title">${name} </p>
                                <small class="card-text text-muted"> <i class="fa fa-clock mx-1"></i><span> ${ago_time} </span></small>

                                <p class="card-text d-flex align-items-center justify-content-between">
                                
                                <span class="text-muted"> 
                                <i class="fa fa-database mx-1">
                                </i>
                                <small> ${actual_size} </small>
                                </span>                                    
                                </p>
                            </div>
                      
                    
                    </div>
                </div>
                `);
            }
            fileOpner();
            if (!checked) {
                checked = true;
                check();
            }
            // openContext();
        } else {
            if (checked) {
                $(".loading-private-notes").addClass("d-none");
            } else {
                $(".no-private-notes").removeClass("d-none");
                $(".loading-private-notes").addClass("d-none");
            }


        }
    }

    $("input[type='search']").on("search", function () {
        if ($(this).val() == "") {
            isSearched = false;
            clearData();
            next = 0;
            loaddata();
        }
    });

    function clearData() {
        $(".notes-container-row").html("");
    }

    function loaderVisible(trueOrFalse) {
        if (trueOrFalse) {
            $(".loading-private-notes").removeClass("d-none");
        } else {
            $(".loading-private-notes").addClass("d-none");
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
        $(".private-note-item").each(function () {
            $(this).on("contextmenu", function (e) {
                e.preventDefault();
                $(".context-menu").modal("show");
                // set position
                $(".modal-dialog").css({
                    "top": (e.pageY - 50) + "px",
                    "left": (e.pageX + 50) + "px",
                    "position": "absolute",
                })
            })
        });

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
                const type = $(this).attr("data-type");
                const note_id = $(this).attr("data-id");
                const name = $(this).attr("data-name");
                // get note url
                $.ajax({
                    type: "GET",
                    url: app.getApi() + "/notes/" + note_id,
                    headers: {
                        Authorization: decodeURIComponent(getCookie("token"))
                    },
                    contentType: "application/json",
                    processData: false,
                    beforeSend: function () { },
                    success: function (data) {
                        showFile(data.name, data.type, data.file);
                    },
                    error: function (err) {
                        app.alert(err.status, err?.responseJSON?.message ? err?.responseJSON?.message : "Something went wrong");
                    }
                });

                function showFile(name, type, url) {
                    $(".private-notes-moda-title").html(name);
                    var src;
                    if (type == "doc" || type == "csv" || type == "docx" || type == "ppt" || type == "pptx") {
                        src = `<iframe style="display:inline;width:100%;height:100%;" src="https://view.officeapps.live.com/op/embed.aspx?src=${url}" </iframe>`;
                        $(".viewer").html(src);
                    } else if (type == "png" || type == "jpeg" || type == "jpg") {
                        src = `<img style="width:100px;height:100%" src="${url}" > `;
                        $(".viewer").html(src);
                    } else {
                        src = `<iframe width="100%" height="100%" src="${url}" </iframe>`;
                        $(".viewer").html(src);
                    }

                    $("#file-open-modal").modal("show");
                    $(".private-notes-download").click(function () {
                        download(url, name);
                    });
                }

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
                                    url: app.getApi() + "/notes/" + note_id,
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
                                        app.alert(err.status, err?.responseJSON?.message ? err?.responseJSON?.message : "Something went wrong");
                                    }
                                })
                            }
                        });
                });
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
            isSearched = true;
            $.ajax({
                type: "GET",
                url: app.getApi() + "/notes/search/" + input,
                headers: {
                    Authorization: getCookie("token")
                },
                beforeSend: function () {
                    loaderVisible(true);
                },
                success: function (data) {
                    if (data.size == 0) {
                        new Noty({
                            theme: "sunset",
                            type: "error",
                            text: "No results found",
                            timeout: 4000,
                        }).show();
                        loaderVisible(false);
                    } else {
                        new Noty({
                            theme: "sunset",
                            type: "success",
                            text: "Found " + data.size + " results",
                            timeout: 4000,
                        }).show();
                        clearData();
                        showData(data.requested)
                    }
                },
                error: function (err) {
                    app.alert(err.status, err?.responseJSON?.message ? err?.responseJSON?.message : "Something went wrong");
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