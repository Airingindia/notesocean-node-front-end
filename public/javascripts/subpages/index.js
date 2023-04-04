$(document).ready(function () {
    let topNotesHit = false;
    let recentNotesHit = false;
    loadTopNotes()
    let element = document.getElementsByClassName('category-heading')
    const token = app.getToken();
    
    if(token==undefined){
        element[2].style.display = "none"
    }

    element[0].addEventListener("click",()=>{myFunction(0)})
    element[1].addEventListener("click",()=>{myFunction(1)})
    element[2].addEventListener("click",()=>{myFunction(2)})
    element[3].addEventListener("click",()=>{myFunction(3)})
    element[4].addEventListener("click",()=>{myFunction(4)})
    function myFunction(arg){

        if(arg==0){
            $('.recent-notes').addClass("category-default")
            $('.categories.categories-courses').addClass('category-default')
            $('.categories.categories-subject').addClass('category-default')
            $('.personalised-feed').addClass("category-default")
            $('.most-viewd-notes').removeClass("category-default")
            loadTopNotes()
        }else if(arg==1){
            $('.most-viewd-notes').addClass("category-default")
            $('.categories.categories-courses').addClass('category-default')
            $('.categories.categories-subject').addClass('category-default')
            $('.personalised-feed').addClass("category-default")
            $('.recent-notes').removeClass("category-default")
            loadRecentNotes()
        }else if(arg==2){
            $('.most-viewd-notes').addClass("category-default")
            $('.categories.categories-courses').addClass('category-default')
            $('.categories.categories-subject').addClass('category-default')
            $('.recent-notes').addClass("category-default")
            $('.personalised-feed').removeClass("category-default")
            loadForYou()
        }else if(arg==3){
            $('.most-viewd-notes').addClass("category-default")
            $('.categories.categories-courses').addClass('category-default')
            $('.recent-notes').addClass("category-default")
            $('.personalised-feed').addClass("category-default")
            $('.categories.categories-subject').removeClass('category-default')
            loadSubjects()
        }else if(arg==4){
            $('.most-viewd-notes').addClass("category-default")
            $('.recent-notes').addClass("category-default")
            $('.categories.categories-subject').addClass('category-default')
            $('.personalised-feed').addClass("category-default")
            $('.categories.categories-courses').removeClass('category-default')
        }else{

            console.log(arg)
        }
    }


    
    $('.recent-notes').addClass("category-default")
    $('.personalised-feed').addClass("category-default")
    $('.categories.categories-courses').addClass('category-default')
    $('.categories.categories-subject').addClass('category-default')


    // const recentSection = document.getElementsByClassName('recent-notes')


    // $(window).scroll(function () {
    //     let topNotesVisiblity = $(".most-viewd-notes").css("visibility");
    //     if (topNotesVisiblity == "visible" && topNotesHit == false) {
    //         topNotesHit = true;
    //         loadTopNotes();
    //     }
    //     //    check recnt notes visiblity
    //     let recentNotesVisiblity = $(".recent-notes").css("visibility");
    //     if (recentNotesVisiblity == "visible" && recentNotesHit == false) {
    //         recentNotesHit = true;
    //         loadRecentNotes();
    //     }
    // });


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
    
    function loadRecentNotes() {
        $.ajax({
            type: "GET",
            url: app.getApi() + "/products/feeds/0",
            beforeSend: function () { },
            success: function (data) {
                $(".recent-notes .row").html("");
                if (data.requested.length <= 0) {
                    $(".section.recent-notes").removeClass("d-none");
                } else {
                    let adshow = 0;
                    var domain = window.location.hostname;
                    for (let i = 0; i < data.requested.length; i++) {
                        adshow++;
                        if (adshow == 3 && domain == "notesocean.com") {
                            adshow = 0;
                            $(".recent-notes .row").append(`
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
            error: function (err) {
                app.alert(err.status, err?.responseJSON?.message ? err?.responseJSON?.message : "Something went wrong");
                $(".recent-notes").addClass("d-none")
                $(".recent-notes .row").html("");
            }
        })
    }


    function loadSubjects(){
        $.ajax({
            type: "GET",
            url: app.getApi() + "/products/subjects",
            beforeSend: function () { },
            success: function (data) { 
                $(".categories.categories-subject .row").html("");   
                const subjectHeadingData = []
                for(let key in data){
                    subjectHeadingData.push(key)
                }
                for(let i = 0 ; i < subjectHeadingData.length;i++){
                    const content=`<div class="col-6 col-lg-3 mt-3">
                    <a href='/subjects/${subjectHeadingData[i]}'>
                    <div class="card shadow border-0 text-center h-100 d-flex justify-content-center align-items-center py-5 px-1">
                        
                        <h6 >${subjectHeadingData[i]}</h6>
                    </div>
                    </a>
                  </div>`

                  $(".categories.categories-subject .row").append(content);   
   

                }
                

                
            },
            error: function (err) {
                app.alert(err.status, err?.responseJSON?.message ? err?.responseJSON?.message : "Something went wrong");
                $(".categories.categories-subject").addClass("d-none")
                $(".categories.categories-subject .row").html("");
            }
        })
    }

    function loadForYou(){
        $.ajax({
            type: "GET",
            url: app.getApi() + "/products/personalized-feed",
            headers: {Authorization: app.getToken()} ,
            beforeSend: function () { },
            success: function (data) { 
                
                $(".personalised-feed .row").html("");
                if (data.requested.length <= 0) {
                    $(".section.personalised-feed").removeClass("d-none");
                } else {
                    let adshow = 0;
                    var domain = window.location.hostname;
                    for (let i = 0; i < data.requested.length; i++) {
                        adshow++;
                        if (adshow == 3 && domain == "notesocean.com") {
                            adshow = 0;
                            $(".personalised-feed .row").append(`
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
                        $(".personalised-feed .row").append(content);
                    }
                }

                
            },
            error: function (err) {
                app.alert(err.status, err?.responseJSON?.message ? err?.responseJSON?.message : "Something went wrong");
                $(".personalised-feed").addClass("d-none");
                $(".personalised-feed .row").html("");
            }
        })
    }

    var winwidth = $(window).width();

    if (winwidth < 769) {
        loadTopNotes();
    }
});