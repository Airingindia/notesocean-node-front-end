$(document).ready(function () {
    const socket = io();
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
            console.log(livenotescount);
            if (livenotescount > 0) {
                var unique_notes = array.filter((value, index, self) => self.findIndex((m) => m.product.product_id === value.product.product_id) === index);
                var count = 0;
                for (let i = 0; i < unique_notes.length; i++) {
                    let cont = $(".skeleton-live-loader")[i];
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
                    let content = `
                    <div class="card border-0">
                    <div class="card-header">
                      <a href="/notes/${product_id}"> ${name} </a>
                    </div>
                    <div class="card-body p-0">
                    <a href="/notes/${product_id}">  <img src="${thumbnail}" alt="" style="width:100%;height:200px"/> </a>
                    </div>
                    <div class="card-footer">
                      <div class="notes-profile-cont">
                       <a href="/profile/${userId}">  <img src="${profileImage}" alt="" style="width:30px;height:30px;border-radius:50% "/> </a>
                      </div>
                      <div class="user-name-cont px-1">
                       <a href="/profile/${userId}"> ${firstName} ${lastName} </a>
                      </div>
                      <div class="notes-cont-info d-flex justify-content-between align-items-center text-muted">
                        <small> <i class="fa fa-globe mx-1 ">  </i>  <span> ${views} views  </span> </small>
                       <small>   <i class="fa fa-file mx-1 ">  </i> <span> ${pages} pages  </span> </small>
                        <small> <i class="fa fa-clock mx-1 ">   </i>  <span> ${timestamp} </span> </small>
                      </div>
                    </div>
                  </div>
                `;
                    if (count < 8) {
                        $(cont).html("");
                        $(cont).html(content);
                        $(cont).addClass("filled");
                    }

                }
            } else {
                $(".live-reading").addClass("d-none");
                $(".live-reading .row").html("");
            }
        }

    });


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
});  