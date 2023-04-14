$(document).ready(function () {

    // sherron init
    Shareon.init();
    // like function
    function likeAndDislike() {
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
                const token = app.getToken()
                reset();
                if (token !== undefined) {
                    const count = Number($(this).find(".react-count").html());
                    if ($   (".react-btn").hasClass("active")) {
                        var iframeContainer = $(".react-btn");
                        $('#iframe2').remove();
                        var newIframe = $('<i>', {
                            id: 'iframe1',
                            
                        });
                        newIframe.addClass('fa-regular fa-heart');
                        iframeContainer.append(newIframe);
                         // $(this).removeClass("active");
                        $(".react-btn").removeClass('active')
                        addReactionAction("NEUTRAL");
                    } else {
                        var iframeContainer = $(".react-btn")
                        $('#iframe1').remove();
                        var newIframe = $('<i>', {
                            id: 'iframe2',
                            
                        });
                        newIframe.addClass('fa-solid fa-heart');
                        iframeContainer.append(newIframe);
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
            url: app.getApi() + "/products/" + window.location.pathname.split("/").pop() + "/like",
            headers: {
                Authorization: app.getToken()
            },
            success: function (data) {

                // if (action == "LIKE") {
                //     new Noty({
                //         theme: "sunset",
                //         type: "success",
                //         text: "Liked",
                //         timeout: 4000,
                //     }).show();
                // } else if (action == "DISLIKE") {
                //     new Noty({
                //         theme: "sunset",
                //         type: "error",
                //         text: "Disliked",
                //         timeout: 4000,
                //     }).show();
                // }
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





    function toggler() {
        // $("#commentbox").toggle("show");
        $(".share-btn").click(function () {
            $(".share-modal").modal("show");
        });
        $(".info-button").click(function () {
            $(".info-modal").modal("show");
        })
        $(".report-btn").click(function () {
            $(".report-modal").modal("show");
        });


    }
    // load comments
    function loadComments(page) {
        $.ajax({
            type: "GET",
            url: app.getApi() + "/products/" + window.location.pathname.split("/").pop() + "/comments",
            beforeSend: function () { },
            data:{
                "page":page
            } ,
            success: function (data) {
                $(".comment-length").html(data.size);
                // $(".cmt-box").html("");
                if (data.length !== 0) {
                    for (let i = 0; i < data.content.length; i++) {
                        let content = data.content[i].content;
                        let timestamp = data.content[i].timestamp;
                        let firstName = data.content[i].users.firstName;
                        let lastName = data.content[i].users.lastName;
                        let uuid = data.content[i].users.uuid;
                        let userprofileImage = data.content[i].users.profileImage ? data.content[i].users.profileImage : "/images/user.png";
                        if (userprofileImage.indexOf("https://s3.ap-south-1.amazonaws.com/profiles.notesocean.com") != -1) {
                            userprofileImage = userprofileImage.replace("https://s3.ap-south-1.amazonaws.com/profiles.notesocean.com", "https://profiles.ncdn.in");
                        }
                        $(".cmt-box").append(
                            `<div class="notes-product-comments-container">

                                <div class="notes-product-comments-user-profile-image">
                                    <img class='notes-product-comments-user-image' src="${userprofileImage}" alt="" >
                                </div>

                                <div class="notes-product-comments-info-container">

                                    <div class='notes-product-comments-user-profile-details'>

                                        <div class='notes-product-comments-user-profile notes-stats name'>
                                            ${firstName} ${lastName}
                                        </div>

                                        <div class='notes-product-comments-user-profile notes-stats dot'>
                                            &#x2022
                                        </div>

                                        <div class='notes-product-comments-user-profile notes-stats timeline'>
                                            ${getTime(timestamp)}
                                        </div>

                                    </div>

                                    <div class='notes-product-comments-on-post'>
                                        ${content}
                                    </div>
                                    </div>
                                </div>
                            `
                            );
                    }
                }

                if(data.last==true){
                    $(".more-comments-api").css("display","none");

                    console.log("check171",data)
                }
            },
            error: function (err) {
                app.alert(err.status, err?.responseJSON?.message ? err?.responseJSON?.message : "Something went wrong");
            }

        });
    }
``
    // comments function
    function commentValidator() {
        if (app.getToken() != undefined || app.getToken() != null) {
            var userdata = localStorage.getItem("userInfo");
            if (userdata != null || userdata != undefined) {
                userdata = JSON.parse(userdata);
                showCommentBox(userdata);
            } else {
                $.ajax({
                    type: "GET",
                    url: app.getApi() + "/users/self",
                    headers: {
                        Authorization: app.getToken()
                    },
                    success: function (data) {
                        localStorage.setItem("userInfo", JSON.stringify(data));
                        showCommentBox(data);

                    },
                    error: function (err) {
                        app.alert(err.status, err?.responseJSON?.message ? err?.responseJSON?.message : "Something went wrong");
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
            
            if (event.keyCode === 13 ) {
                $(".comment-add-btn").click();
            }
        });
        //  add comment
        
        $(".notes-product-comments-count").click(function () {
            let token = app.getToken();
            console.log('line 289',token)
            if(token==undefined || token==null){

                $(".user-not-login-modal").modal("show");
                return;
            }

            

            if ($(".commentbox-input").val().length < 200 && $(".commentbox-input").val().length !== 0) {
                $(".comment-error-notice").html("");
                $(".comment-error-notice").removeClass("text-danger");
                // COMMENT AJAX
                // get user details that set on localstorage
                const userdata = localStorage.getItem("userInfo");
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
                    $(".user-not-login-modal").modal("show");

                    // app.alert(400, "somthing went wrong , please try after sometimes");
                    return false;
                }
                let token = app.getToken();
                console.log("line312",token)
                if(token != undefined || token !== null){

                    $.ajax({
                        type: "POST",
                        url: app.getApi() + "/products/" + window.location.pathname.split("/").pop() + "/comments",
                        processData: false,
                        contentType: "application/json",
                        data: JSON.stringify({
                            content: $(".commentbox-input").val().trim()
                        }),
                        headers: {
                            Authorization: app.getToken()
                        }, beforeSend: function () {
                            $(".comment-add-btn").prop("disabled", true);
                            $(".comment-add-btn").html(`<i class="fa fa-spinner fa-spin">  </i>`);
                        },
                        success: function (data) {
                            console.log("line321",data);
                            $(".comment-length").html(Number($(".comment-length").html()) + 1);
                            $(".commentbox-input").val("");
                            $(".comment-add-btn").prop("disabled", false);
                            $(".comment-add-btn").html(`
                                <i class='fa-light fa-plus'></i>
                            `);
                            $(".cmt-box").prepend(`
    
                            <div class="notes-product-comments-container">
    
                                    <div class="notes-product-comments-user-profile-image">
                                        <img class='notes-product-comments-user-image' src="${profileImage}" alt="" >
                                    </div>
    
                                    <div class="notes-product-comments-info-container">
    
                                        <div class='notes-product-comments-user-profile-details'>
    
                                            <div class='notes-product-comments-user-profile notes-stats name'>
                                                ${firstName} ${lastName}
                                            </div>
    
                                            <div class='notes-product-comments-user-profile notes-stats dot'>
                                                &#x2022
                                            </div>
    
                                            <div class='notes-product-comments-user-profile notes-stats timeline'>
                                            ${getTime(data.timestamp)}
                                            </div>
    
                                        </div>
    
                                        <div class='notes-product-comments-on-post'>
                                            ${data.content}
                                        </div>
                                        </div>
                                    </div>
                           
                            `);
                        },
                        error: function (err) {
                            app.alert(err.status, err?.responseJSON?.message ? err?.responseJSON?.message : "Something went wrong");
                        }
                    })
                }
            } else if ($(".commentbox-input").val().length > 200) {
                $(".comment-error-notice").html("Comment should not be more than 200 characters");
                $(".comment-error-notice").addClass("text-danger");
            } else if ($(".commentbox-input").val().length == 0) {
                $(".comment-error-notice").html("Comment should not empty!");
                $(".comment-error-notice").addClass("text-danger");
            }
        });
    }

    $(".comment-btn").click(function () {
        $("#commentbox").slideToggle();
    })

    $(".product-title").click(function () {
        $(".prod-desc").slideToggle("show");
    })
    // add comments

    // showRelatedNotes();

    function report() {
        $(".report-form").submit(function (e) {
            e.preventDefault();
            let subject = $("input[name='subject']").val();
            let message = $("textarea[name='message']").val();
            let productId = window.location.pathname.split("/").pop();
            $.ajax({
                type: "POST",
                url: app.getApi() + "/products/" + productId + "/reports",
                processData: false,
                contentType: "application/json",
                data: JSON.stringify({
                    subject: subject,
                    message: message
                }),
                headers: {
                    Authorization: app.getToken()
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
                    app.alert(err.status, err?.responseJSON?.message ? err?.responseJSON?.message : "Something went wrong");
                    $(".report-btn-modal").prop("disabled", false);
                    $(".report-btn-modal").html("Report");
                }
            })
        })
    }

    function addBookmark(action) {
        $.ajax({
            type: "POST",
            url: app.getApi() + "/products/" + window.location.pathname.split("/").pop() + "/bookmark",
            headers: {
                Authorization: app.getToken()
            },
            success: function (data) {
                console.log('line443',action)
                if (action == "bookmark") {
                    new Noty({
                        theme: "sunset",
                        type: "success",
                        text: "Notes Saved",
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

    function bookmark(){
        $(".bookmark-btn").each(function () {
            $(this).click(function () {
                const token = app.getToken()
                console.log("line21",this)
                // reset();
                if (token !== undefined) {
                    // const count = Number($(this).find(".react-count").html());
                    // console.log("line24",count)
                    if ($(".bookmark-btn").hasClass("active")) {
                        var iframeContainer = $(".bookmark-btn");
                        $('#bookmark2').remove();
                        var newIframe = $('<i>', {
                            id: 'bookmark1',
                            
                        });
                        newIframe.addClass('fa-sharp fa-regular fa-bookmark');

                        iframeContainer.append(newIframe);
                         // $(this).removeClass("active");
                        $(".bookmark-btn").removeClass('active')
                        // productId = $(this).attr("data-action");
                        addBookmark('unbookmark');
                    } else {
                        var iframeContainer = $(".bookmark-btn");
                        $('#bookmark1').remove();
                        var newIframe = $('<i>', {
                            id: 'bookmark2',
                            
                        });
                        newIframe.addClass('fa-sharp fa-solid fa-bookmark');

                        iframeContainer.append(newIframe);
                        $(".bookmark-btn").removeClass("active");
                        $(this).addClass("active");
                        action = $(this).attr("data-action");
                        addBookmark(action);
                        // $(this).find(".react-count").html(count + 1);
                    }
                } else {
                    $(".user-not-login-modal").modal("show");
                }
            })
        });;
    }

    var count = 0;
    $('#increment-btn').on('click', function() {
        count++; // increment count
        loadComments(count)
    });

    $('.comments-icon').click(function() {
        $(".commentbox-input").focus();
    });

   

    likeAndDislike();
    toggler();
    commentValidator();
    addComments();
    report();
    loadComments(count);
    bookmark();
});

$(document).ready(function() {
    // Click event using event delegation
    $(document).on("click", ".three-dots", function() {
      // Toggle the display of the options list
    //   console.log('line563',$(this).siblings(".options-list").toggle())
      $(".options-list").toggle();
    });
  
    // Click event on the document to hide the options list when clicking outside of it
    $(document).on("click", function(e) {
      if (!$(e.target).closest(".options-container").length) {
        $(".options-list").hide();
      }
    });
  });
  