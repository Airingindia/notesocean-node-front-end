$(document).ready(function () {
    const userid = window.location.pathname.split("/")[2];
    //  get uset public  notes 
    $.ajax({
        type: "GET",
        url: app.getApi() + "/products/users/" + userid,
        beforeSend: function () {
        },
        success: function (data) {
            $(".notes-loader").addClass("d-none");
            if (data.requested.length !== 0) {
                $(".public-now-row").html("");
                let  adshow = 0;
                for (let i = 0; i < data.requested.length; i++) {
                    adshow++;
                    if(adshow == 5){
                        adshow = 0;
                        $(".public-now-row").append(`
                        <div class="col-md-3 d-flex justify-content-center align-items-center">
                        <ins class="adsbygoogle"
                        style="display:inline-block;width:336px;height:280px"
                        data-ad-client="ca-pub-3834928493837917"
                        data-ad-slot="1394357315"></ins>
                        </div>`);
                        (adsbygoogle = window.adsbygoogle || []).push({});
                    }
                    let name = data.requested[i].name;
                    let pages = data.requested[i].pages;
                    let thumbnails = data.requested[i].thumbnails.replace("https://thumbnails.ncdn.in/", "https://thumbnails.ncdn.in/fit-in/400x400/");
                    let views = data.requested[i].views;
                    let id = data.requested[i].uuid;
                    let timestamp = timeDifference(data.requested[i].timestamp);
                    $(".public-now-row").append(`
            <div class="col-md-3 my-2"><a href="/notes/${id}">
         <div class="card shadow border-0 rounded h-100 wow animate__animated animate__fadeInUp public-notes-item" data-id="data-id">
             <div class="card-header border-0">
                 <p class="card-title"> ${name} </p>
             </div>
           <img src="${thumbnails}" class="card-img-top notes-thumbnails lozad " loading="lazy">
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
                text: "Somthing went wrong , please try after sometimes",
                timeout: 4000,
            }).show();
        }
    });

    $.ajax({
        type: "GET",
        url: app.getApi() + "/collections/users/" + userid,
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
                    let id = data.requested[i].uuid;
                    let totalProducts = data.requested[i].totalProducts;
                    let description = data.requested[i].description;
                    let timestamp = data.requested[i].timestamp;
                    let thumbnails = data.requested[i].thumbnails;
                    $(".collections-rows").append(`
                <li class="list-group-item collection-row-item rounded my-2 border-0"  data-id="${id}">
                    <a href="/collections/${id}">
                        <div class="collection-item-content">
                                <div class="collection-item-content-box "> 
                                    <div class="mb-3 mx-1 w-80"> ${name} </div> 
                                </div>
                                <div > 
                                    <small class="text-muted">  <i class="fa fa-file mx-1"></i>   ${totalProducts} Notes </small> 
                                    <br>
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
                text: "Somthing went wrong , please try after sometimes",
                timeout: 4000,
            }).show();
        }
    });

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
   
});