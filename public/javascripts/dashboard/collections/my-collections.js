$(document).ready(function () {
    // get users collections
    function getCollection() {
        $.ajax({
            type: "GET",
            url: localStorage.getItem("api") + "/collections",
            contentType: "application/json",
            processData: false,
            headers: {
                Authorization: localStorage.getItem("token")
            },
            success: function (data) {
                $(".loading-collections").css({ display: "none" });
                if (data.size !== 0) {
                    showCollection(data.requested.sort((a, b) => { return b.timestamp - a.timestamp }));
                    // console.log(data.requested.sort((a, b) => { return b.timestamp - a.timestamp })); sort data by time
                } else {
                    $(".no-collections").removeClass("d-none");
                }
            }, error: function (error) {
                console.log(error);
            }
        });
    }

    getCollection();

    function showCollection(colllections) {
        $(".collections-rows").html("");
        for (let i = 0; i < colllections.length; i++) {
            var productlength = ``;
            if (colllections[i].products !== undefined) {
                productlength = `<span class="badge bg-danger rounded-pill"> ${colllections[i].totalProducts}</span></li>`;
            }
            $(".collections-rows").append(`
                <li class="list-group-item  py-4 rounded my-2 shadow d-flex justify-content-between align-items-start border-0"  data-id="${colllections[i].id}" style="box-shadow:0px 0px 0px 0px #ccc">
                <a href="/dashboard/collections/${colllections[i].id}">
                <div class="ms-2 me-auto">
                    <div class="mb-3"> ${colllections[i].name} </div> 
                   
                    <span> 
                        <small class="text-muted">  <i class="fa fa-clock mx-1"></i> ${timeDifference(colllections[i].timestamp)}</small> 
                    </span>
                </div>
                </a>
               ${productlength}
                </li>
               
            `);
        }

        contextmenu();

    }
    // collection routes
    deleteCollection();


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
                    name: name.trim(),
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
                        if (!$(".no-collections").hasClass("d-none")) {
                            $(".no-collections").addClass("d-none");
                        }
                        data = JSON.parse(data);
                        $("button[type='submit']").html("Create");
                        $("button[type='submit']").prop("disabled", false);
                        swal("success", "Collection created", "success");
                        $(".create-collections-modal").modal("hide");

                        $(".collections-rows").prepend(`
                        <li class="list-group-item  py-4 rounded my-2 shadow d-flex justify-content-between align-items-start border-0" style="box-shadow:0px 0px 0px 0px #ccc">
                        <a href="/dashboard/collections/${data.id}">
                        <div class="ms-2 me-auto">
                            <div class="mb-3"> ${data.name} </div> 
                           
                            <span> 
                                <small class="text-muted">  <i class="fa fa-clock mx-1"></i>  ${timeDifference(data.timestamp)} </small> 
                            </span>
                        </div>
                        </a>
                        </li>
                       
                    `);

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

    function contextmenu() {
        $(".collections-rows .list-group-item").each(function () {
            $(this).on("contextmenu", function () {
                const id = $(this).attr("data-id");
                $(".collections-context-menu").modal("show");
                $("#delete-collections").attr("data-id", id);
                $("#edit-collections").attr("href", "/dashboard/collections/" + id);
                $("#preview-collections").attr("href", "/collections/" + id);
                return false;
            })
        })
    }


    function deleteCollection() {
        $("#delete-collections").click(function () {
            const collection_id = $(this).attr("data-id");
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
                            url: localStorage.getItem("api") + "/collections/" + collection_id,
                            contentType: "application/json",
                            processData: false,
                            headers: {
                                Authorization: localStorage.getItem("token")
                            },
                            beforeSend: function () {
                                $("#delete-collections").prop("disabled", true);
                                $("#delete-collections").html("Deleting...");
                            },
                            success: function (data) {
                                $("#delete-collections").prop("disabled", false);
                                $("#delete-collections").html("Delete");
                                $(".collections-rows").find(`.list-group-item[data-id="${collection_id}"]`).trigger("remove");
                                $(".collections-context-menu").modal("hide");
                            },
                            error: function (err) {
                                $("#delete-collections").prop("disabled", false);
                                $("#delete-collections").html("Delete");
                                swal("Error !, Somthing went wrong please try again after sometimes!", {
                                    icon: "error",
                                });
                                $(".collections-context-menu").modal("hide");
                            }
                        })

                    }
                });
        });
    }

});