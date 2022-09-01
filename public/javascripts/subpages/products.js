$(document).ready(function () {
    const api_url = getCookie("api_url");
    // sherron init
    Shareon.init();
    // like function
    function likeAndDislike() {
        var lastCount = 0;
        var action = "NEUTRAL";
        function reset() {
            $(".react-btn").each(function () {
                let init = $(this).attr("data-default");
                $(this).find(".react-count").html(init);
                // $(this).removeClass("active");
            });
        }


        $(".react-btn").each(function () {
            $(this).click(function () {
                const token = getCookie("token");
                reset();
                if (token !== undefined) {
                    const count = Number($(this).find(".react-count").html());
                    if ($(this).hasClass("active")) {
                        $(this).removeClass("active");
                        // action = 0;
                        // $(this).find(".react-count").html(count - 1);

                    } else {
                        $(".react-btn").removeClass("active");
                        $(this).addClass("active");
                        action = $(this).attr("data-action");
                        addReactionAction(action);
                        $(this).find(".react-count").html(count + 1);
                    }
                } else {
                    $(".user-not-login-modal").modal("show");
                }
            })
        });;

    }

    // like and dislike ajax
    function addReactionAction(action) {
        $.ajax({
            type: "POST",
            url: atob(getCookie("api")) + "/products/" + window.location.pathname.split("/").pop() + "/reacts/" + action,
            headers: {
                Authorization: getCookie("token")
            },
            success: function (data) {
                if (action == "LIKE") {
                    new Noty({
                        theme: "sunset",
                        type: "success",
                        text: "Liked",
                        timeout: 4000,
                    }).show();
                } else if (action == "DISLIKE") {
                    new Noty({
                        theme: "sunset",
                        type: "error",
                        text: "Disliked",
                        timeout: 4000,
                    }).show();
                }


            },
            error: function () {
                new Noty({
                    theme: "sunset",
                    type: "error",
                    text: "Somthing went wrong , please try after sometimes",
                    timeout: 4000,
                }).show();

            }

        });
    };

    function urlanys() {
        if (window.location.hash == "#comment") {
            $("#commentbox").toggle("show");
        }
        else if (window.location.hash == "#report") {
            $(".report-modal").modal("show");
        }
    }

    function toggler() {
        $(".share-btn").click(function () {
            $(".share-modal").modal("show");
        });
        $(".comment-btn").click(function () {

            window.location.hash = "comment";
            $("#commentbox").toggle("show");
        });
        $(".info-button").click(function () {
            $(".info-modal").modal("show");
        })
        $(".report-btn").click(function () {
            $(".report-modal").modal("show");
        });
    }
    // load comments
    function loadComments() {
        $.ajax({
            type: "GET",
            url: atob(getCookie("api")) + "/products/" + window.location.pathname.split("/").pop() + "/comments/" + 0,
            beforeSend: function () { },
            success: function (data) {
                $(".comment-length").html(data.size);
                $(".commentbox-container").html("");
                if (data.length !== 0) {
                    for (let i = 0; i < data.requested.length; i++) {
                        let content = data.requested[i].content;
                        let timestamp = data.requested[i].timestamp;
                        let firstName = data.requested[i].users.firstName;
                        let lastName = data.requested[i].users.lastName;
                        let uuid = data.requested[i].users.uuid;
                        let userprofileImage = data.requested[i].users.profileImage ? data.requested[i].users.profileImage : "/images/user.png";
                        if (userprofileImage.indexOf("https://s3.ap-south-1.amazonaws.com/profiles.notesocean.com") != -1) {
                            userprofileImage = userprofileImage.replace("https://s3.ap-south-1.amazonaws.com/profiles.notesocean.com", "https://profiles.ncdn.in");
                        }
                        $(".commentbox-container").append(`
                        <div class="d-flex my-2 commentbox-item  animate__animated animate__fadeInUp">
    <div class="flex-shrink-0"><a href="/profile/${uuid}"><img src="${userprofileImage}" alt="" style="width:35px;height:35px;border-radius:50%" /></a></div>
    <div class="flex-grow-1 ms-3">
        <small class="text-muted"> ${firstName} ${lastName} </small> <br> <small class="text-muted"> <i class="fa fa-clock mx-1"></i> <span> ${getTime(timestamp)}</span></small> <br> <span> ${content} </span>
    </div>
    </div>
                        `);
                    }
                }
            }

        });
    }

    // comments function
    function commentValidator() {
        if (getCookie("token") != undefined || getCookie("token") != null) {
            const viewerid = JSON.parse(atob(getCookie("token").split(".")[1])).userUuid;
            var userdata = localStorage.getItem("userInfo");
            if (userdata != null || userdata != undefined) {
                userdata = JSON.parse(userdata);
                showCommentBox(userdata);
            } else {
                $.ajax({
                    type: "GET",
                    url: atob(getCookie("api")) + "/users/self",
                    headers: {
                        Authorization: getCookie("token")
                    },
                    success: function (data) {
                        localStorage.setItem("userInfo", JSON.stringify(data));
                        showCommentBox(data);

                    }
                })
            }
            // load commnets
        } else {
            $(".user-not-login").removeClass("d-none");
            $(".commnet-form").addClass("d-none");
        }
    }

    function showCommentBox(userdata) {
        $(".user-not-login").addClass("d-none");
        $(".commnet-form").removeClass("d-none");
        const userFullName = userdata.firstName + " " + userdata.lastName;
        const userPic = userdata.profileImage;
        if (userPic != null || userPic != undefined) {
            $(".commentator-user-img").attr("src", userPic.replace("https://s3.ap-south-1.amazonaws.com/profiles.notesocean.com", "https://profiles.ncdn.in"));
        } else {
            $(".commentator-user-img").attr("src", "/images/dummy/user_dummy.jpg");
        }
    }

    const getTime = (previous) => {
        const current = Date.now();
        var msPerMinute = 60 * 1000;
        var msPerHour = msPerMinute * 60;
        var msPerDay = msPerHour * 24;
        var msPerMonth = msPerDay * 30;
        var msPerYear = msPerDay * 365;

        var elapsed = current - previous;

        if (elapsed < msPerMinute) {
            return "Now";
            // return Math.round(elapsed / 1000) + ' seconds ago';
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

    function addComments() {
        $(".commentbox-input").on("input", function () {

            if ($(this).val().length > 200) {
                $(this).css({ "border": "1px solid red" });
                $(".comment-error-notice").html("Comment should not be more than 200 characters");
                $(".comment-error-notice").addClass("text-danger");
            } else {
                $(this).css({ "border": "1px solid #ccc" });
                $(".comment-error-notice").html("");
                $(".comment-error-notice").removeClass("text-danger");
            }
        });
        // add comment when user hit enter buttons
        $(".commentbox-input").keyup(function (event) {
            if (event.keyCode === 13) {
                $(".comment-add-btn").click();
            }
        });
        //  add comment
        $(".comment-add-btn").click(function () {
            if ($(".commentbox-input").val().length < 200 && $(".commentbox-input").val().length !== 0) {
                $(".comment-error-notice").html("");
                $(".comment-error-notice").removeClass("text-danger");
                // COMMENT AJAX
                // get user details that set on localstorage
                const userdata = localStorage.getItem("userInfo");
                console.log(userdata);
                if (userdata !== null) {
                    var firstName = JSON.parse(userdata).firstName;
                    var lastName = JSON.parse(userdata).lastName;
                    var uuid = JSON.parse(userdata).uuid;
                    var profileImage = JSON.parse(userdata).profileImage;
                    if (profileImage != null || profileImage != undefined) {
                        profileImage = profileImage.replace("https://s3.ap-south-1.amazonaws.com/profiles.notesocean.com", "https://profiles.ncdn.in");
                    } else {
                        profileImage = "/images/dummy/user_dummy.jpg";
                    }
                } else {
                    return false;
                }
                $.ajax({
                    type: "POST",
                    url: atob(getCookie("api")) + "/products/" + window.location.pathname.split("/").pop() + "/comments",
                    processData: false,
                    contentType: "application/json",
                    data: JSON.stringify({
                        content: $(".commentbox-input").val().trim()
                    }),
                    headers: {
                        Authorization: getCookie("token")
                    }, beforeSend: function () {
                        $(".comment-add-btn").prop("disabled", true);
                        $(".comment-add-btn").html(`<i class="fa fa-spinner fa-spin">  </i>`);
                    },
                    success: function (data) {
                        $(".comment-length").html(Number($(".comment-length").html()) + 1);
                        $(".commentbox-input").val("");
                        $(".comment-add-btn").prop("disabled", false);
                        $(".comment-add-btn").html(`Comment`);
                        $(".commentbox-container").prepend(`
                        <div class="d-flex my-2 commentbox-item wow animate__animated animate__fadeInUp">
                            <div class="flex-shrink-0"><a href="/profile/${uuid}"><img src="${profileImage}" alt="${firstName} ${lastName}" style="width:35px;height:35px;border-radius:50%" /></a></div>
                            <div class="flex-grow-1 ms-3">
                                <small class="text-muted"> ${firstName} ${lastName} </small> <br> <span> ${data.content} </span><br /><small class="text-muted"> <i class="fa fa-clock mx-1"></i><span> ${getTime(data.timestamp)}</span></small>
                            </div>
                            </div>
                        `);
                    },
                    error: function (err) {
                        new Noty({
                            theme: "sunset",
                            type: "error",
                            text: "Somthing went wrong , please try after sometimes",
                            timeout: 4000,
                        }).show();
                    }
                })
            } else if ($(".commentbox-input").val().length > 200) {
                $(".comment-error-notice").html("Comment should not be more than 200 characters");
                $(".comment-error-notice").addClass("text-danger");
            } else if ($(".commentbox-input").val().length == 0) {
                $(".comment-error-notice").html("Comment should not empty!");
                $(".comment-error-notice").addClass("text-danger");
            }
        });
    }
    // add comments

    // showRelatedNotes();

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

    function report() {
        $(".report-form").submit(function (e) {
            e.preventDefault();
            let subject = $("input[name='subject']").val();
            let message = $("textarea[name='message']").val();
            let productId = window.location.pathname.split("/").pop();
            $.ajax({
                type: "POST",
                url: atob(getCookie("api")) + "/products/" + productId + "/reports",
                processData: false,
                contentType: "application/json",
                data: JSON.stringify({
                    subject: subject,
                    message: message
                }),
                headers: {
                    Authorization: getCookie("token")
                },
                beforeSend: function () {
                    $(".report-btn-modal").prop("disabled", true);
                    $(".report-btn-modal").html(`<i class="fa fa-spinner fa-spin">  </i> Please wait...`);
                },
                success: function (data) {
                    $(".report-modal .modal-content").html(`
                    <div class="d-flex justify-content-center align-items-center"><img class="report-success-animation" src="/images/animation/success-animation.gif"/></div>
                    <div class="text-center">
                      <h1>Reported Successfully</h1>
                      <p>Thank you for reporting this note. We will review this note and if necessary we will remove it.</p>
                      <button class="my-3 btn btn-notesocean" data-bs-dismiss='modal'> Close </button>
                    </div>
                    `);
                    $(".report-btn-modal").prop("disabled", false);
                    $(".report-btn-modal").html("Report");

                    new Noty({
                        theme: "sunset",
                        type: "success",
                        text: "Report sent successfully",
                        timeout: 4000,
                    }).show();
                    $(".report-form").trigger("reset");
                },
                error: function (err) {
                    new Noty({
                        theme: "sunset",
                        type: "error",
                        text: "Somthing went wrong , please try after sometimes",
                        timeout: 4000,
                    }).show();
                    $(".report-btn-modal").prop("disabled", false);
                    $(".report-btn-modal").html("Report");
                }
            })
        })
    };
    likeAndDislike();
    urlanys();
    toggler();
    commentValidator();
    addComments();
    report();
    loadComments();
});

