$(document).ready(function () {
    // get collection details
    const collection_id = window.location.pathname.split("/")[3];
    $.ajax({
        type: "GET",
        url: sessionStorage.getItem("api") + "/collections/" + collection_id,
        contentType: "application/json",
        processData: false,
        headers: {
            Authorization: localStorage.getItem("token")
        },
        success: function (data) {
            if (data !== undefined) {
                $(".notes-details-row").removeClass("d-none");
                $(".collection-removed").css({ display: "none" });

                $("title").html("Collection - " + data.name);
                $(".collection-title").html(data.name);

                if (data.notes !== null) {
                    total_notes = data.notes.length;
                } else {
                    total_notes = 0;
                }

                if (data.products !== null) {
                    total_products = data.products.length;
                } else {
                    total_products = 0;
                }

                let all_notes_count = total_notes + total_products
                $(".all_notes_count").html("Total Notes : " + all_notes_count);
                $(".total_private_notes").html("Total Private Notes : " + total_notes);
                $(".total_public_notes").html("Total Public Notes :" + total_products);
                deleteCollection();
            } else {
                $(".collection-removed").css({ display: "block" });
                $(".notes-details-row").addClass("d-none");
            }



        },
        error: function (err) {
            console.log(err);
        }
    });


    function deleteCollection() {
        $(".delete-collection").click(function () {
            swal({
                title: "Are you sure?",
                text: "Once deleted, you will not be able to recover this collection!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        $.ajax({
                            type: "DELETE",
                            url: sessionStorage.getItem("api") + "/collections/" + collection_id,
                            contentType: "application/json",
                            processData: false,
                            headers: {
                                Authorization: localStorage.getItem("token")
                            },
                            success: function (data) {
                                if (data.length !== 0) {
                                    swal("Success ! Your collection deleted succefully!", {
                                        icon: "success",
                                        button: "continue"
                                    }).then((function () {
                                        window.location = "/dashboard/collections";
                                    }));

                                } else {
                                    swal("Error !, Somthing went wrong please try again after sometimes!", {
                                        icon: "error",
                                    });
                                }
                            },
                            error: function (err) {
                                swal("Error !, Somthing went wrong please try again after sometimes!", {
                                    icon: "error",
                                });
                            }
                        })

                    }
                });
        });
    }


});