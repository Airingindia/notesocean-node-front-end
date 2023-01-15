$(document).ready(function () {
    const public_notes_id = window.location.pathname.split("/")[3];
    function getNoteDetails() {
        $.ajax({
            type: "GET",
            url: app.getApi() + "/products/" + public_notes_id,
            ContentType: "application/json",
            processData: false,
            headers: {
                Authorization: getCookie("token")
            },
            success: function (data) {
                console.log(data);
                if (data.products !== null) {
                    if (data.products.length !== 0) {
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


    // getNoteDetails();

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
                            url: app.getApi() + "/products/" + public_notes_id,
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
            url: app.getApi() + "/products/" + public_notes_id,
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
                $(".description").html($(".note-descriptions").val());
                $(".title").html($(".note-title").val());
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

    dash.getUserProductViewTimeLine(public_notes_id).then(res => {
        if (!res.hasOwnProperty("size") || res.size == 0) {
            $("#timeline-chaart").html("<h4 class='text-center'>No views yet</h4>");
            return false;
        }
        let data = res.requested;
        let viewsData = [];
        let views = [];
        viewsData.push(["Date", "Views"]);
        for (let i = 0; i < data.length; i++) {
            views.push([moment.unix((data[i].timestamp) / 1000).format("ll"), data[i].currentViews]);
        }

        showChart(viewsData.concat(views.reverse()));
        console.log(views);
    }).catch(err => {
        console.log(err);
        $("#timeline-chaart").html("<h4 class='text-center text-muted mt-3'>No Timeline</h4>");
        return false;
    });

    dash.getProductDetails(public_notes_id).then(res => {
        let data = res.products;
        let title = data.name;
        let description = data.description;
        let likes = data.likes;
        let views = data.views;
        let dislikes = data.dislikes;
        let pages = data.pages;
        let size = data.size;
        let thumbnails = data.thumbnails;
        $(".thumbnails").attr("src", thumbnails);
        $(".likes").html(likes);
        $(".views").html(views);
        $(".dislikes").html(dislikes);
        $(".title").html(title);
        $(".description").html(description);
        $(".pages").html(pages);
        $(".note-title").val(title);
        $(".note-descriptions").val(description);
        $(".size").html(formatBytes(size));
    }).catch(err => {
        app.alert(err.status, "failed to load notes details");
    });


    function showChart(views) {

        google.charts.load('current', { 'packages': ['corechart'] });
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {
            var data = google.visualization.arrayToDataTable(views);

            var options = {
                curveType: 'function',
                legend: { position: 'bottom' },
                width: "100%",
                height: 300,
            };

            var chart = new google.visualization.LineChart(document.getElementById('timeline-chaart'));

            chart.draw(data, options);
        }

    }

    function formatBytes(bytes, decimals = 1) {
        if (!+bytes) return '0 Bytes'

        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

        const i = Math.floor(Math.log(bytes) / Math.log(k))

        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
    }

    showChart();

    $(".share-btn").click(function () {
        share();
    })

    function share() {
        let title = $(".title").html();
        let description = $(".description").html();
        let img = $(".note-img").attr("src");
        let shareData = {
            title: title,
            text: description,
            url: "https://notesocean.com/notes/" + public_notes_id,
            img: img
        }

        // share using native share api

        if (navigator.share) {
            navigator.share(shareData).then(() => {
                console.log('Thanks for sharing!');
            })
                .catch((err) => {
                    app.alert(400, "Failed to share");
                });

        } else {
            // copy  link to clipboard
            let input = document.createElement("input");
            input.value = shareData.url;
            document.body.appendChild(input);
            input.select();
            document.execCommand("copy");
            document.body.removeChild(input);
            app.alert(200, "link copied to clipboard");
        }
    }

    $(".Preview-btn").click(function () {
        window.location = "/notes/" + public_notes_id;
    });
});