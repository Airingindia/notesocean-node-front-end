$(document).ready(function () {
    const collection_id = window.location.pathname.split("/")[3];
    $.ajax({
        type: "GET",
        url: app.getApi() + "/collections/" + collection_id,
        contentType: "application/json",
        processData: false,
        headers: {
            Authorization: getCookie("token")
        },
        success: function (data) {
            getAllPublicNotes();
            if (data) {
                $(".loading-collection").addClass("d-none");
                $(".collection-container").removeClass("d-none");
                $(".collection-name").val(data.name);
                $("title").html(data.name);
                $("textarea").val(data.description);
                $(".select-banner-img").attr("src", data.thumbnails.replace("https://s3.ap-south-1.amazonaws.com/thumbnails.notesocean.com", "https://thumbnails.ncdn.in/fit-in/700x100/filters:format(webp)/filters:quality(100)"));
                const box = $(".add-notes-box").parent();
                addNotes(data.products);
            } else {
                $(".collection-removed").removeClass("d-none");
                $(".loading-collection").addClass("d-none");
                $(".collection-container").remove();
            }
        },
        error: function (err) {
            app.alert(err.status, err?.responseJSON?.message ? err?.responseJSON?.message : "Something went wrong");
            $(".collection-removed").css({ display: "block" });
            $(".notes-details-row").addClass("d-none");
        }
    });

    var wow = new WOW({ scrollContainer: ".public-notes-row-modal" });
    wow.init();
    var next = 0;
    var prev = 0;
    var checked = false;
    var hit = false;
    isSearched = false;
    function checkScroll() {
        $(".public-notes-row-modal").scroll(function () {
            // get last div element of .public-notes-container
            let lastDiv = $(".public-item-row-notes").last();
            //    get visibility of last div
            let lastDivVisiblity = lastDiv.css("visibility");
            console.log(lastDivVisiblity);
            if (lastDivVisiblity == "visible") {
                console.log("visible");
                if (!hit) {
                    next += 1;
                    hit = true;
                    getAllPublicNotes();
                }

            }
        });
    }

    var CollectionNotesIds = [];

    function getAllPublicNotes() {
        $.ajax({
            type: "GET",
            url: app.getApi() + "/products?page=" + next,
            headers: {
                Authorization: getCookie("token")
            },
            before: function () {

            },
            success: function (data) {

                if (data.requested.length > 0) {
                    // push all ids in array

                    prev = next;
                    hit = false;
                    localStorage.setItem("public-notes", JSON.stringify(data));
                    // $("#public-notes").html("");
                    $(".loading-public-notes").addClass("d-none");

                    for (let i = 0; i < data.requested.length; i++) {
                        const box = $(".add-notes-box").parent();
                        let isChecked = ""
                        if (CollectionNotesIds.includes(data.requested[i].uuid)) {
                            isChecked = "checked"
                        }
                        $(".public-notes-row-modal").append(`
                    <div class="col-md-4 container my-3 public-item-row-notes">
                        <div class="form-check form-check-inline"></div>
                            <div class="card border-0 shadow rounded h-100" data-id="${data.requested[i].uuid}" data-name="${data.requested[i].name}" data-thumbnails="${data.requested[i].thumbnails.split(",")[0].replace("https://s3.ap-south-1.amazonaws.com/thumbnails.notesocean.com", "https://thumbnails.ncdn.in/fit-in/300x300/filters:format(webp)/filters:quality(100)")}">
                                <div class="card-header bg-white border-0"><input class="form-check-input" id="inlineCheckbox1" type="checkbox" value="option1" ${isChecked} /></div><img class=" lozad card-img-top" src="${data.requested[i].thumbnails.split(",")[0].replace("https://s3.ap-south-1.amazonaws.com/thumbnails.notesocean.com", "https://thumbnails.ncdn.in/fit-in/300x300/filters:format(webp)/filters:quality(100)")}" data-src="${data.requested[i].thumbnails.split(",")[0].replace("https://s3.ap-south-1.amazonaws.com/thumbnails.notesocean.com", "https://thumbnails.ncdn.in/fit-in/300x300/filters:format(webp)/filters:quality(100)")}}" height="190px" />
                                <div class="card-body border-0"> </div>
                                <div class="card-footer border-0 bg-white">
                                    <p class="card-text"> ${data.requested[i].name} </p>
                            </div>
                        </div>
                </div>
                    `);
                    }
                    check();
                    checkScroll();
                } else {
                    app.alert(err.status, err?.responseJSON?.message ? err?.responseJSON?.message : "Something went wrong");
                    $(".loading-public-notes").addClass("d-none");
                    $(".public-notes-row-modal").html("");
                }
            },
            error: function (err) {
                app.alert(err.status, "Failed to load notes");
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
                    url: app.getApi() + "/collections/" + collection_id + "/products/" + noteid,
                    headers: {
                        Authorization: getCookie("token"),
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
                        CollectionNotesIds.pop(noteid);
                        $(btn).addClass("fa-times");
                        $(btn).removeClass("fa-spinner fa-spin");
                    },
                    error: function (err) {
                        app.alert(err.status, err?.responseJSON?.message ? err?.responseJSON?.message : "Something went wrong");
                    }
                });

                return false;
            });

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
                    url: app.getApi() + "/collections/" + collection_id + "/products/" + selected_notes_ids.toString(),
                    headers: {
                        Authorization: getCookie("token"),
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
                        app.alert(err.status, err?.responseJSON?.message ? err?.responseJSON?.message : "Something went wrong");
                    },
                    complete: function () {
                        $("#select-public-notes-modal").modal("hide");
                    }
                });
            } else {
                $("#select-public-notes-modal").modal("hide");
            }
            // uncheckall();
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
            let id = data[i].uuid;
            CollectionNotesIds.push(id);
            let thumbnails = data[i].thumbnails.split(",")[0].replace("https://thumbnails.ncdn.in", "https://thumbnails.ncdn.in/300x300/filters:format(webp)/filters:quality(100)");
            $(".collection-notes-item.plus").before(`
            <div class="collection-notes-item col-lg-3 col-6 my-1 border-0 rounded">
            <a href="/dashboard/public-notes/${id}">
            <div class="card p-0 shadow h-100 border-0 rounded">
                <div class="card-header"><i class="fa fa-times delete-note-from-collection" data-note-id="${id}"></i></div>
                <div class="card-body p-0"><img class="card-img-top collection-notes-thumbnail w-100" src="${thumbnails}" /></div>
                <div class="card-footer">
                    <div class="card-text"> <small> ${name.substring(0, 50)} ...</small></div>
                </div>
            </div>
            </a>
        </div>`);
        }

        deleteNotesFormCollection();
        return;


    }

    $(".update-collection-btn").click(function () {
        updateCollection();
    })

    function updateCollection() {
        const collection_name = $(".collection-name").val();
        const collection_description = $("textarea").val();
        if (collection_name.length > 10) {
            var form = new FormData();
            var collection_json = {
                name: collection_name,
                description: collection_description
            }
            form.append("collections", new Blob([JSON.stringify(collection_json)], { type: "application/json" }));
            $.ajax({
                type: "PUT",
                url: app.getApi() + "/collections/" + collection_id,
                headers: {
                    Authorization: getCookie("token"),
                },
                data: form,
                processData: false,
                contentType: false,
                beforeSend: function () {
                    $(".update-collection-btn").prop("disabled", true);
                    $(".update-collection-btn").html(` <i class="fa fa-spinner fa-spin"> </i> Updating..`);
                },
                success: function (data) {
                    $(".update-collection-btn").prop("disabled", false);
                    $(".update-collection-btn").html(` <i class="fa  fa-save"> </i> Update`);
                    new Noty({
                        theme: "nest",
                        type: "success",
                        text: "Collection updated !",
                        timeout: 3000,
                    }).show();
                },
                error: function (err) {
                    $(".update-collection-btn").prop("disabled", false);
                    $(".update-collection-btn").html(` <i class="fa  fa-save"> </i> Update`);
                    app.alert(err.status, err?.responseJSON?.message ? err?.responseJSON?.message : "Something went wrong");
                }
            })

        } else if (collection_name.length < 10) {
            $(".collection-name").addClass("is-invalid");
            $(".collection-name").click(function () {
                $(this).removeClass("is-invalid");
            })
        }
    }

    addNotesToCollection();

    check();
    // uncheckall();

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

    $(".delete-collection-btn").click(function () {
        deleteCollection();
    })

    function deleteCollection() {
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
                        url: app.getApi() + "/collections/" + collection_id,
                        contentType: "application/json",
                        processData: false,
                        headers: {
                            Authorization: getCookie("token")
                        },
                        beforeSend: function () {
                            $(".delete-collection-btn").prop("disabled", true);
                            $(".delete-collection-btn").html("Deleting...");
                        },
                        success: function (data) {
                            $(".delete-collection-btn").prop("disabled", false);
                            $(".delete-collection-btn").html("Delete");
                            new Noty({
                                theme: "sunset",
                                type: "error",
                                text: '<i class="fa fa-check-circle">  </i> Collection Deleted ',
                                timeout: 4000,
                            }).show();
                            window.location = "/dashboard/collections";
                        },
                        error: function (err) {
                            app.alert(err.status, err?.responseJSON?.message ? err?.responseJSON?.message : "Something went wrong");
                            $(".delete-collection-btn").prop("disabled", false);
                            $(".delete-collection-btn").html("Delete");

                        }
                    })

                }
            });
    }
});