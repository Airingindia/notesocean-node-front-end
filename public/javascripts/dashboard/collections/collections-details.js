$(document).ready(function () {
    const collection_id = window.location.pathname.split("/")[3];

    function getCollectionDetails() {
        $.ajax({
            type: "GET",
            url: atob(getCookie("api")) + "/collections/" + collection_id,
            contentType: "application/json",
            processData: false,
            headers: {
                Authorization: getCookie("token")
            },
            success: function (data) {
                if (data) {
                    $(".loading-collection").addClass("d-none");
                    $(".collection-container").removeClass("d-none");
                    $(".collection-name").val(data.name);
                    $("textarea").val(data.description);
                    $(".select-banner-img").attr("src", data.thumbnails.replace("https://s3.ap-south-1.amazonaws.com/thumbnails.notesocean.com", "https://thumbnails.ncdn.in/fit-in/700x100/filters:format(webp)/filters:quality(100)"));
                    const box = $(".add-notes-box").parent();
                    getAllPublicNotes();
                    addNotes(data.products);
                } else {
                    $(".collection-removed").removeClass("d-none");
                    $(".loading-collection").addClass("d-none");
                    $(".collection-container").remove();
                }
            },
            error: function (err) {
                $(".collection-removed").css({ display: "block" });
                $(".notes-details-row").addClass("d-none");
            }
        });
    }
    function getAllPublicNotes() {
        $.ajax({
            type: "GET",
            url: atob(getCookie("api")) + "/products",
            headers: {
                Authorization: getCookie("token")
            },
            before: function () {
                $(".public-notes-row-modal").html("");
            },
            success: function (data) {
                if (data.requested.length > 0) {
                    localStorage.setItem("public-notes", JSON.stringify(data));
                    // $("#public-notes").html("");
                    $(".loading-public-notes").addClass("d-none");
                    $(".public-notes-row-modal").html("");
                    for (let i = 0; i < data.requested.length; i++) {
                        const box = $(".add-notes-box").parent();
                        $(".public-notes-row-modal").append(`
                    <div class="col-md-2 container my-3 ">
                        <div class="form-check form-check-inline"></div>
                            <div class="card border-0 shadow rounded h-100" data-id="${data.requested[i].id}" data-name="${data.requested[i].name}" data-thumbnails="${data.requested[i].thumbnails.split(",")[0].replace("https://s3.ap-south-1.amazonaws.com/thumbnails.notesocean.com", "https://thumbnails.ncdn.in/fit-in/300x300/filters:format(webp)/filters:quality(100)")}">
                                <div class="card-header bg-white border-0"><input class="form-check-input" id="inlineCheckbox1" type="checkbox" value="option1" /></div><img class=" lozad card-img-top" src="${data.requested[i].thumbnails.split(",")[0].replace("https://s3.ap-south-1.amazonaws.com/thumbnails.notesocean.com", "https://thumbnails.ncdn.in/fit-in/300x300/filters:format(webp)/filters:quality(100)")}" data-src="${data.requested[i].thumbnails.split(",")[0].replace("https://s3.ap-south-1.amazonaws.com/thumbnails.notesocean.com", "https://thumbnails.ncdn.in/fit-in/300x300/filters:format(webp)/filters:quality(100)")}}" height="190px" />
                                <div class="card-body border-0"> </div>
                                <div class="card-footer border-0 bg-white">
                                    <p class="card-text"> ${data.requested[i].name} </p>
                            </div>
                        </div>
                </div>
                    `);
                    }
                    check();
                }
            }
        });
    }
    function deleteNotesFormCollection() {
        $(".delete-note-from-collection").each(function () {
            $(this).click(function () {
                var btn = $(this);
                var noteid = $(this).attr("data-note-id");
                const parent = $(this).parent().parent().parent();

                $.ajax({
                    type: "DELETE",
                    url: atob(getCookie("api")) + "/collections/" + collection_id + "/products/" + noteid,
                    headers: {
                        Authorization: getCookie("token"),
                        DeviceId: amplitude.getInstance().options.deviceId
                    },
                    beforeSend: function () {
                        $(btn).removeClass("fa-times");
                        $(btn).addClass("fa-spinner fa-spin");
                    },
                    success: function (data) {
                        new Noty({
                            theme: "nest",
                            type: "success",
                            text: "Note Deleted",
                            timeout: 4000,
                        }).show();
                        $(parent).remove();
                    },
                    complete: function () {
                        $(btn).addClass("fa-times");
                        $(btn).removeClass("fa-spinner fa-spin");
                    }
                })
            });

            // $(this).parent().parent().parent().on("contextmenu", function () {
            //     var cont = $(this);
            //     $(".collections-context-menu").modal("show");
            //     const noteid = $(this).find("i").attr("data-note-id");
            //     $("#delete-collections").click(function () {
            //         $(cont).remove();
            //         $(".collections-context-menu").modal("hide");
            //         alert(noteid);
            //     });

            //     $("#preview-collections ").click(function () {
            //         window.location = "/dashboard/public-notes/" + noteid;
            //     })
            //     return false;
            // })

        })
    }
    function check() {
        $(".public-notes-row-modal .card").each(function () {
            $(this).click(function () {
                const checkbox = $(this).find("input");
                if ($(checkbox).prop('checked')) {
                    $(checkbox).prop('checked', false);
                } else {
                    $(checkbox).prop('checked', true);
                }
                // console.log($(checkbox).prop('checked'));
            })
        })
    }

    function uncheckall() {
        $(".public-notes-row-modal .card").each(function () {
            const checkbox = $(this).find("input");
            $(checkbox).prop('checked', false);
        })
    }

    function addNotesToCollection() {
        $(".plus").click(function () {
            $("#select-public-notes-modal").modal("show");
        });
        $(".collection-add-btn").click(function () {
            $(".public-notes-item").remove();
            const box = $(".add-notes-box").parent();
            var selected_notes_arry = [];
            let selected_notes_ids = [];
            const selected = getSelectedNotes();
            $(".public-notes-row-modal .card input").each(function () {
                if ($(this).prop('checked')) {
                    const card = ($(this).parent().parent());
                    const note_id = $(card).attr("data-id");
                    const thumbnails = $(card).attr("data-thumbnails");
                    const name = $(card).attr("data-name");
                    // console.log(selected.findIndex((select) => { return select == note_id }));
                    if (selected.findIndex((select) => { return select == note_id }) == -1) {
                        var notes_data = {
                            id: note_id,
                            name: name,
                            thumbnails: thumbnails
                        }
                        selected_notes_arry.push(notes_data);
                        selected_notes_ids.push(note_id);
                    }

                }
            });

            // make a ajax call to add notes in collection
            if (selected_notes_arry.length > 0) {
                $.ajax({
                    type: "POST",
                    url: atob(getCookie("api")) + "/collections/" + collection_id + "/products/" + selected_notes_ids.toString(),
                    headers: {
                        Authorization: getCookie("token"),
                        DeviceId: amplitude.getInstance().options.deviceId
                    },
                    processData: false,
                    contentType: false,
                    beforeSend: function () {
                        $(".collection-add-btn").html(` <i class="fa fa-spinner fa-spin"> </i> Adding..`);
                    },
                    success: function (data) {
                        $(".collection-add-btn").html(`Add`);
                        new Noty({
                            theme: "nest",
                            type: "success",
                            text: "Notes added",
                            timeout: 4000,
                        }).show();
                        addNotes(selected_notes_arry);
                    },
                    error: function (errr) {
                        $(".collection-add-btn").html(`Add`);
                        new Noty({
                            theme: "nest",
                            type: "error",
                            text: "Faild to add notes , please try after sometimes",
                            timeout: 4000,
                        }).show();
                    },
                    complete: function () {
                        $("#select-public-notes-modal").modal("hide");
                    }
                });
            } else {
                $("#select-public-notes-modal").modal("hide");
            }
            uncheckall();
            deleteNotesFormCollection();
        });
    }
    function getSelectedNotes() {
        var selected = [];
        $(".delete-note-from-collection").each(function () {
            var noteid = $(this).attr("data-note-id");
            selected.push(noteid);
        });

        return selected;
    }

    function addNotes(data) {
        for (let i = 0; i < data.length; i++) {
            let name = data[i].name;
            let id = data[i].id;
            let thumbnails = data[i].thumbnails.split(",")[0].replace("https://s3.ap-south-1.amazonaws.com/thumbnails.notesocean.com", "https://thumbnails.ncdn.in/fit-in/300x300/filters:format(webp)/filters:quality(100)");
            $(".collection-notes-item.plus").before(`<div class="collection-notes-item col-md-4 my-1">
            <div class="card p-0">
                <div class="card-header"><i class="fa fa-times delete-note-from-collection" data-note-id="${id}"></i></div>
                <div class="card-body p-0"><img class="card-img-top collection-notes-thumbnail w-100" src="${thumbnails}" /></div>
                <div class="card-footer">
                    <div class="card-text"> <small> ${name.substring(0, 50)} ...</small></div>
                </div>
            </div>
        </div>`);
        }

        deleteNotesFormCollection();
        return;


    }
    function updatethumbnail() {
        var selected_banner_file;
        $(".change-img-btn").click(function () {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            $(input).click();
            $(input).on("change", function (event) {
                selected_banner_file = $(this).prop('files')[0];
                $(".select-banner-img").attr("src", URL.createObjectURL(selected_banner_file));
                selected_banner_file = $(this).prop('files')[0];
                $(".select-banner-img").attr("src", URL.createObjectURL(selected_banner_file));
                var form = new FormData();
                var collection_json = {
                    name: $("input.collection-name").val(),
                    description: $("textarea").val()
                }
                // form.append("collections", collection_json);
                form.append("collections", new Blob([JSON.stringify(collection_json)], { type: "application/json" }));
                form.append("file", selected_banner_file);
                $.ajax({
                    type: "PUT",
                    url: atob(getCookie("api")) + "/collections/" + collection_id,
                    headers: {
                        Authorization: getCookie("token"),
                        DeviceId: amplitude.getInstance().options.deviceId

                    },
                    data: form,
                    processData: false,
                    contentType: false,
                    mimeType: "multipart/form-data",
                    beforeSend: function () {
                        $(".change-img-btn").html(" <i class='fa fa-spinner fa-spin mx-1'> </i> updating...");
                        $(".change-img-btn").prop("disabled", true);
                    },
                    success: function (data) {
                        $(".change-img-btn").html("Change");
                        $(".change-img-btn").prop("disabled", false);
                        new Noty({
                            theme: "nest",
                            type: "success",
                            text: "Thumbnail uploaded successfully",
                            timeout: 4000,
                        }).show();
                    },
                    error: function () {
                        $(".change-img-btn").html("Change");
                        $(".change-img-btn").prop("disabled", false);
                        new Noty({
                            theme: "nest",
                            type: "error",
                            text: "Failed to update thumbnail",
                            timeout: 4000,
                        }).show()
                    }
                })
            });
        });
    }
    updatethumbnail();
    function updateCollection() {
        var timeoutId;
        $('textarea').on('input propertychange change', function () {
            // console.log('Textarea Change');

            clearTimeout(timeoutId);
            timeoutId = setTimeout(function () {
                // Runs 1 second (1000 ms) after the last change    
                updatedata();
            }, 1000);
        });
        $('input.collection-name').on('input propertychange change', function () {
            // console.log('Textarea Change');

            clearTimeout(timeoutId);
            timeoutId = setTimeout(function () {
                // Runs 1 second (1000 ms) after the last change    
                updatedata();
            }, 1000);
        });

        function updatedata() {
            const collection_name = $(".collection-name").val();
            const collection_description = $("textarea").val();
            if (collection_name.length > 10 && collection_description.length > 20) {
                var form = new FormData();
                // if (selected_banner_file !== undefined) {
                //     form.append("file", selected_banner_file);
                // }
                var collection_json = {
                    name: collection_name,
                    description: collection_description
                }
                // form.append("collections", collection_json);
                form.append("collections", new Blob([JSON.stringify(collection_json)], { type: "application/json" }));
                $.ajax({
                    type: "PUT",
                    url: atob(getCookie("api")) + "/collections/" + collection_id,
                    headers: {
                        Authorization: getCookie("token"),
                        DeviceId: amplitude.getInstance().options.deviceId
                    },
                    data: form,
                    processData: false,
                    contentType: false,
                    mimeType: "multipart/form-data",
                    beforeSend: function () {

                    },
                    success: function (data) {
                        new Noty({
                            theme: "nest",
                            type: "success",
                            text: "Collection Details updated",
                            timeout: 4000,
                        }).show();
                    },
                    error: function () {
                        new Noty({
                            theme: "nest",
                            type: "error",
                            text: "Failed to update collection details",
                            timeout: 4000,
                        }).show();
                    }
                })

            } else if (collection_name.length < 10) {
                $(".collection-name").addClass("is-invalid");
                $(".collection-name").click(function () {
                    $(this).removeClass("is-invalid");
                })
            } else if (collection_description.length < 20) {
                $("textarea").addClass("is-invalid");
                $("textarea").click(function () {
                    $(this).removeClass("is-invalid");
                })
            }
        }

    }
    updateCollection();
    // windown onload function call
    addNotesToCollection();
    getAllPublicNotes();

    getCollectionDetails();
    check();
    uncheckall();

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