$(document).ready(function () {
    const collection_id = window.location.pathname.split("/")[3];

    function getCollectionDetails() {
        $.ajax({
            type: "GET",
            url: localStorage.getItem("api") + "/collections/" + collection_id,
            contentType: "application/json",
            processData: false,
            headers: {
                Authorization: localStorage.getItem("token")
            },
            success: function (data) {
                if (data) {
                    $(".loading-collection").addClass("d-none");
                    $(".collection-container").removeClass("d-none");
                    $(".collection-name").val(data.name);
                    $("textarea").val(data.description);
                    $(".select-banner-img").attr("src", data.thumbnails);
                    const box = $(".add-notes-box").parent();
                    var public_notes = data.products;
                    getAllPublicNotes();
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
            url: localStorage.getItem("api") + "/products",
            headers: {
                Authorization: localStorage.getItem("token")
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
                            <div class="card border-0 shadow rounded h-100" data-id="${data.requested[i].id}" data-name="${data.requested[i].name}" data-thumbnails="${data.requested[i].thumbnails.split(",")[0]}">
                                <div class="card-header bg-white border-0"><input class="form-check-input" id="inlineCheckbox1" type="checkbox" value="option1" /></div><img class=" lozad card-img-top" src="${data.requested[i].thumbnails.split(",")[0]}" data-src="${data.requested[i].thumbnails.split(",")[0]}" height="190px" />
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
                const noteid = $(this).attr("data-note-id");
                const parent = $(this).parent().parent().parent();
                $(parent).remove();
                alert(noteid);
            });

            $(this).parent().parent().parent().on("contextmenu", function () {
                var cont = $(this);
                $(".collections-context-menu").modal("show");
                const noteid = $(this).find("i").attr("data-note-id");
                $("#delete-collections").click(function () {
                    $(cont).remove();
                    $(".collections-context-menu").modal("hide");
                    alert(noteid);
                });

                $("#preview-collections ").click(function () {
                    window.location = "/dashboard/public-notes/" + noteid;
                })
                return false;
            })

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
                            note_id: note_id,
                            name: name,
                            thumbnails: thumbnails
                        }
                        selected_notes_arry.push(notes_data);
                        selected_notes_ids.push(note_id);
                    }

                }
            });

            // make a ajax call to add notes in collection
            $.ajax({
                type: "POST",
                url: localStorage.getItem("api") + "/collections/" + collection_id + "/products/" + selected_notes_ids.toString(),
                headers: {
                    Authorization: localStorage.getItem("token")
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
                }
            });
            uncheckall();
            deleteNotesFormCollection();
            $("#select-public-notes-modal").modal("hide");
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
            let id = data[i].note_id;
            let thumbnails = data[i].thumbnails;
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
    }


    function updateCollection() {
        var selected_banner_file;
        $(".select-banner-img").click(function () {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            $(input).click();
            $(input).on("change", function (event) {
                selected_banner_file = $(this).prop('files')[0];
                $(".select-banner-img").attr("src", URL.createObjectURL(selected_banner_file));
            });
        });

        $("fordgfdm").submit(function (event) {
            event.preventDefault();
            // get all selected notesocean
            var selected_notes_arry = [];
            $(".public-notes-item").each(function () {
                selected_notes_arry.push($(this).attr("data-id"));
            });
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
                    url: localStorage.getItem("api") + "/collections/" + collection_id,
                    headers: {
                        Authorization: localStorage.getItem("token")
                    },
                    data: form,
                    processData: false,
                    contentType: false,
                    mimeType: "multipart/form-data",
                    beforeSend: function () {
                        $(".submit-btn").html(" <i class='fa fa-spinner fa-spin mx-1'> </i> Please wait...");
                        $(".submit-btn").prop("disabled", true);
                    },
                    success: function (data) {
                        //  show success  when collection will update 
                    },
                    error: function () {
                        swal("Error", "Somthing went wrong please try again after sometimes ", "error");
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

        });

    }
    // windown onload function call

    addNotesToCollection();
    getAllPublicNotes();
    deleteNotesFormCollection();
    getCollectionDetails();
    check();
    uncheckall();
});