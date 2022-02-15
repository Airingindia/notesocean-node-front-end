$(document).ready(function () {
    // get users collections
    $.ajax({
        type: "GET",
        url: sessionStorage.getItem("api") + "/collections",
        contentType: "application/json",
        processData: false,
        headers: {
            Authorization: localStorage.getItem("token")
        },
        success: function (data) {
            $(".my-colleaction-row").html("");
            $(".no-collections").css({ display: "none" });
            $(".loading-collections").css({ display: "none" });
            if (data.requested.length !== 0) {
                console.log(data.requested);
                for (let i = 0; i < data.requested.length; i++) {
                    let name = data.requested[i].name;
                    let notes = data.requested[i].notes;
                    let products = data.requested[i].products;
                    let id = data.requested[i].id;
                    if (notes !== null) {
                        notes = notes.length;
                    } else {
                        notes = 0;
                    }
                    if (products !== null) {
                        products = products.length;
                    } else {
                        products = 0;
                    }

                    $(".my-colleaction-row").append(`<div class="col-md-3 my-2">
                    <div class="card border-0 shadow collection-items" collection-route="${id}">
                        <div class="card-content"><img class="card-img-top" src="/images/dummy/collection2.png" />
                            <div class="card-body border-0">
                                <h6 class="collection-title"> ${name}</h6>
                                <p class="collection-private-notes"> <i class="fa fa-lock mx-1"></i><span>Private Notes : ${notes} </span></p>
                                <p class="collection-public-notes"> <i class="fa fa-users mx-1"></i><span>Public Notes : ${products} </span></p>
                            </div>
                        </div>
                    </div>
                </div>`);
                }

                collectionRoutes();
            } else {
                $(".no-collections").css({ display: "block" });
                console.log("user has no collections");
            }
        }, error: function (error) {
            console.log(error);
        }
    });

    // collection routes

    function collectionRoutes() {
        $(".collection-items").each(function () {
            $(this).click(function () {
                let id = $(this).attr("collection-route");
                window.location = "/dashboard/collections/" + id;
            });
        })
    }

});