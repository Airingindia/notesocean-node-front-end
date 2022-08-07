$(document).ready(function () {
    // get uploaded products

    function getUploadedProducts() {
        let requestUuid = window.location.pathname.split("/request/")[1];
        $.ajax({
            type: 'GET',
            url: atob(decodeURIComponent(getCookie("api"))) + "/requests/" + requestUuid + "/products",
            headers: {
                Authorization: getCookie("token"),
            },
            contentType: "application/json",
            processData: false,
            beforeSend: function () {
                console.log("sent");
            },
            success: function (data) {
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
                      <div><img class="notes-thumb" src="${thumbnails}"/></div>
                      <div class="px-1">
                        <h6> ${name}</h6>
                        <p> ${description}</p><a class="btn" href="/profile/${userUUid}"><img class="user-img" src="${userPrfileImage}"/><span class="mx-1"> sachin kmumar  </span></a>
                        <div class="d-flex align-items-center uploaded-notes-info"><small><i class="fa fa-clock mr-1"></i><span>${timestamp} </span></small><small><i class="fa fa-file mr-1"></i><span> ${pages} </span></small><small><i class="fa fa-globe mr-1"></i><span> ${views}views</span></small><small><i class="fa fa-thumbs-up mr-1"></i><small>${likes} likes </small></small></div>
                      </div>
                      <button class="btn btn-danger accept-btn" data-uuid="${uuid}" style="height:max-content">Accept</button>
                    </div></a>
                    `);
                    }
                    acceptProduct();
                }
            },
            error: function (error) {
                console.log("error", error);
            }
        });
    }

    getUploadedProducts();
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    function acceptProduct() {
        $(".accept-btn").each(function () {
            $(this).click(function () {
                let uuid = $(this).attr("data-uuid");
                swal({
                    title: "Are you sure?",
                    text: "Once accepted, you will not be able to accept another notes ",
                    icon: "info",
                    buttons: ["Cancel", "Accept"],
                    dangerMode: true,
                })
                    .then((willDelete) => {
                        if (willDelete) {
                            $.ajax({
                                type: "GET",
                                url: atob(decodeURIComponent(getCookie("api"))) + "/"
                            })
                        }
                    })
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

