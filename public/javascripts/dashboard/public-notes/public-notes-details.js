$(document).ready(function () {
    const public_notes_id = window.location.pathname.split("/")[3];
    function getNoteDetails() {
        $.ajax({
            type: "GET",
            url: atob(getCookie("api")) + "/products/" + public_notes_id,
            ContentType: "application/json",
            processData: false,
            headers: {
                Authorization: getCookie("token")
            },
            success: function (data) {
                if (data.product !== null) {
                    if (data.product.length !== 0) {
                        showData(data);
                        $(".loading-public-notes").addClass("d-none");
                        $(".public-notes-details-container").removeClass("d-none");
                    } else {
                        $(".loading-public-notes").addClass("d-none");
                        $(".notes-removed").removeClass("d-none");
                        $(".public-notes-details-container").addClass("d-none");
                    }
                } else {
                    $(".loading-public-notes").addClass("d-none");
                    $(".notes-removed").removeClass("d-none");
                    $(".public-notes-details-container").addClass("d-none");
                }
            },
            error: function (err) {
                $(".loading-public-notes").addClass("d-none");
                $(".notes-removed").removeClass("d-none");
                $(".public-notes-details-container").addClass("d-none");
            }
        });
    }

    function showData(data) {
        let id = data.product.id;
        let name = data.product.name;
        let thumbnails = data.product.thumbnails;
        let views = data.product.views;
        let dislikes = data.product.dislikes;
        let likes = data.product.likes;
        let timestamp = data.product.timestamp;
        let description = data.product.description;
        let tags = data.product.tags;

        $(".public-notes-title").html(name);
        $(".public-notes-likes-count").html(likes);
        $(".public-notes-dislikes-count").html(dislikes);
        $(".public-notes-views-count").html(formatViews(views));
        $(".public-notes-details-thumbnails").attr("src", thumbnails.split(",")[0]);
        $(".public-notes-description").html(description);
        $(".note-title").val(name);
        $(".note-descriptions").val(description);

        $(".share-item").attr("data-url", localStorage.getItem("home") + "/notes/" + public_notes_id);
        $(".share-item").attr("data-title", "I uploaded this notes on Notes Ocean and i earned money for this , please checkout my note");
    }
    getNoteDetails();

    function deleteNote() {

        $(".delete-puublic-note").click(function () {

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
                            url: atob(getCookie("api")) + "/products/" + public_notes_id,
                            contentType: "application/json",
                            processData: false,
                            headers: {
                                Authorization: getCookie("token")
                            },
                            beforeSend: function () {
                                $(".delete-puublic-note").html(`<i class="fa fa-spinner fa-spin mx-1"> </i> Please wait ...`);
                                $(".delete-puublic-note").prop("disabled", true);
                            },
                            success: function (data) {
                                $(".delete-puublic-note").html(`Delete`);
                                $(".delete-puublic-note").prop("disabled", false);
                                swal("Success ! Your note deleted succefully!", {
                                    icon: "success",
                                    button: "continue"
                                }).then((function () {
                                    window.location = "/dashboard/public-notes";
                                }));
                            },
                            error: function (err) {
                                swal("Error!", "Your note has beeen successfully deleted", "error");
                            }
                        })
                    }
                });
        });
    };
    function updateNote() {
        $(".public-notes-edit-btn").click(function () {
            $("#edit-public-notes-modal").modal('show');
            $(".public-notes-update-btn").click(function () {
                validate();
                if ($(".note-title").hasClass("is-valid") && $(".note-descriptions").hasClass("is-valid")) {
                    var title = $(".note-title").val();
                    var description = $(".note-descriptions").val();
                    const data = JSON.stringify({
                        name: title,
                        description: description
                    });
                    updateNoteData(data);
                } else if (!$(".note-title").hasClass("is-valid")) {
                    $(".note-title").addClass("is-invalid")
                } else if (!$(".note-descriptions").hasClass("is-valid")) {
                    $(".note-descriptions").addClass("is-invalid");
                }
            });

        });
    }
    function updateNoteData(data) {
        $.ajax({
            type: "PUT",
            url: atob(getCookie("api")) + "/products/" + public_notes_id,
            headers: {
                Authorization: getCookie("token")
            },
            contentType: "application/json",
            processData: false,
            data: data,
            beforeSend: function () {
                $(".public-notes-update-btn").html(`<i class="fa fa-spinner fa-spin"></i> </i> Please wait ...`);
                $(".public-notes-update-btn").prop("disabled", true);
            },
            success: function (data) {
                $(".public-notes-update-btn").html(`Update`);
                $(".public-notes-update-btn").prop("disabled", false);
                swal("success!", "Note successfully updated", "success");
                $(".public-notes-description").html($(".note-descriptions").val());
                $(".public-notes-title").html($(".note-title").val());
                $("#edit-public-notes-modal").modal('hide');
            }, error: function (error) {
                swal("oops!", "Note can't be update right now", "error");
                $("#edit-public-notes-modal").modal('hide');
            }
        });
    }
    function validate() {
        $(".note-title").on("input", function () {
            if ($(this).val().length > 30) {
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
                $(".invalid-title-error").html("Title should be at least 30 characters");
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

        if ($(".note-title").val().length > 30) {
            $(".note-title").addClass("is-valid");
            $(".note-title").removeClass("is-invalid");
        }
        else if ($(".note-title").val().length == 0) {
            $(".note-title").addClass("is-invalid");
            $(".note-title").removeClass("is-valid");
            $(".invalid-title-error").html("Title can't be empty'");
            $(".notes-title").addClass("animate__heartBeat");
        }
        else {
            $(".note-title").addClass("is-invalid");
            $(".note-title").removeClass("is-valid");
            $(".invalid-title-error").html("Title should be at least 30 characters");
        }

        // description validations

        $(".note-descriptions").on("input", function () {
            if ($(this).val().length > 40) {
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
                $(".invalid-descriptions-error").html("Descriptions should be at least 40 characters");
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

        if ($(".note-descriptions").val().length > 30) {
            $(".note-descriptions").addClass("is-valid");
            $(".note-descriptions").removeClass("is-invalid");
        }
        else if ($(".note-descriptions").val().length == 0) {
            $(".note-descriptions").addClass("is-invalid");
            $(".note-descriptions").removeClass("is-valid");
            $(".invalid-descriptions-error").html("Descriptions can't be empty'");
        }
        else {
            $(".note-descriptions").addClass("is-invalid");
            $(".note-descriptions").removeClass("is-valid");
            $(".invalid-descriptions-error").html("Descriptions should be at least 40 characters");
        }
    };
    const formatViews = n => {
        if (n < 1e3) return n;
        if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
        if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
        if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + "B";
        if (n >= 1e12) return +(n / 1e12).toFixed(1) + "T";
    };
    Shareon.init();

    $(".note-preview-btn").click(function () {
        window.location = "/notes/" + public_notes_id;
    })
    $(".note-share-btn").click(function () {
        $(".share-modal").modal("show");
    })

    //  call functions
    deleteNote();
    updateNote();

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