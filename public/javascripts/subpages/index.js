$(document).ready(function () {
    var access = 1;
    var last_access = 0;
    function scrollFunction() {
        // var scroll_height = Number($(".footer").height()) + Number($(window).height()) + 150;
        $(window).scroll(function () {
            // console.log($(".public-notes-item").last().attr("data-id"));
            let visibility = $(".public-notes-item").last().css("visibility");
            if (visibility !== "hidden") {
                loadFeed(access);
            }
        });
    }
    scrollFunction();

    function loadFeed(page) {
        if (last_access !== page) {
            last_access = page;
            $.ajax({
                type: "GET",
                url: sessionStorage.getItem("api") + "/products/feeds/" + page,
                headers: {
                    Authorization: localStorage.getItem("token")
                },
                beforeSend: function () { },
                success: function (data) {
                    // console.log(data);
                    if (data.requested.length !== 0) {
                        access++;
                        for (let i = 0; i < data.requested.length; i++) {
                            let name = data.requested[i].product.name;
                            if (name.length > 80) {
                                name = name.substring(0, 100);
                            }
                            let thumbnails = data.requested[i].product.thumbnails.split(",")[0];
                            let views = data.requested[i].product.views + " views";
                            let id = data.requested[i].product.id;
                            let timestamp = data.requested[i].product.timestamp;
                            let pages = data.requested[i].product.pages + " Pages";
                            let actual_time = getTime(timestamp);
                            let seoUrl = makeUrl(name);
                            // user details 
                            let Full_name = data.requested[i].user.firstName + " " + data.requested[i].user.lastName
                            let user_id = data.requested[i].user.id;
                            let profilePic = data.requested[i].user.profileImage;
                            var pic;
                            if (profilePic !== null) {
                                pic = profilePic.split(",")[0];
                            } else {
                                pic = "/images/user.jfif";
                            }
                            $(".public-now-row").append(`
                        <div class="col-md-3 my-2">
                            <a href="/notes/${id}"> 
                                    <div class="card shadow border-0 rounded h-100 wow animate__animated animate__fadeInUp public-notes-item" data-id="${id}">
                                        <div class="card-header border-0 bg-white">
                                            <p class="card-title"> ${name} </p>
                                        </div>
                                    <div class="card-body border-0 notes-thumbnails" style="background-image:url(${thumbnails});background-size:cover"></div>
                                    <div class="card-footer border-0 bg-white">
                                        <div class="row">
                                            <div class="col-12 dflex justify-content-center">
                                            <a href="/profile/${user_id}"> 
                                            <img class="user-image" src="${pic}" alt="user image" alt="${Full_name}"/>
                                            </a>
                                            <span class="card-text">
                                            <a class="mx-2 user-name-text" href="/profile/${user_id}"> ${Full_name}  </a>
                                            </span></div>
                                            <div class="col-12">
                                                <p class="card-text notes-details-text">
                                                    <span>
                                                        <i class="fa fa-globe mx-1"></i>
                                                        <small> ${views} </small>
                                                    </span>
                                                    <span class="mx-1">
                                                        <i class="fa fa-file mx-1"> </i>
                                                        <small>  ${pages} </small>
                                                        </span>
                                                    <span class="mx-1">
                                                        <i class="fa fa-clock-o mx-1"></i>
                                                        <small> ${actual_time} </small>
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                    </div>
                        `);
                        }
                    } else {
                        last_access = access;
                    }
                }
            });
        }

    };
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
    function makeUrl(url) {
        return url.toString()               // Convert to string
            .normalize('NFD')               // Change diacritics
            .replace(/[\u0300-\u036f]/g, '') // Remove illegal characters
            .replace(/\s+/g, '-')            // Change whitespace to dashes
            .toLowerCase()                  // Change to lowercase
            .replace(/&/g, '-and-')          // Replace ampersand
            .replace(/[^a-z0-9\-]/g, '')     // Remove anything that is 
            .replace(/-+/g, '-')             // Remove duplicate dashes
            .replace(/^-*/, '')              // Remove starting dashes
            .replace(/-*$/, '');             // Remove trailing dashes
    }
});