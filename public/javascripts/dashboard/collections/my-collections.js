$(document).ready(function () {
    // get users collections
    $.ajax({
        type: "GET",
        url: localStorage.getItem("api") + "/collections",
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
                    let products = data.requested[i].totalProducts;
                    let id = data.requested[i].id;
                    let thumbnails = data.requested[i].thumbnails;
                    // if (notes !== null) {
                    //     notes = notes.length;
                    // } else {
                    //     notes = 0;
                    // }
                    // if (products !== null) {
                    //     products = products.length;
                    // } else {
                    //     products = 0;
                    // }

                    $(".my-colleaction-row").append(`<div class="col-md-3 my-2">
                    <div class="card h-100 border-0 shadow collection-items rounded" collection-route="${id}">
                        
                            <img class="card-img-top h-75" src="${thumbnails}" />
                            <div class="card-body border-0 ">
                                <h6 class="collection-title"> ${name}</h6>
                            </div>
                            <div class="card-footer bg-white border-0">
                                <p class="collection-public-notes"> 
                                    <i class="fa fa-users mx-1"></i>
                                    <span>Public Notes : ${products} </span>
                                </p> 
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
    };



    function createCollection() {
        $(".create-collection-btn").click(function () {
            $(".create-collections-modal").modal("show");
        });

        $("form").submit(function (event) {
            event.preventDefault();
            let name = $('input[name="collectionName"]').val();
            let description = $('textarea[name="collectionDescription"]').val();
            if (name.length !== 0) {
                $('input[name="collectionName"]').removeClass("is-invalid");
                var form = new FormData();
                var collection_json = {
                    name: name,
                    description: description
                }
                // form.append("collections", collection_json);
                form.append("collections", new Blob([JSON.stringify(collection_json)], { type: "application/json" }));
                $.ajax({
                    type: "POST",
                    url: localStorage.getItem("api") + "/collections",
                    headers: {
                        Authorization: localStorage.getItem("token")
                    },
                    processData: false,
                    contentType: false,
                    mimeType: "multipart/form-data",
                    data: form,
                    beforeSend: function () {
                        $("button[type='submit']").html("Creating...");
                        $("button[type='submit']").prop("disabled", true);
                    },
                    success: function (data) {
                        $("button[type='submit']").html("Create");
                        $("button[type='submit']").prop("disabled", false);
                        swal("success", "Collection created", "success");
                        $(".create-collections-modal").modal("hide");
                    },
                    error: function (error) {
                        $("button[type='submit']").html("Create");
                        $("button[type='submit']").prop("disabled", false);
                        swal("error", "Collection  not created", "error");
                        $(".create-collections-modal").modal("hide");
                    }
                })

            } else {
                $('input[name="collectionName"]').addClass("is-invalid");
            }
        })
    };
    createCollection();

});