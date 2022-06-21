$(document).ready(function () {
    // var access = 1;
    // var last_access = 0;
    // function scrollFunction() {
    //     $(window).scroll(function () {
    //         // console.log($(".public-notes-item").last().attr("data-id"));
    //         let visibility = $(".public-notes-item").last().css("visibility");
    //         if (visibility !== "hidden") {
    //             loadFeed(access);
    //         }
    //     });

    // }
    // scrollFunction();

    // function loadFeed(page) {
    //     if (last_access !== page) {
    //         last_access = page;
    //         $.ajax({
    //             type: "GET",
    //             url: localStorage.getItem("api") + "/products/feeds/" + page,
    //             beforeSend: function () {
    //                 //  ads place

    //                 //  ad1 append
    //                 $(".public-now-row").append(`
    //                     <div class="col-md-3 my-2 content-item">
    //                         <div class="card shadow border-0 rounded h-100 wow public-notes-item">
    //                             <ins class="adsbygoogle"
    //                             style="display:block"
    //                             data-ad-client="ca-pub-3834928493837917"
    //                             data-ad-slot="9881514825"
    //                             data-ad-format="auto"
    //                             data-full-width-responsive="true"
    //                             data-adtest="on"></ins>
    //                         </div>

    //                     </div>
    //                 `);
    //                 (adsbygoogle = window.adsbygoogle || []).push({});


    //                 // ad2 place
    //             },
    //             success: function (data) {

    //                 if (data.requested.length !== 0) {
    //                     access++;
    //                     for (let i = 0; i < data.requested.length; i++) {
    //                         let name = data.requested[i].product.name;
    //                         if (name.length > 80) {
    //                             name = name.substring(0, 80);
    //                         }
    //                         let thumbnails = data.requested[i].product.thumbnails.split(",")[0].replace("https://s3.ap-south-1.amazonaws.com/thumbnails.notesocean.com", "https://thumbnails.ncdn.in/fit-in/720x480/filters:format(webp)/filters:quality(100)");
    //                         let views = data.requested[i].product.views + " views";
    //                         let id = data.requested[i].product.id;
    //                         let timestamp = data.requested[i].product.timestamp;
    //                         let pages = data.requested[i].product.pages + " Pages";
    //                         let actual_time = getTime(timestamp);
    //                         let seoUrl = makeUrl(name);
    //                         // user details 
    //                         let Full_name = data.requested[i].user.firstName + " " + data.requested[i].user.lastName
    //                         let user_id = data.requested[i].user.id;
    //                         let profilePic = data.requested[i].user.profileImage;
    //                         var pic;
    //                         if (profilePic !== null) {
    //                             pic = profilePic.split(",")[0];
    //                         } else {
    //                             pic = "/images/user.jfif";
    //                         }
    //                         $(".public-now-row").append(`
    //                         <div class="col-md-3 my-2"><a href="/notes/${id}">
    //     <div class="card shadow border-0 rounded h-100 wow public-notes-item">
    //         <div class="card-header border-0 px-1">
    //             <p class="card-title"> ${name}</p>
    //         </div>
    //         <img src= "${thumbnails} "class="card-img-top notes-thumbnails">
    //         <div class="card-footer border-0 px-1">
    //             <div class="row">
    //                 <div class="col-12">
    //                     <a href="/profile/${user_id}">
    //                         <img class="user-image" src="${profilePic}"/>
    //                     </a>
    //                     <small class="card-text">
    //                         <a class="mx-2 user-name-text" href="/profile/${user_id}">${Full_name} </a>
    //                     </small>
    //                 </div>
    //                 <div class="col-12 mt-2">
    //                     <div class="card-text notes-details-text">
    //                     <span>
    //                         <i class="fa fa-globe"></i>
    //                         <small class="mx-1"> ${views}</small>
    //                     </span>
    //                     <span class="mx-1">
    //                         <i class="fa fa-file mx-1"> </i>
    //                         <small> ${pages}</small>
    //                     </span>
    //                     <span class="mx-1">
    //                         <i class="fa fa-clock mx-1"></i>
    //                         <small>${actual_time}</small>
    //                     </span>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // </a></div>
    //                             `);
    //                     }
    //                 } else {
    //                     last_access = access;
    //                 }
    //             }
    //         });
    //     }

    // };
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
    // function makeUrl(url) {
    //     return url.toString()               // Convert to string
    //         .normalize('NFD')               // Change diacritics
    //         .replace(/[\u0300-\u036f]/g, '') // Remove illegal characters
    //         .replace(/\s+/g, '-')            // Change whitespace to dashes
    //         .toLowerCase()                  // Change to lowercase
    //         .replace(/&/g, '-and-')          // Replace ampersand
    //         .replace(/[^a-z0-9\-]/g, '')     // Remove anything that is 
    //         .replace(/-+/g, '-')             // Remove duplicate dashes
    //         .replace(/^-*/, '')              // Remove starting dashes
    //         .replace(/-*$/, '');             // Remove trailing dashes
    // }


    // live notes
    const socket = io();

    // var swiper = new Swiper(".mySwiper", {
    //     slidesPerView: 1,
    //     spaceBetween: 10,
    //     freeMode: true,
    //     autoplay: {
    //         delay: 5000,
    //     },
    //     pagination: {
    //         el: ".swiper-pagination",
    //         clickable: true,
    //     },

    //     breakpoints: {
    //         640: {
    //             slidesPerView: 1,
    //             spaceBetween: 10,
    //         },
    //         768: {
    //             slidesPerView: 4,
    //             spaceBetween: 10,
    //         },
    //         1024: {
    //             slidesPerView: 4,
    //             spaceBetween: 10,
    //         },
    //     },
    // });
    // live noets function

    socket.on("liveNotes", data => {
        if (Object.keys(data).length !== 0) {
            var array = Object.entries(data).map(function (entry) {
                key = entry[0];
                value = entry[1];
                nested_object = value;
                nested_object.key = key;
                return nested_object;
            });
            var products = [];
            var users = {};
            livenotescount = array.length;
            if (array.length !== 0) {

                $(".live-reading").removeClass("d-none");

                var unique_notes = array.filter((value, index, self) => self.findIndex((m) => m.product.product_id === value.product.product_id) === index);
                $(".live-reading .row").html("");
                var count = 0;
                for (let i = 0; i < unique_notes.length; i++) {


                    let product = unique_notes[i].product;
                    let name = product.name;
                    let pages = product.pages;
                    let product_id = product.product_id;
                    let thumbnail = product.thumbnail;
                    let timestamp = product.timestamp;
                    let views = product.views;
                    let firstName = product.user.firstName;
                    let lastName = product.user.lastName;
                    let profileImage = product.user.profileImage;
                    let userId = product.user.userId;
                    let content = `<div class="col-6 col-lg-4 mt-3"><a href="/notes/${product_id}">
                    <div class="card shadow border-0 h-100">
                        <div class="card-header">  ${name}</div>
                        <div class="card-body p-0"><img class="card-img-top" src="${thumbnail.split(",")[0].replace("https://s3.ap-south-1.amazonaws.com/thumbnails.notesocean.com", "https://thumbnails.ncdn.in/fit-in/720x250/filters:format(webp)/filters:quality(100)")}" /></div>
                        <div class="card-footer">
                            <div class="notes-profile-cont"><a href="/profile/${userId}"><img class="notes-cont-profile-pic" src="${profileImage}" alt="user image " /><span class="text-muted">  ${firstName}  ${lastName} </span></a></div>
                            <div class="notes-cont-info d-flex justify-content-between text-muted mt-2"><small><i class="fa fa-globe"> </i><span> ${views} Views</span></small><small><i class="fa fa-file"> </i><span> ${pages} pages </span></small><small><i class="fa fa-clock"></i><span> ${timestamp} </span></small></div>
                        </div>
                    </div>
                </a></div>`;

                    if (count < 12) {
                        count++;
                        $(".live-reading .row").append(content);
                    }


                }
            } else {
                $(".live-reading").addClass("d-none");
                $(".live-reading .row").html("");
            }
        }

    });




    //  most views notes

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
                        url: localStorage.getItem("api") + "/products/top-performing-products",
                        beforeSend: function () { },
                        success: function (data) {
                            $(".most-viewd-notes .row").html("");
                            for (let i = 0; i < data.requested.length; i++) {
                                let product_id = data.requested[i].product.id;
                                let name = data.requested[i].product.name;
                                let pages = data.requested[i].product.pages;
                                let thumbnails = data.requested[i].product.thumbnails;
                                let views = data.requested[i].product.views;
                                let timestamp = getTime(data.requested[i].product.timestamp);
                                let content = `<div class="col-lg-4 col-sm-6 mt-3"><a href="/notes/${product_id}">
                                <div class="card shadow border-0 h-100">
                                    <div class="card-header">  ${name}</div>
                                    <div class="card-body p-0"><img class="card-img-top" src="${thumbnails.split(",")[0].replace("https://s3.ap-south-1.amazonaws.com/thumbnails.notesocean.com", "https://thumbnails.ncdn.in/fit-in/720x250/filters:format(webp)/filters:quality(100)")}" /></div>
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
                        url: localStorage.getItem("api") + "/products/feeds/0",
                        beforeSend: function () { },
                        success: function (data) {
                            $(".recent-notes .row").html("");
                            for (let i = 0; i < data.requested.length; i++) {
                                let product_id = data.requested[i].product.id;
                                let name = data.requested[i].product.name;
                                let pages = data.requested[i].product.pages;
                                let thumbnails = data.requested[i].product.thumbnails;
                                let views = data.requested[i].product.views;
                                let timestamp = getTime(data.requested[i].product.timestamp);
                                let content = `<div class="col-lg-4 col-sm-6 mt-3"><a href="/notes/${product_id}">
                                <div class="card shadow border-0 h-100">
                                    <div class="card-header">  ${name}</div>
                                    <div class="card-body p-0"><img class="card-img-top" src="${thumbnails.split(",")[0].replace("https://s3.ap-south-1.amazonaws.com/thumbnails.notesocean.com", "https://thumbnails.ncdn.in/fit-in/720x250/filters:format(webp)/filters:quality(100)")}" /></div>
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
                    })
                }
            }
        })
    }

    recentNotes();

    mostViewed();


});