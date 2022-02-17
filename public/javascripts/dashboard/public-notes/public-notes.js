$(document).ready(function () {
    // get user public notes
    $.ajax({
        type: "GET",
        url: sessionStorage.getItem("api") + "/products",
        contentType: "application/json",
        processData: false,
        headers: {
            Authorization: localStorage.getItem("token")
        },
        success: function (data) {
            if (data.requestedProducts.length !== 0) {
                $(".public-notes-container").html("");
                $(".loading-public-notes").addClass("d-none");
                $(".public-notes-container").removeClass("d-none");
                $(".no-public-notes").addClass("d-none");
                for (let i = 0; i < data.requestedProducts.length; i++) {
                    let id = data.requestedProducts[i].id;
                    let name = data.requestedProducts[i].name;
                    let timestamp = data.requestedProducts[i].timestamp;
                    // let description = data.requestedProducts[i].description;
                    let thumbnails = data.requestedProducts[i].thumbnails;
                    timestamp = timeDifference(timestamp);
                    $(".public-notes-container").append(`
                    <div class="row shadow rounded my-3 p-2 public-notes-item" data-route="${id}">
    <div class="col-md-1">
        <center><img class="w-100" src="${thumbnails.split(",")[0]}" /></center>
    </div>
    <div class="col-md-7 d-flex align-items-center">
        <div>
            <h6> ${name}</h6>
            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maxime porro adipisci sint voluptas voluptatum, minus harum eius exercitationem quam fugiat.</p>
        </div>
    </div>
    <div class="col-md-2 d-flex align-items-center">
        <h6> ${timestamp}</h6>
    </div>
</div>
                    `);
                }
                publicNotesRoute();
            } else {
                $(".loading-public-notes").addClass("d-none");
                $(".public-notes-container").addClass("d-none");
                $(".no-public-notes").removeClass("d-none");
            }
        },
        error: function (err) {
            $(".loading-public-notes").addClass("d-none");
            $(".public-notes-container").addClass("d-none");
            $(".no-public-notes").removeClass("d-none");
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

    function publicNotesRoute() {
        $(".public-notes-item").each(function () {
            $(this).click(function () {
                let id = $(this).attr("data-route");
                window.location = "/dashboard/public-notes/" + id;
            })
        })
    }
});