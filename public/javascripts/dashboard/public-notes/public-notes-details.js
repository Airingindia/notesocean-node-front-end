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
                let description = data.description;
                let tags = data.tags;

                $(".public-notes-title").html(name);
                $(".public-notes-likes-count").html(likes);
                $(".public-notes-dislikes-count").html(dislikes);
                $(".public-notes-views-count").html(formatViews(views));
                $(".notes-img").attr("src", thumbnails.split(",")[0]);
                $(".public-notes-description").html(description);
                $(".note-title").val(name);
                $(".note-descriptions").val(description);
                dailyViews();
                deleteNote();
                updateNote();
                validate();
                addtag(tags);
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
    const tagFunction = function () {
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
    };
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
            $(".public-notes-update-btn").click(function () {
                if ($(".note-title").hasClass("is-valid") && $(".note-descriptions").hasClass("is-valid")) {
                    var title = $(".note-title").val();
                    var description = $(".note-descriptions").val();
                    let tags = [];
                    $(".chip").each(function () {
                        let one = $(this).html().split(`<i class="fa fa-times-circle mx-1"> </i>`);
                        tags.push(one[0].trim());

                        // console.log($(this).html().split('<i class="fa fa-times-circle mx-1"> </i>'));
                    });
                    var newTags = tags.toString();

                    const data = JSON.stringify({
                        name: title,
                        tags: newTags,
                        description: description
                    });
                    // console.log(tags);
                    // return;
                    $.ajax({
                        type: "PUT",
                        url: sessionStorage.getItem('api') + "/products/" + public_notes_id,
                        headers: {
                            Authorization: localStorage.getItem("token")
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
                } else if (!$(".note-title").hasClass("is-valid")) {
                    $(".note-title").addClass("is-invalid")
                } else if (!$(".note-descriptions").hasClass("is-valid")) {
                    $(".note-descriptions").addClass("is-invalid");
                }
            });

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
});