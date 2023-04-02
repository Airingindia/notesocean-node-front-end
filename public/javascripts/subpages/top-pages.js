$(document).ready(function () {
    let topNotesHit = false;
    let recentNotesHit = false;
    $(window).scroll(function () {
        let topNotesVisiblity = $(".most-viewd-notes").css("visibility");
        if (topNotesVisiblity == "visible" && topNotesHit == false) {
            topNotesHit = true;
            loadTopNotes();
        }
        //    check recnt notes visiblity
        let recentNotesVisiblity = $(".recent-notes").css("visibility");
        if (recentNotesVisiblity == "visible" && recentNotesHit == false) {
            recentNotesHit = true;
            loadRecentNotes();
        }
    });

function loadTopNotes() {
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
                var domain = window.location.hostname;

                for (let i = 0; i < data.requested.length; i++) {
                    adshow++;
                    if (adshow == 4 && domain == "notesocean.com") {
                        adshow = 0;
                        $(".most-viewd-notes .row").append(`
                        <div class="col-lg-4 col-sm-6 mt-3 d-flex justify-content-center align-items-center">
                        <ins class="adsbygoogle"
                        style="display:inline-block;width:336px;height:280px"
                        data-ad-client="ca-pub-3834928493837917"
                        data-ad-slot="1394357315"></ins>
                        </div>`);
                        try {
                            (adsbygoogle = window.adsbygoogle || []).push({});
                        } catch (e) {
                            console.log(e);
                        }
                    }
                    let product_id = data.requested[i].uuid;
                    let name = data.requested[i].name;
                    let pages = data.requested[i].pages;
                    let thumbnails = data.requested[i].thumbnails;
                    let views = data.requested[i].views;
                    let timestamp = app.getTime(data.requested[i].timestamp);
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
        error: function (err) {
            app.alert(err.status, err?.responseJSON?.message ? err?.responseJSON?.message : "Something went wrong");
            $(".most-viewd-notes .row").html("");
            $("section.most-viewd-notes").addClass("d-none");

        }
    })
}

})