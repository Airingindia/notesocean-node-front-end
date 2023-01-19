$(document).ready(function () {
    // get uploaded products

    function getUploadedProducts() {
        let requestUuid = window.location.pathname.split("/request/")[1];
        $.ajax({
            type: 'GET',
            url: app.getApi() + "/requests/" + requestUuid + "/products",
            headers: {
                Authorization: getCookie("token"),
            },
            contentType: "application/json",
            processData: false,
            beforeSend: function () {

            },
            success: function (data) {
                if (data == undefined) {
                    return false;
                }
                if (data.requested.length > 0) {
                    $(".uploaded-notes-row").html("");
                    for (let i = 0; i < data.requested.length; i++) {
                        let name = data.requested[i].name;
                        let description = data.requested[i].description;
                        let thumbnails = data.requested[i].thumbnails.replace("https://thumbnails.ncdn.in", "https://thumbnails.ncdn.in/fit-in/400x400/filters:format(webp)/filters:quality(100)/40x0:500x500/");
                        let timestamp = getTime(data.requested[i].timestamp);
                        let views = data.requested[i].views;
                        let likes = data.requested[i].likes;
                        let pages = data.requested[i].pages;
                        let firstName = data.requested[i].users.firstName;
                        let lastName = data.requested[i].users.lastName;
                        let userUUid = data.requested[i].users.uuid;
                        let uuid = data.requested[i].uuid;
                        let userPrfileImage = data.requested[i].users.profileImage;
                        if (userPrfileImage == null) {
                            userPrfileImage = "/images/dummy/user_dummy.jpg";
                        }
                        $(".uploaded-notes-row").append(`
                    <a href="/notes/${uuid}">
                    <div class="shadow p-2 mb-2 bg-white rounded uploaded-notes-item">
                      <img class="notes-thumb" src="${thumbnails}"/>
                      <div class=" uploaded-notes-item-info">
                        <h6> ${name}</h6>
                        <p> ${description}</p><a class="btn btn-sm" href="/profile/${userUUid}"><img class="user-img" src="${userPrfileImage}"/><span class="mx-1"> sachin kmumar  </span></a>
                        <div class="d-flex align-items-center uploaded-notes-info"><small><i class="fa fa-clock mr-1"></i><span>${timestamp} </span></small><small><i class="fa fa-file mr-1"></i><span> ${pages} </span></small><small><i class="fa fa-globe mr-1"></i><span> ${views}views</span></small><small><i class="fa fa-thumbs-up mr-1"></i><small>${likes} likes </small></small></div>
                      </div>
                      <button class="btn btn-dark accept-btn btn-sm" data-uuid="${uuid}" style="height:max-content">Accept</button>
                    </div>
                    </a>
                    `);
                    }
                    acceptProduct();
                }
            },
            error: function (err) {
                app.alert(err.status, err?.responseJSON?.message ? err?.responseJSON?.message : "Something went wrong");
            }
        });
    }


    if ($(".uploaded-notes-row").hasClass("uploaded-notes-row")) {
        getUploadedProducts();
    }



    // getUploadedProducts();
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    function acceptProduct() {
        $(".accept-btn").each(function () {
            $(this).click(function () {
                var btn = this;
                let uuid = $(this).attr("data-uuid");
                let requestUuid = window.location.pathname.split("/request/")[1];
                console.log(requestUuid);
                $.ajax({
                    type: 'POST',
                    url: app.getApi() + "/requests/" + requestUuid + "/products/" + uuid,
                    beforeSend: function () {
                        $(btn).html("<i class='fa fa-spinner fa-spin'></i> Accepting ...");
                    },
                    headers: {
                        Authorization: getCookie("token"),
                    },
                    contentType: "application/json",
                    processData: false,
                    success: function (data) {
                        new Noty({
                            type: 'success',
                            text: 'Note Accepted!',
                            timeout: 2000
                        });
                        $(btn).removeClass("btn-dark");
                        $(btn).addClass("btn-success");
                        $(btn).html("Accepted");
                        setTimeout(() => {
                            window.location.href = window.location.href;
                        }, 2000);
                    },
                    error: function (error) {
                        app.alert(err.status, err?.responseJSON?.message ? err?.responseJSON?.message : "Something went wrong");
                    }
                });
            })
        })
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

});

