$(document).ready(function () {
    const ads = [
        {
            name: "Class 10 Sanskrit Shemushi + Class 10 Sanskrit Workbook Abhyaswan Bhav",
            timestamp: 1647108474,
            image: "https://admedia.notesocean.com/amazon/sanskrit.png",
            link: "https://amzn.to/3JaL7W7"
        },
        {
            name: "CBSE All In One Social Science Class 10 for 2022 Exam (Updated edition for Term 1 ",
            timestamp: 1647108474,
            image: "https://admedia.notesocean.com/amazon+1.png",
            link: "https://amzn.to/3tR04Gg"
        },
        {
            name: " Basic Electrical Engineering | First Edition | By Pearson",
            timestamp: 1647108474,
            image: "https://m.media-amazon.com/images/P/B08153W5PZ.01._SCLZZZZZZZ_SX500_.jpg",
            link: "https://amzn.to/3Jk4g7O"
        },
        {
            name: "Mechanics of Materials (SI Edition) Paperback – 5 April 2018",
            timestamp: 1647108474,
            image: "https://m.media-amazon.com/images/I/510Kc+VbQdL._SL160_.jpg",
            link: "https://amzn.to/3CGsSVV"
        },
    ];
    var access = 1;
    var last_access = 0;
    function scrollFunction() {
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
                url: localStorage.getItem("api") + "/products/feeds/" + page,
                beforeSend: function () {
                    //  ads place
                    let ad1 = ads[last_access - 1];
                    let ad2 = ads[last_access];
                    //  ad1 append
                    $(".public-now-row").append(`
                        <div class="col-md-3 my-2">
                            <div class="card shadow border-0 rounded h-100 wow public-notes-item">
                                <ins class="adsbygoogle"
                                style="display:inline-block;width:336px;height:280px"
                                data-ad-client="ca-pub-3834928493837917"
                                data-ad-slot="7023455181"
                                data-ad-test="on">
                                </ins>
                            </div>
                        </div>
                    `);
                    // ad2 place
                },
                success: function (data) {
                    // console.log(data);
                    if (data.requested.length !== 0) {
                        access++;
                        for (let i = 0; i < data.requested.length; i++) {
                            let name = data.requested[i].product.name;
                            if (name.length > 80) {
                                name = name.substring(0, 80);
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
                                    <div class="card shadow border-0 rounded h-100 wow  public-notes-item" data-id="${id}">
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
                                                        <i class="fa fa-clock mx-1"></i>
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


    // live notes
    const socket = io();

    var swiper = new Swiper(".mySwiper", {
        slidesPerView: 1,
        spaceBetween: 10,
        freeMode: true,
        autoplay: {
            delay: 5000,
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },

        breakpoints: {
            640: {
                slidesPerView: 1,
                spaceBetween: 10,
            },
            768: {
                slidesPerView: 4,
                spaceBetween: 10,
            },
            1024: {
                slidesPerView: 4,
                spaceBetween: 10,
            },
        },
    });

    socket.on("liveNotes", data => {
        // $(".live-notes").html("");
        var array = Object.entries(data).map(function (entry) {
            key = entry[0];
            value = entry[1];

            nested_object = value;
            nested_object.key = key;

            return nested_object;
        });
        var products = [];
        var users = {};
        swiper.removeAllSlides();
        if (array.length !== 0) {

            $(".live-notes-section").removeClass("d-none");

            var unique_notes = array.filter((value, index, self) => self.findIndex((m) => m.product.product_id === value.product.product_id) === index);
            for (let i = 0; i < unique_notes.length; i++) {
                let product = unique_notes[i].product;
                let content = `
                <div class="swiper-slide p-1 h-100">
                    <a href="/notes/${product.product_id}">
                            <div class="card shadow border-0 rounded h-100  public-notes-item">
                                <div class="card-header border-0 bg-white">
                                    <p class="card-title"> ${product.name}</p>
                                </div>
                                <div class="card-body border-0 notes-thumbnails" style="background-image:url(${product.thumbnail.split(",")[0]})"></div>
                                <div class="card-footer border-0 bg-white">
                                    <div class="row">
                                        <div class="col-12">
                                            <a href="/profile/${product.user.userId}">
                                                <img class="user-image" width="20px" height="20px" src="${product.user.profileImage}" alt="${product.user.firstName} ${product.user.lastName} " />
                                            </a>
                                            <span class="card-text">
                                                <a class="mx-2 user-name-text" href="/profile/${product.user.userId}"> ${product.user.firstName} ${product.user.lastName} 
                                                </a>
                                            </span>
                                        </div>
                                        <div class="col-12">
                                            <p class="card-text notes-details-text"><span><i class="fa fa-globe mx-1"></i><small> ${product.views} views </small></span><span class="mx-1"><i class="fa fa-file mx-1"> </i><small>10 pages</small></span><span class="mx-1"><i class="fa fa-clock mx-1"></i><small>
                                            ${product.timestamp}
                                            </small></span></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </a>
                </div>
                `;
                swiper.appendSlide([content]);
            }
        } else {
            $(".live-notes-section").addClass("d-none");
        }
    });


});