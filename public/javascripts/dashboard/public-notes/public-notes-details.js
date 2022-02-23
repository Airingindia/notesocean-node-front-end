$(document).ready(function () {
    const public_notes_id = window.location.pathname.split("/")[3];
    $.ajax({
        type: "GET",
        url: sessionStorage.getItem("api") + "/products/" + public_notes_id,
        ContentType: "application/json",
        processData: false,
        headers: {
            Authorization: localStorage.getItem("token")
        },
        success: function (data) {
            if (data.length !== 0) {

                $(".loading-public-notes").addClass("d-none");
                $(".public-notes-details-container").removeClass("d-none");
                console.log(data);
                let id = data.id;
                let name = data.name;
                let thumbnails = data.thumbnails;
                let views = data.views;
                let dislikes = data.dislikes;
                let likes = data.likes;
                let timestamp = data.timestamp;

                $(".public-notes-title").html(name);
                $(".public-notes-likes-count").html(likes);
                $(".public-notes-dislikes-count").html(dislikes);
                $(".public-notes-views-count").html(formatViews(views));
                $(".notes-img").attr("src", thumbnails.split(",")[0]);
                dailyViews();
                deleteNote();
                updateNote();
                validate();
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

    function dailyViews() {
        google.charts.load('current', { 'packages': ['corechart'] });
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {
            var data = google.visualization.arrayToDataTable([
                ['Day', 'Views', "Likes"],
                ['1 jan', 400, 1110],
                ['2 jan', 500, 20],
                ['3 jan', 600, 30],
                ['4 jan', 100, 100],
                ['5 jan', 800, 50],
                ['6 jan', 800, 60],
                ['7 jan', 00, 70],
                ['8 jan', 1200, 80],
                ['9 jan', 1400, 90],
                ['10 jan', 1500, 1100],
                ['11 jan', 1600, 10],
                ['12 jan', 1700, 5],
                ['13 jan', 400, 11],
                ['13 jan', 00, 134],
            ]);

            var options = {
                title: '',
                curveType: 'function',
                legend: { position: 'bottom' }
            };

            var chart = new google.visualization.LineChart(document.getElementById('daily-views'));

            chart.draw(data, options);
        }
    };

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
                            url: sessionStorage.getItem("api") + "/products/" + public_notes_id,
                            contentType: "application/json",
                            processData: false,
                            headers: {
                                Authorization: localStorage.getItem("token")
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
        });
    }

    function validate() {
        $(".note-title").on("input", function () {
            if ($(this).val().length > 20) {
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
                $(".invalid-title-error").html("Title should be at least 20 characters");
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

        // description validations

        $(".note-descriptions").on("input", function () {
            if ($(this).val().length > 30) {
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
                $(".invalid-descriptions-error").html("Descriptions should be at least 30 characters");
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
    };
    const formatViews = n => {
        if (n < 1e3) return n;
        if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
        if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
        if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + "B";
        if (n >= 1e12) return +(n / 1e12).toFixed(1) + "T";
    };
})