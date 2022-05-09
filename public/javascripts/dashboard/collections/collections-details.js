$(document).ready(function () {
    // get collection details


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
                if (data !== undefined) {
                    $(".collection-name").val(data.name);
                    $("textarea").val(data.description);
                    $(".select-banner-img").attr("src", data.thumbnails);
                    deleteCollection();
                    const box = $(".add-notes-box").parent();
                    var public_notes = data.products;
                    if (public_notes.length > 0) {
                        for (let i = 0; i < public_notes.length; i++) {
                            let note_id = public_notes[i].id;
                            let note_thumbnails = public_notes[i].thumbnails;
                            let name = public_notes[0].name;
                            $(box).before(`<div class="col-md-2 my-3 public-notes-item" data-id="${note_id}">
                        <div class="card h-100  rounded w-100">
                        <img class="card-img-top" src="${note_thumbnails.split(",")[0]}" /><i class="fa fa-times-circle delete-note-from-collection"></i>
                        <div class="card-body border-0"> </div>
                            <div class="card-footer border-0 bg-white">
                                <h6 class="card-title"> ${name}</h6>
                            </div>
                        </div>
                    </div>`);
                        };
                        getAllPublicNotes();
                    }

                } else {
                    $(".collection-removed").css({ display: "block" });
                    $(".notes-details-row").addClass("d-none");
                }
            },
            error: function (err) {
                $(".collection-removed").css({ display: "block" });
                $(".notes-details-row").addClass("d-none");
            }
        });
    }

    getCollectionDetails();


    function deleteCollection() {
        $(".delete-collection").click(function () {
            swal({
                title: "Are you sure?",
                text: "Once deleted, you will not be able to recover this collection!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        $.ajax({
                            type: "DELETE",
                            url: localStorage.getItem("api") + "/collections/" + collection_id,
                            contentType: "application/json",
                            processData: false,
                            headers: {
                                Authorization: localStorage.getItem("token")
                            },
                            success: function (data) {
                                swal("Success ! Your collection deleted succefully!", {
                                    icon: "success",
                                    button: "continue"
                                }).then((function () {
                                    window.location = "/dashboard/collections";
                                }));
                            },
                            error: function (err) {
                                swal("Error !, Somthing went wrong please try again after sometimes!", {
                                    icon: "error",
                                });
                            }
                        })

                    }
                });
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
                    deleteNotesFormCollection();
                    check();
                    addNotesToCollection();
                }
            }
        });
    }

    getAllPublicNotes();
    // add notes and delete functions

    $(".plus").click(function () {
        $("#select-public-notes-modal").modal("show");
    });

    function deleteNotesFormCollection() {
        $(".delete-note-from-collection").each(function () {
            $(this).click(function () {
                const noteid = $(this).attr("data-note-id");
                const parent = $(this).parent().parent().parent();
                $(parent).remove();
            });

            $(this).parent().parent().parent().on("contextmenu", function () {
                var cont = $(this);
                $(".collections-context-menu").modal("show");
                const noteid = $(this).find("i").attr("data-note-id");
                $("#delete-collections").click(function () {
                    $(cont).remove();
                    $(".collections-context-menu").modal("hide");
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
        $(".collection-add-btn").click(function () {
            $(".public-notes-item").remove();
            const box = $(".add-notes-box").parent();
            var selected_notes_arry = [];
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
                    }

                }
            });

            // make a ajax call to add notes in collection


            addNotes(selected_notes_arry);
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

    $("form").submit(function (event) {
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
                    $(".submit-btn").html(`<i class="fa fa-plus mx-1 ">  </i> <span> Create Collection </span>`);
                    $(".submit-btn").prop("disabled", false);
                    data = JSON.parse(data);
                    var collections_id = data.id;
                    if (selected_notes_arry.length !== 0) {
                        $.ajax({
                            type: "POST",
                            url: localStorage.getItem("api") + "/collections/" + collections_id + "/products/" + selected_notes_arry.toString(),
                            headers: {
                                Authorization: localStorage.getItem("token")
                            },
                            beforeSend: function () {

                            },
                            success: function (data) {
                                //    success message
                                swal({
                                    title: "Created!",
                                    text: "your collection updated successfully",
                                    icon: "success",
                                    buttons: ["Continue"],
                                    dangerMode: true,
                                })
                                    .then((willDelete) => {
                                        if (willDelete) {
                                            window.location = "/dashboard/collections/" + collections_id;
                                        } else {
                                            $(".collection-name").val("");
                                            $("textarea").val("");
                                            $(".public-notes-item").remove();
                                            $(".select-banner-img").attr("src", "/images/dummy/collection_thumbnail.png");
                                        }
                                    });
                            }
                        });
                    } else {
                        swal({
                            title: "Created!",
                            text: "your collection Updated successfully",
                            icon: "success",
                            buttons: ["Continue"],
                            dangerMode: true,
                        })
                            .then((willDelete) => {
                                if (willDelete) {
                                    window.location = "/dashboard/collections/" + collections_id;
                                } else {
                                    $(".collection-name").val("");
                                    $("textarea").val("");
                                    $(".public-notes-item").remove();
                                    $(".select-banner-img").attr("src", "/images/dummy/collection_thumbnail.png");
                                }
                            });
                    }
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


});