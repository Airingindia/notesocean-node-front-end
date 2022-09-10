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

    $.ajax({
        type: "GET",
        url: app.getApi() + "/products/top-performing-products",
        beforeSend: function () { },
        success: function (data) {
            $(".most-viewd-notes .row").html("");
            if (data.size == 0) {
                $("section.most-viewd-notes").addClass("d-none");
            } else {
                $("section.most-viewd-notes").removeClass("d-none");
                let adshow = 0;
                for (let i = 0; i < data.requested.length; i++) {
                    adshow++;
                    if(adshow == 4){
                        adshow = 0;
                        $(".most-viewd-notes .row").append(`
                        <div class="col-lg-4 col-sm-6 mt-3 d-flex justify-content-center align-items-center">
                        <ins class="adsbygoogle"
                        style="display:block"
                        data-ad-client="ca-pub-3834928493837917"
                        data-ad-slot="5066912970"
                        data-ad-format="auto"
                        data-full-width-responsive="true"></ins>
                        </div>`);
                        (adsbygoogle = window.adsbygoogle || []).push({});
                    }
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
                    $(".most-viewd-notes .row").append(content);
                }

            }
        },
        error: function () {
            $(".most-viewd-notes .row").html("");
            $("section.most-viewd-notes").addClass("d-none");

        }
    })
    $.ajax({
        type: "GET",
        url: app.getApi() + "/products/feeds/0",
        beforeSend: function () { },
        success: function (data) {
            console.log(data);
            $(".recent-notes .row").html("");
            if (data.requested.length <= 0) {
                $(".section.recent-notes").removeClass("d-none");
            } else {
                let adshow = 0;
                for (let i = 0; i < data.requested.length; i++) {
                    adshow++;
                    if(adshow == 3){
                        adshow = 0;
                        $(".recent-notes .row").append(`
                        <div class="col-lg-4 col-sm-6 mt-3 d-flex justify-content-center align-items-center">
                        <ins class="adsbygoogle"
                        style="display:block"
                        data-ad-client="ca-pub-3834928493837917"
                        data-ad-slot="5066912970"
                        data-ad-format="auto"
                        data-full-width-responsive="true"></ins>

                        </div>`);
                        (adsbygoogle = window.adsbygoogle || []).push({});
                    }
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
            $(".recent-notes .row").append(content);
                }
            }
        },
        error: function () {
            $(".recent-notes .row").html("");
            $(".section.recent-notes").addClass("d-none");
        }
    })

    // mostViewed();
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
});