$(document).ready(function () {
    const api_url = $("body").attr("data-api");
    // sherron init
    Shareon.init();
    // amplitude
    if (localStorage.getItem("token") !== null) {
        const viewerid = JSON.parse(atob(localStorage.getItem("token").split(".")[1])).userId;
        amplitude.getInstance().logEvent("product view", {
            product_id: document.querySelector("body").getAttribute("data-product-id"),
            userid: viewerid
        });
    } else {
        amplitude.getInstance().logEvent("product view", {
            product_id: document.querySelector("body").getAttribute("data-product-id"),
        });
    }

    // share btn

    $(".share-btn").click(function () {
        $(".share-modal").modal("show");
    });
    // like function
    function likeAndDislike() {
        var lastCount = 0;
        var action = 0;
        $(".react-btn").each(function () {
            $(this).click(function () {
                const token = localStorage.getItem("token");
                if (token !== null) {
                    const count = Number($(this).find(".react-count").html());
                    if ($(this).hasClass("active")) {
                        $(this).removeClass("active");
                        action = 0;
                    } else {
                        $(".react-btn").removeClass("active");
                        $(this).addClass("active");
                        action = Number($(this).attr("data-action"));
                        addReactionAction(action);
                    }
                } else {
                    $(".user-not-login-modal").modal("show");
                }
            })
        })
    }
    likeAndDislike();
    // like and dislike ajax
    function addReactionAction(action) {
        $.ajax({
            type: "POST",
            url: localStorage.getItem("api") + "/products/" + document.querySelector("body").getAttribute("data-product-id") + "/reacts/" + action,
            headers: {
                Authorization: localStorage.getItem("token")
            },
            success: function (data) {
                if (action == 1) {
                    new Noty({
                        theme: "sunset",
                        type: "success",
                        text: "Liked Added",
                        timeout: 4000,
                    }).show();
                    const viewerid = JSON.parse(atob(localStorage.getItem("token").split(".")[1])).userId;
                    amplitude.getInstance().logEvent("product liked", {
                        product_id: document.querySelector("body").getAttribute("data-product-id"),
                        userid: viewerid
                    });
                } else {
                    new Noty({
                        theme: "sunset",
                        type: "error",
                        text: "Disliked Added",
                        timeout: 4000,
                    }).show();
                    const viewerid = JSON.parse(atob(localStorage.getItem("token").split(".")[1])).userId;
                    amplitude.getInstance().logEvent("product disliked", {
                        product_id: document.querySelector("body").getAttribute("data-product-id"),
                        userid: viewerid
                    });
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
    //  comment toggle
    $(".comment-btn").click(function () {
        $("#commentbox").toggle("show");
    });
    // load comments

    $.ajax({
        type: "GET",
        url: api_url + "/products/" + document.querySelector("body").getAttribute("data-product-id") + "/comments/" + 0,
        beforeSend: function () { },
        success: function (data) {
            $(".comment-length").html(data.length);
            $(".commentbox-container").html("");
            if (data.length !== 0) {

                for (let i = 0; i < data.length; i++) {
                    let content = data[i].content;
                    let timestamp = data[i].timestamp;
                    let userid = data[i].userid;
                    $(".commentbox-container").append(`
                    <div class="d-flex my-2 commentbox-item wow animate__animated animate__fadeInUp">
<div class="flex-shrink-0"><a href="/"><img src="/images/dummy-user.jpeg" alt="..." style="width:35px;height:35px;border-radius:50%" /></a></div>
<div class="flex-grow-1 ms-3">
    <h6>Sachin kumar</h6><span> ${content} </span><br /><small class="text-muted"> <i class="fa fa-clock-o mx-1"></i><span> ${getTime(timestamp)}</span></small>
</div>
</div>
                    `);
                }
            }
        }

    });


    // comments function
    if (localStorage.getItem("token") !== null) {

        const viewerid = JSON.parse(atob(localStorage.getItem("token").split(".")[1])).userId;
        var userdata = localStorage.getItem("userdata");
        if (userdata !== null) {
            userdata = JSON.parse(userdata);
            showCommentBox(userdata);
        } else {
            $.ajax({
                type: "GET",
                url: localStorage.getItem("api") + "/users/" + viewerid,
                success: function (data) {
                    showCommentBox(data);
                    localStorage.setItem("userdata", JSON.stringify(data));
                }
            })
        }
        // load commnets


    } else {
        $(".user-not-login").removeClass("d-none");
        $(".commnet-form").addClass("d-none");
    }
    function showCommentBox(userdata) {
        $(".user-not-login").addClass("d-none");
        $(".commnet-form").removeClass("d-none");
        const userFullName = userdata.firstName + " " + userdata.lastName;
        const userPic = userdata.profileImage;
        $(".commentator-user-img").attr("src", userPic);
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

    // add comments
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
            $.ajax({
                type: "POST",
                url: localStorage.getItem("api") + "/products/" + document.querySelector("body").getAttribute("data-product-id") + "/comments",
                processData: false,
                contentType: "application/json",
                data: JSON.stringify({
                    content: $(".commentbox-input").val().trim()
                }),
                headers: {
                    Authorization: localStorage.getItem("token")
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
                        <div class="flex-shrink-0"><a href="/"><img src="/images/dummy-user.jpeg" alt="..." style="width:35px;height:35px;border-radius:50%" /></a></div>
                        <div class="flex-grow-1 ms-3">
                            <h6>Sachin kumar</h6><span> ${data.content} </span><br /><small class="text-muted"> <i class="fa fa-clock-o mx-1"></i><span> ${getTime(data.timestamp)}</span></small>
                        </div>
                        </div>
                    `);
                },
                error: function (err) {
                    $(".notice-box").html(` <div id="liveToast" class="toast fade show border-0" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header bg-danger text-light">
                        <strong class="me-auto"> <i  class="fa fa-info-circle text-white mx-1"> </i> Oops! </strong>
                    </div>
                    <div class="toast-body">
                    somthing went wrong , please try after sometimes or relogin  you account
                    </div>
                </div>`);
                    setTimeout(() => {
                        $(".notice-box").html("");
                    }, 5000);
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

    // report
    $(".report-btn").click(function () {
        $(".report-modal").modal("show");
    });


    //  socket io
    const socket = io();
    const udata = JSON.parse(localStorage.getItem("userdata"));

    const productData = JSON.parse($("body").attr("data-product"));

    if (localStorage.getItem("userdata") !== null) {

        var data = {
            firstName: udata.firstName,
            lastName: udata.lastName,
            userid: udata.id,
            pic: udata.profileImage,
            product: {
                name: productData.product.name,
                thumbnail: productData.product.thumbnails,
                product_id: productData.product.id,
                timestamp: getTime(productData.product.timestamp),
                views: productData.product.views,
                pages: productData.product.pages,
                user: {
                    firstName: productData.users.firstName,
                    lastName: productData.users.lastName,
                    userId: productData.users.id,
                    profileImage: productData.users.profileImage

                }
            }

        }
        socket.emit("join", {
            noteId: document.querySelector("body").getAttribute("data-product-id"),
            userdata: data
        });
    } else {
        var data = {
            firstName: "Guest",
            lastName: "",
            userid: 0,
            pic: "/images/dummy/user_dummy.jpg"
        }
        socket.emit("join", {
            noteId: document.querySelector("body").getAttribute("data-product-id"),
            userdata: data
        });
    }


    socket.on("joined", user => {
        console.log("joined", user);
    });

    socket.on("left", user => {
        console.log("left", user);
    });

    socket.on("liveusers", users => {
        $(".live-users-container").html("");
        $('.live-reading').html(`You are reading with ${users.length} people`);
        for (let i = 0; i < users.length; i++) {
            let pic = users[i].pic;
            let userid = users[i].userid;
            let firstName = users[i].firstName;
            let lastName = users[i].lastName;
            if (localStorage.getItem("userdata") !== null) {
                if (userid == udata.id) {
                    $(".live-users-container").append(`
                    <a class="mx-1 my-1 px-1 my-2" href="/profile/${userid}"><img src="${pic}" alt="${firstName} ${lastName}"  class="my-2" style="width:30px;height:30px;border-radius:50%" /> </a>
                    `);
                } else {

                    $(".live-users-container").append(`
                    <a class="mx-1 px-1 my-2" href="/profile/${userid}"><img src="${pic}" alt="${firstName} ${lastName}"  class="my-2" style="width:30px;height:30px;border-radius:50%" />  </a>
                    `);
                }
            } else {
                $(".live-users-container").append(`
                <a class="mx-1 px-1 my-2" href="/profile/${userid}"><img src="${pic}" alt="${firstName} ${lastName}"  class="my-2" style="width:30px;height:30px;border-radius:50%" />  </a>
                `);
            }


        }
    });


    //  realted notes

    function showRelatedNotes() {
        $.ajax({
            type: "GET",
            url: localStorage.getItem("api") + "/related/notes",
            beforeSend: function () { },
            success: function (data) {
                console.log(data);
            }
        })
    }
    // showRelatedNotes();
});

