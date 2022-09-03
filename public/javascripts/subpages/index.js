$(document).ready(function () {
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


    function mostViewed() {
        let hit = false;
        let count = 0;
        $(window).scroll(function (event) {
            let visibility = $(".most-viewd-notes").css("visibility");
            if (!hit) {
                if (visibility !== "hidden") {
                    hit = true;
                    $.ajax({
                        type: "GET",
                        url: atob(getCookie("api")) + "/products/top-performing-products",
                        beforeSend: function () { },
                        success: function (data) {
                            $(".most-viewd-notes .row").html("");
                            if (data.size == 0) {
                                $("section.most-viewd-notes").addClass("d-none");
                            } else {

                                for (let i = 0; i < data.requested.length; i++) {
                                    let product_id = data.requested[i].uuid;
                                    let name = data.requested[i].name;
                                    let pages = data.requested[i].pages;
                                    let thumbnails = data.requested[i].thumbnails;
                                    let views = data.requested[i].views;
                                    let timestamp = getTime(data.requested[i].timestamp);
                                    let content = `<div class="col-lg-4 col-sm-6 mt-3"><a href="/notes/${product_id}">
                                <div class="card shadow border-0 h-100">
                                    <div class="card-header">  ${name}</div>
                                    <div class="card-body p-0"><img class="card-img-top" src="${thumbnails.split(",")[0].replace("https://thumbnails.ncdn.in", "https://thumbnails.ncdn.in/fit-in/720x250/filters:format(webp)/filters:quality(100)")}" /></div>
                                    <div class="card-footer">
                                        <div class="notes-cont-info d-flex justify-content-between text-muted mt-2"><small><i class="fa fa-globe"> </i><span> ${views} Views</span></small><small><i class="fa fa-file"> </i><span> ${pages} pages </span></small><small><i class="fa fa-clock"></i><span> ${timestamp} </span></small></div>
                                    </div>
                                </div>
                            </a></div>`;

                                    if (count < 6) {
                                        count++;
                                        $(".most-viewd-notes .row").append(content);
                                    }
                                }

                            }
                        },
                        error: function () {
                            $(".most-viewd-notes .row").html("");
                            $("section.most-viewd-notes").addClass("d-none");

                        }
                    })
                }
            }
        })
    };

    function recentNotes() {
        let hit = false;
        let count = 0;
        $(window).scroll(function (event) {
            let visibility = $(".recent-notes").css("visibility");
            if (!hit) {
                if (visibility !== "hidden") {
                    hit = true;
                    $.ajax({
                        type: "GET",
                        url: atob(getCookie("api")) + "/products/feeds/0",
                        beforeSend: function () { },
                        success: function (data) {
                            $(".recent-notes .row").html("");
                            if (data.requested.length <= 0) {
                                $(".section.recent-notes").removeClass("d-none");
                            } else {
                                for (let i = 0; i < data.requested.length; i++) {
                                    let product_id = data.requested[i].uuid;
                                    let name = data.requested[i].name;
                                    let pages = data.requested[i].pages;
                                    let thumbnails = data.requested[i].thumbnails;
                                    let views = data.requested[i].views;
                                    let timestamp = getTime(data.requested[i].timestamp);
                                    let mainthumbail = thumbnails.split(",")[0].replace("https://thumbnails.ncdn.in", "https://thumbnails.ncdn.in/fit-in/720x250/filters:format(webp)/filters:quality(100)");
                                    var img1 = thumbnails.split(",")[0].replace("https://thumbnails.ncdn.in", "https://thumbnails.ncdn.in/fit-in/320x240/filters:format(webp)/filters:quality(100)");

                                    var img2 = thumbnails.split(",")[0].replace("https://thumbnails.ncdn.in", "https://thumbnails.ncdn.in/fit-in/480x360/filters:format(webp)/filters:quality(100)");

                                    var img3 = thumbnails.split(",")[0].replace("https://thumbnails.ncdn.in", "https://thumbnails.ncdn.in/fit-in/800x480/filters:format(webp)/filters:quality(100)");


                                    let content = `<div class="col-lg-4 col-sm-6 mt-3"><a href="/notes/${product_id}">
                                <div class="card shadow border-0 h-100">
                                    <div class="card-header">  ${name}</div>
                                    <div class="card-body p-0"><img class="card-img-top lozad" loading="lazy"  src="${mainthumbail}"  srcset="${img1} 320w,${img2} 480w,${img3} 800w",sizes="(max-width: 320px) 280px,(max-width: 480px) 440px,800px" /></div>
                                    <div class="card-footer">
                                        <div class="notes-cont-info d-flex justify-content-between text-muted mt-2"><small><i class="fa fa-globe"> </i><span> ${views} Views</span></small><small><i class="fa fa-file"> </i><span> ${pages} pages </span></small><small><i class="fa fa-clock"></i><span> ${timestamp} </span></small></div>
                                    </div>
                                </div>
                            </a></div>`;

                                    if (count < 6) {
                                        count++;
                                        $(".recent-notes .row").append(content);
                                    }
                                }
                            }
                        },
                        error: function () {
                            $(".recent-notes .row").html("");
                            $(".section.recent-notes").addClass("d-none");
                        }
                    })
                }
            }
        })
    }

    recentNotes();

    mostViewed();
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    // show ads 

    function showAds() {
        // .card.shadow (adsbygoogle = window.adsbygoogle || []).push({});
        $("ins.adsbygoogle").each(function () {
            (adsbygoogle = window.adsbygoogle || []).push({});
        });
    }


    showAds();
});