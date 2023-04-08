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

    const spanElement1 =    $('.category-selector').children('div').children('span.s1')
    const spanElement2 =    $('.category-selector').children('div').children('span.s2')
    const spanElement3 =    $('.category-selector').children('div').children('span.s3')
    const spanElement4 =    $('.category-selector').children('div').children('span.s4')
    const spanElement5 =    $('.category-selector').children('div').children('span.s5')

    function wrapLongText(string , limit) {
        var dots = "...";
        if(string.length > limit)
        {
            // you can also use substr instead of substring
            string = string.substring(0,limit) + dots;
        }
        return string;
      }


      function bytesToMb(bytes) {
        /*
        Converts a number of bytes to megabytes.
        */
        const mb = bytes / 1048576;
        return mb.toFixed(2)+" "+'mb';
      }
      
    spanElement1.addClass('selected-tab')



    function myFunction(arg){

        if(arg==0){
            $('.recent-notes').addClass("category-default")
            $('.categories.categories-courses').addClass('category-default')
            $('.categories.categories-subject').addClass('category-default')
            $('.personalised-feed').addClass("category-default")
            $('.most-viewd-notes').removeClass("category-default")
            

            //active class
            spanElement1.addClass('selected-tab')
            spanElement2.removeClass('selected-tab')
            spanElement3.removeClass('selected-tab')
            spanElement4.removeClass('selected-tab')
            spanElement5.removeClass('selected-tab')

            loadTopNotes()
        }else if(arg==1){
            $('.most-viewd-notes').addClass("category-default")
            $('.categories.categories-courses').addClass('category-default')
            $('.categories.categories-subject').addClass('category-default')
            $('.personalised-feed').addClass("category-default")
            $('.recent-notes').removeClass("category-default")

            //active class
            spanElement2.addClass('selected-tab')
            spanElement1.removeClass('selected-tab')
            spanElement3.removeClass('selected-tab')
            spanElement4.removeClass('selected-tab')
            spanElement5.removeClass('selected-tab')


            loadRecentNotes()
        }else if(arg==2){
            $('.most-viewd-notes').addClass("category-default")
            $('.categories.categories-courses').addClass('category-default')
            $('.categories.categories-subject').addClass('category-default')
            $('.recent-notes').addClass("category-default")
            $('.personalised-feed').removeClass("category-default")

            //active class
            spanElement3.addClass('selected-tab')
            spanElement1.removeClass('selected-tab')
            spanElement2.removeClass('selected-tab')
            spanElement4.removeClass('selected-tab')
            spanElement5.removeClass('selected-tab')


            loadForYou()
        }else if(arg==3){
            $('.most-viewd-notes').addClass("category-default")
            $('.categories.categories-courses').addClass('category-default')
            $('.recent-notes').addClass("category-default")
            $('.personalised-feed').addClass("category-default")
            $('.categories.categories-subject').removeClass('category-default')

            //active class
            spanElement4.addClass('selected-tab')

            spanElement1.removeClass('selected-tab')
            spanElement2.removeClass('selected-tab')
            spanElement3.removeClass('selected-tab')
            spanElement5.removeClass('selected-tab')


            loadSubjects()
        }else if(arg==4){
            $('.most-viewd-notes').addClass("category-default")
            $('.recent-notes').addClass("category-default")
            $('.categories.categories-subject').addClass('category-default')
            $('.personalised-feed').addClass("category-default")
            $('.categories.categories-courses').removeClass('category-default')

            //active class
            spanElement5.addClass('selected-tab')
            spanElement1.removeClass('selected-tab')
            spanElement2.removeClass('selected-tab')
            spanElement3.removeClass('selected-tab')
            spanElement4.removeClass('selected-tab')
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
                            $(".most-viewd-notes .row").append
                            (
                            `<div class="col-lg-4 col-sm-6 mt-3">
                                <div class=' h-100 border-dark short-notes-details-container'>
                                    <ins class="adsbygoogle"
                                    style="display:inline-block;width:336px;height:280px"
                                    data-ad-client="ca-pub-3834928493837917"
                                    data-ad-slot="1394357315"></ins>
                                </div>
                            </div>`
                            );
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
                        let size = data.requested[i].size;
                        let describtion = data.requested[i].description;
                        let views = data.requested[i].views;
                        let timestamp = app.getTime(data.requested[i].timestamp);
                        let username = data.requested[i].users.firstName + " " + data.requested[i].users.lastName;
                        let userprofileImage = data.requested[i].users.profileImage;                    

                        let content=` <div class='col-lg-4 col-sm-6 mt-3'><a href="/notes/${product_id}">
                        <div class=" h-100 border-dark short-notes-details-container">
                          
                            <div class='user-profile-details-container'>
                              <div class='user-profile-image'>
                                <img class='user-image' src=${userprofileImage.split(",")[0].replace("https://thumbnails.ncdn.in","https://thumbnails.ncdn.in/fit-in/720x200/filters:format(webp)/filters:quality(100)")} />
                              </div>
                              <div class='user-info-container'>
                                
                                <div class='user-profile-details'>
                                    <div class='user-profile name'>${username}</div>
                                    <div class='user-profile dot'>&#x2022;</div>
                                    <div class='user-profile timeline'>${timestamp}</div>
                                </div>
                                <div class='user-profile-organisation'></div>
                              </div>
                            </div> 
                            
                            <div class='notes'>
                                <img class='product-img' src=${thumbnails.split(",")[0].replace("https://thumbnails.ncdn.in", "https://thumbnails.ncdn.in/fit-in/720x200/filters:format(webp)/filters:quality(100)")} />
                            </div>
                            
                            <div class='notes-details-conatiner'>
                              <div class='notes-page-details-container'>
                                <div class='notes-view-details'>
                                  <div class='notes-stats page-size'>${pages} pages</div>
                                  <div class='notes-stats dot'>&#x2022;</div>
                                  <div class='notes-stats view'>${views} views</div>
                                  <div class='notes-stats dot'>&#x2022;</div>
                                  <div class='notes-stats size'>${bytesToMb(size)} </div>
                                </div>
                                <div class="bookmark-conatiner">
                                  <div class='bookmark'><i class="fa fa-bookmark-o" aria-hidden="true"></i></div>
                                </div>
                              </div>
                              <div class='notes-details'>
                                  <div class='notes-header'>${wrapLongText(name,80)}</div>
                                  
                                  <div class='notes-describtion'>${wrapLongText(describtion,150)}</div>
                              </div>
                            </div>
                          </div>
              
                      </div>`

                        
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
                        let size = data.requested[i].size;
                        let describtion = data.requested[i].description;
                        let views = data.requested[i].views;
                        let timestamp = app.getTime(data.requested[i].timestamp);
                        let username = data.requested[i].users.firstName + " " + data.requested[i].users.lastName;
                        let userprofileImage = data.requested[i].users.profileImage; 


                        let content=` <div class='col-lg-4 col-sm-6 mt-3'><a href="/notes/${product_id}">
                        <div class=" h-100 border-dark short-notes-details-container">
                          
                            <div class='user-profile-details-container'>
                              <div class='user-profile-image'>
                                <img class='user-image' src=${userprofileImage.split(",")[0].replace("https://thumbnails.ncdn.in","https://thumbnails.ncdn.in/fit-in/720x200/filters:format(webp)/filters:quality(100)")} />
                              </div>
                              <div class='user-info-container'>
                                
                                <div class='user-profile-details'>
                                    <div class='user-profile name'>${username}</div>
                                    <div class='user-profile dot'>&#x2022;</div>
                                    <div class='user-profile timeline'>${timestamp}</div>
                                </div>
                                <div class='user-profile-organisation'></div>
                              </div>
                            </div> 
                            
                            <div class='notes'>
                                <img class='product-img' src=${thumbnails.split(",")[0].replace("https://thumbnails.ncdn.in", "https://thumbnails.ncdn.in/fit-in/720x200/filters:format(webp)/filters:quality(100)")} />
                            </div>
                            
                            <div class='notes-details-conatiner'>
                              <div class='notes-page-details-container'>
                                <div class='notes-view-details'>
                                  <div class='notes-stats page-size'>${pages} pages</div>
                                  <div class='notes-stats dot'>&#x2022;</div>
                                  <div class='notes-stats view'>${views} views</div>
                                  <div class='notes-stats dot'>&#x2022;</div>
                                  <div class='notes-stats size'>${bytesToMb(size)} </div>
                                </div>
                                <div class="bookmark-conatiner">
                                  <div class='bookmark'><i class="fa fa-bookmark-o" aria-hidden="true"></i></div>
                                </div>
                              </div>
                              <div class='notes-details'>
                                  <div class='notes-header'>${wrapLongText(name,80)}</div>
                                  
                                  <div class='notes-describtion'>${wrapLongText(describtion,150)}</div>
                              </div>
                            </div>
                          </div>
              
                      </div>`
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
                        let size = data.requested[i].size;
                        let describtion = data.requested[i].description;
                        let views = data.requested[i].views;
                        let timestamp = app.getTime(data.requested[i].timestamp);
                        let username = data.requested[i].users.firstName + " " + data.requested[i].users.lastName;
                        let userprofileImage = data.requested[i].users.profileImage; 

                        let content=` <div class='col-lg-4 col-sm-6 mt-3'><a href="/notes/${product_id}">
                        <div class=" h-100 border-dark short-notes-details-container">
                          
                            <div class='user-profile-details-container'>
                              <div class='user-profile-image'>
                                <img class='user-image' src=${userprofileImage?.split(",")[0].replace("https://thumbnails.ncdn.in","https://thumbnails.ncdn.in/fit-in/720x200/filters:format(webp)/filters:quality(100)")} />
                              </div>
                              <div class='user-info-container'>
                                
                                <div class='user-profile-details'>
                                    <div class='user-profile name'>${username}</div>
                                    <div class='user-profile dot'>&#x2022;</div>
                                    <div class='user-profile timeline'>${timestamp}</div>
                                </div>
                                <div class='user-profile-organisation'></div>
                              </div>
                            </div> 
                            
                            <div class='notes'>
                                <img class='product-img' src=${thumbnails?.split(",")[0].replace("https://thumbnails.ncdn.in", "https://thumbnails.ncdn.in/fit-in/720x200/filters:format(webp)/filters:quality(100)")} />
                            </div>
                            
                            <div class='notes-details-conatiner'>
                              <div class='notes-page-details-container'>
                                <div class='notes-view-details'>
                                  <div class='notes-stats page-size'>${pages} pages</div>
                                  <div class='notes-stats dot'>&#x2022;</div>
                                  <div class='notes-stats view'>${views} views</div>
                                  <div class='notes-stats dot'>&#x2022;</div>
                                  <div class='notes-stats size'>${bytesToMb(size)} </div>
                                </div>
                                <div class="bookmark-conatiner">
                                  <div class='bookmark'><i class="fa fa-bookmark-o" aria-hidden="true"></i></div>
                                </div>
                              </div>
                              <div class='notes-details'>
                                  <div class='notes-header'>${wrapLongText(name,80)}</div>
                                  
                                  <div class='notes-describtion'>${wrapLongText(describtion,150)}</div>
                              </div>
                            </div>
                          </div>
              
                      </div>`
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