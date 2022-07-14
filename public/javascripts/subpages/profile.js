$(document).ready(function () {
    const userid = window.location.pathname.split("/")[2];
    //  get uset public  notes 
    function loaduserpublicnotes() {
        $.ajax({
            type: "GET",
            url: atob(getCookie("api")) + "/products/users/" + userid,
            beforeSend: function () {
            },
            success: function (data) {
                $(".notes-loader").addClass("d-none");
                if (data.requested.length !== 0) {
                    $(".public-now-row").html("");
                    for (let i = 0; i < data.requested.length; i++) {
                        let name = data.requested[i].product.name;
                        let pages = data.requested[i].product.pages;
                        let thumbnails = data.requested[i].product.thumbnails.replace("https://s3.ap-south-1.amazonaws.com/thumbnails.notesocean.com", "https://thumbnails.ncdn.in/fit-in/350x250/filters:format(webp)/filters:quality(100)").split(",")[0];

                        let img1 = data.requested[i].product.thumbnails.replace("https://s3.ap-south-1.amazonaws.com/thumbnails.notesocean.com", "https://thumbnails.ncdn.in/fit-in/320x240/filters:format(webp)/filters:quality(100)").split(",")[0];

                        let img2 = data.requested[i].product.thumbnails.replace("https://s3.ap-south-1.amazonaws.com/thumbnails.notesocean.com", "https://thumbnails.ncdn.in/fit-in/480x360/filters:format(webp)/filters:quality(100)").split(",")[0];

                        let img3 = data.requested[i].product.thumbnails.replace("https://s3.ap-south-1.amazonaws.com/thumbnails.notesocean.com", "https://thumbnails.ncdn.in/fit-in/800x480/filters:format(webp)/filters:quality(100)").split(",")[0];

                        let views = data.requested[i].product.views;
                        let id = data.requested[i].product.id;
                        let timestamp = timeDifference(data.requested[i].product.timestamp);
                        $(".public-now-row").append(`
                <div class="col-md-3 my-2"><a href="/notes/${id}">
             <div class="card shadow border-0 rounded h-100 wow animate__animated animate__fadeInUp public-notes-item" data-id="data-id">
                 <div class="card-header border-0">
                     <p class="card-title"> ${name} </p>
                 </div>
               <img src="${thumbnails}" class="card-img-top notes-thumbnails lozad " loading="lazy" srcset="${img1} 320w,${img2} 480w,${img3} 800w",sizes="(max-width: 320px) 280px,(max-width: 480px) 440px,800px">
                 <div class="card-footer border-0">
                     <div class="row">
                         <div class="col-12">
                             <p class="card-text notes-details-text"><span><i class="fa fa-globe mx-1"></i><small> ${views} views</small></span><span class="mx-1"><i class="fa fa-file mx-1"> </i><small>${pages} pages</small></span><span class="mx-1"><i class="fa fa-clock-o mx-1"></i><small> ${timestamp}</small></span></p>
                         </div>
                     </div>
                 </div>
             </div>
         </a></div>
                `);
                    }
                } else {
                    $(".no-public-notes").removeClass("d-none");
                }
            },
            error: function () {
                new Noty({
                    theme: "sunset",
                    type: "error",
                    text: "Failed to connect  server , please try after sometimes",
                    timeout: 4000,
                }).show();
            }
        });
    }

    function loadusercollection() {
        $.ajax({
            type: "GET",
            url: atob(getCookie("api")) + "/collections/users/" + userid,
            beforeSend: function () {

            },
            headers: {
                Authorization: getCookie("token"),
            },
            success: function (data) {
                $(".collection-loader").addClass("d-none");
                if (data.requested.length !== 0) {
                    $(".collections-rows").html("");
                    for (let i = 0; i < data.requested.length; i++) {
                        let name = data.requested[i].name;
                        let id = data.requested[i].id;
                        let totalProducts = data.requested[i].totalProducts;
                        let description = data.requested[i].description;
                        let timestamp = data.requested[i].timestamp;
                        let thumbnails = data.requested[i].thumbnails;
                        $(".collections-rows").append(`
                    <li class="list-group-item collection-row-item rounded my-2 shadow   border-0"  data-id="${id}" style="box-shadow:0px 0px 0px 0px #ccc">
                    <a href="/collections/${id}">
                    <div class="collection-item-content">
                       <div class="collection-item-content-box "> 
                       
                       <div class="mb-3 mx-1"> ${name} </div> 
                       </div>
    
                      <div> 
                      <small class="text-muted">  <i class="fa fa-file mx-1"></i>   ${totalProducts} Notes </small> 
    
                      <small class="text-muted">  <i class="fa fa-clock mx-1"></i> ${timeDifference(timestamp)}</small> 
    
                      </div>
    
                    </div>
                    </a>
    
                    </li>
    
                `);
                        // <img src="${thumbnails.replace("https://s3.ap-south-1.amazonaws.com/thumbnails.notesocean.com", "https://thumbnails.ncdn.in/fit-in/300x300/filters:format(webp)/filters:quality(100)")}" class="collection-items-thumbnails">
                    }

                } else {
                    $(".no-public-collection").removeClass("d-none");
                }
            },
            error: function () {
                new Noty({
                    theme: "sunset",
                    type: "error",
                    text: "Failed to connect  server , please try after sometimes",
                    timeout: 4000,
                }).show();
            }
        });
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

    window.onload = function () {
        loadusercollection();
        loaduserpublicnotes();
    }
});