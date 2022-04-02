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
                            <a href="${ad1.link}"> 
                                    <div class="card shadow border-0 rounded h-100 wow public-notes-item">
                                    <div class="card-header border-0 bg-white">
                                    <p class="card-title"> <span class="text-danger" style="font-weight:bold">Ad </span>  ${ad1.name.substring(0, 80)} </p>
                                    </div>
                                        <div class="card-body border-0 notes-thumbnails" style="background-image:url(${ad1.image});background-size:cover">
                                        </div>

                                    </div>
                            </a>
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

    var owl = $('.live-notes');

    $('.live-notes').owlCarousel({
        loop: false,
        margin: 10,
        nav: false,
        autoplay: true,
        autoWidth: true,
        autoHeight: true,
        items: 4,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 4
            },
            1000: {
                items: 4
            }
        }
    })

    socket.on("liveNotes", data => {
        for (let i = 0; i < $(".owl-item").length; i++) {
            $(".live-notes").trigger('remove.owl.carousel', [i]).trigger('refresh.owl.carousel');
        }
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
        if (array.length !== 0) {

            var unique_notes = array.filter((value, index, self) => self.findIndex((m) => m.product.product_id === value.product.product_id) === index);
            for (let i = 0; i < $(".owl-item").length; i++) {
                $(".live-notes").trigger('remove.owl.carousel', [i]).trigger('refresh.owl.carousel');
            }
            for (let i = 0; i < unique_notes.length; i++) {
                let product = unique_notes[i].product;
                let content = `
                <div class="py-1">
  <a href="/notes/">
        <div class="card shadow border-0 rounded h-100 wow public-notes-item">
            <div class="card-header border-0 bg-white">
                <p class="card-title"> ${product.name}</p>
            </div>
            <div class="card-body border-0 notes-thumbnails" style="background-image:url(${product.thumbnail.split(",")[0]})"></div>
            <div class="card-footer border-0 bg-white">
                <div class="row">
                    <div class="col-12 dflex justify-content-center"><a href="/profile/"><img class="user-image" src="https://s3.ap-south-1.amazonaws.com/profiles.notesocean.com/112/1648464247150_112.jpg" alt="user" /></a><span class="card-text"><a class="mx-2 user-name-text" href="/profile/">sachin kumar</a></span></div>
                    <div class="col-12">
                        <p class="card-text notes-details-text"><span><i class="fa fa-globe mx-1"></i><small>100 views</small></span><span class="mx-1"><i class="fa fa-file mx-1"> </i><small>10 pages</small></span><span class="mx-1"><i class="fa fa-clock mx-1"></i><small>1 hours ago</small></span></p>
                    </div>
                </div>
            </div>
        </div>
    </a>
  </div>
                `;
                $('.live-notes').owlCarousel().trigger('add.owl.carousel', [jQuery('<div class="owl-item">' + content + '</div>')]).trigger('refresh.owl.carousel');
            }
        }
    });


});