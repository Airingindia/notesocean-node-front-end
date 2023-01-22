$(document).ready(function () {

    dash.getTotalProductsCount().then(data => {
        let count = data.userProductsCount;
        $(".total-notes").html(count);
    }).catch((err) => {
        app.alert(err.status, "failed to load products count ")
    })
    var wow = new WOW({ scrollContainer: ".second-side" });
    wow.init();
    var next = 0;
    var prev = 0;
    var checked = false;
    var hit = false;
    function check() {
        $(".second-side").scroll(function () {
            // get last div element of .public-notes-container
            let lastDiv = $(".public-item").last();
            //    get visibility of last div
            let lastDivVisiblity = lastDiv.css("visibility");
            console.log(lastDivVisiblity);
            if (lastDivVisiblity == "visible") {
                if (!hit) {
                    next += 1;
                    hit = true;
                    loadData();
                }

            }
        });
    }
    // get user public notes
    function loadData() {
        $.ajax({
            type: "GET",
            url: app.getApi() + "/products?page=" + next,
            contentType: "application/json",
            processData: false,
            headers: {
                Authorization: getCookie("token")
            },
            beforeSend: function () {
                $(".loading-public-notes").removeClass("d-none");
            },
            success: function (data) {
                prev = next;

                showData(data);
                // $(".total-notes").html(data.size);

            },
            error: function (err) {
                app.alert(err.status, err?.responseJSON?.message ? err?.responseJSON?.message : "Something went wrong");
                $(".loading-public-notes").addClass("d-none");
                $(".public-notes-container").addClass("d-none");
                $(".no-public-notes").removeClass("d-none");
            }
        });
    }
    loadData();
    function showData(data) {

        if (data.requested.length !== 0) {
            hit = false;
            // $(".loading-public-notes").addClass("d-none");
            $(".no-public-notes").addClass("d-none");
            let adshow = 0;
            // get domain

            let api = app.getApi();

            for (let i = 0; i < data.requested.length; i++) {
                adshow++;
                if (api == "https://api.notesocean.com") {
                    if (adshow == 5) {
                        adshow = 0;
                        $(".public-notes-container").append(`
                        <div class="col-md-3 my-3 d-flex justify-content-center align-items-center wow ">
                        <ins class="adsbygoogle"
                        style="display:inline-block;width:336px;height:280px"
                        data-ad-client="ca-pub-3834928493837917"
                        data-ad-slot="1394357315"></ins>
                        </div>`);
                        (adsbygoogle = window.adsbygoogle || []).push({});
                    }
                }

                let id = data.requested[i].uuid;
                let name = data.requested[i].name;
                let timestamp = data.requested[i].timestamp;
                let description = data.requested[i].description;
                let thumbnails = data.requested[i].thumbnails.split(",")[0].replace("https://thumbnails.ncdn.in", 'https://thumbnails.ncdn.in/fit-in/400x400/filters:format(webp)/filters:quality(100)/');
                var img1 = data.requested[i].thumbnails.split(",")[0].replace("https://thumbnails.ncdn.in", 'https://thumbnails.ncdn.in/fit-in/400x400/filters:format(webp)/filters:quality(100)/');
                var img2 = data.requested[i].thumbnails.split(",")[0].replace("https://thumbnails.ncdn.in", 'https://thumbnails.ncdn.in/fit-in/400x400/filters:format(webp)/filters:quality(100)/');

                var img3 = data.requested[i].thumbnails.split(",")[0].replace("https://thumbnails.ncdn.in", 'https://thumbnails.ncdn.in/fit-in/400x400/filters:format(webp)/filters:quality(100)/');

                timestamp = timeDifference(timestamp);
                let size = bytesToSize(data.requested[i].size);
                let fileType = data.requested[i].fileType;
                let pages = data.requested[i].pages;
                let views = data.requested[i].views;
                $(".public-notes-container").append(`
                    <div class="col-md-3 my-3 public-item wow animate__animated  animate__fadeIn">
                        <a href="/dashboard/public-notes/${id}"> 
                        <div class="card h-100 shadow public-notes-item  border-0 rounded bg-white my-3"  data-route="${id}">
                            <img class="card-img-top lozad" src="${thumbnails}"  srcset="${img1} 320w,${img2} 480w,${img3} 800w",sizes="(max-width: 320px) 280px,(max-width: 480px) 440px,800px" style="height:200px;width:100%" loading="lazy"  />
                            <div class="card-body pb-0"> 
                               
                                
                            </div>
                            <div class="card-footer bg-white border-0">
                            <p class="card-title">  ${name.substring(0, 100)} </p>
                               
                                <div class="d-flex justify-content-between text-muted">
                                    <div>
                                        <i class="fa fa-file-text mx-1"></i><small>${fileType.toUpperCase()}</small>
                                    </div>
                                    <div>
                                      <i class="fa fa-clock mx-1"></i><small> ${timestamp} </small>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-between text-muted">
                                    <div>
                                       <i class="fa fa-file mx-1"></i><small> ${pages} pages </small>
                                    </div>
                                    <div>
                                        <i class="fa fa-globe mx-1"></i><small>${views} views</small>
                                    </div>
                                </div>
                            </div>
                        </div>

                        </a>
                    </div>
                `);

            }
            publicNotesRoute();
            if (!checked) {
                checked = true;
                check();
            }
        } else {
            if (!checked) {
                $(".loading-public-notes").addClass("d-none");
                $(".public-notes-container").addClass("d-none");
                $(".no-public-notes").removeClass("d-none");
            } else {
                $(".loading-public-notes").addClass("d-none");
            }
        }
    }


    function timeDifference(previous) {
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

    function publicNotesRoute() {
        $(".public-notes-item").each(function () {
            $(this).click(function () {
                let id = $(this).attr("data-route");
                window.location = "/dashboard/public-notes/" + id;
            })
        })
    }
    function bytesToSize(bytes) {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 Byte';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }


    $("form").submit(function (event) {
        event.preventDefault();
        const input = $("input").val();
        if (input.length !== 0) {
            $.ajax({
                type: "GET",
                url: app.getApi() + "/products/search/" + input,
                headers: {
                    Authorization: getCookie("token")
                },
                beforeSend: function () {
                    $(".loading-public-notes").removeClass("d-none");
                },
                success: function (data) {
                    showData(data);
                    new Noty({
                        theme: "sunset",
                        type: "success",
                        text: '<i class="fa fa-check-circle">  </i> Filter by ' + input + " ",
                        timeout: 4000,
                    }).show();

                },
                error: function (err) {
                    app.alert(err.status, err?.responseJSON?.message ? err?.responseJSON?.message : "Something went wrong");
                }
            })
        } else {
            loadData();
        }
    });

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

});