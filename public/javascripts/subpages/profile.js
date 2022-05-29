$(document).ready(function () {
    const userid = window.location.pathname.split("/")[2];
    if (localStorage.getItem("token") !== null) {
        const viewerid = JSON.parse(atob(localStorage.getItem("token").split(".")[1])).userId;
        amplitude.getInstance().logEvent("view profile", {
            path: window.location.href,
            viewedBy: viewerid,
            profile: userid
        });
    } else {
        amplitude.getInstance().logEvent("view profile", {
            path: window.location.href,
            viewedBy: "Guest",
            profile: userid
        });
    }
    //  get uset public  notes 


    function loaduserpublicnotes() {
        $.ajax({
            type: "GET",
            url: localStorage.getItem("api") + "/products/users/" + userid,
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
                        let views = data.requested[i].product.views;
                        let id = data.requested[i].product.id;
                        let timestamp = timeDifference(data.requested[i].product.timestamp);
                        $(".public-now-row").append(`
                <div class="col-md-3 my-2"><a href="/notes/${id}">
             <div class="card shadow border-0 rounded h-100 wow animate__animated animate__fadeInUp public-notes-item" data-id="data-id">
                 <div class="card-header border-0">
                     <p class="card-title"> ${name} </p>
                 </div>
               <img src="${thumbnails}" class="card-img-top notes-thumbnails">
                 <div class="card-footer border-0">
                     <div class="row">
                         <div class="col-12">
                             <p class="card-text notes-details-text"><span><i class="fa fa-globe mx-1"></i><small>100 views</small></span><span class="mx-1"><i class="fa fa-file mx-1"> </i><small>${pages} pages</small></span><span class="mx-1"><i class="fa fa-clock-o mx-1"></i><small> ${timestamp}</small></span></p>
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
            url: localStorage.getItem("api") + "/collections/users/" + userid,
            beforeSend: function () {

            },
            headers: {
                Authorization: localStorage.getItem("token"),
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
                       <img src="${thumbnails.replace("https://s3.ap-south-1.amazonaws.com/thumbnails.notesocean.com", "https://thumbnails.ncdn.in/fit-in/300x300/filters:format(webp)/filters:quality(100)")}" class="collection-items-thumbnails">
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

    loadusercollection();
    loaduserpublicnotes();
});