$(document).ready(function () {
    // get users collections
    function getCollections() {
        $.ajax({
            type: "GET",
            url: app.getApi() + "/collections",
            contentType: "application/json",
            processData: false,
            headers: {
                Authorization: getCookie("token")
            },
            success: function (data) {
                $(".loading-collections").css({ display: "none" });
                if (data.size !== 0) {
                    showCollection(data.requested.sort((a, b) => { return b.timestamp - a.timestamp }));
                } else {
                    $(".no-collections").removeClass("d-none");
                }
            }, error: function (error) {
                app.alert(err.status, err?.responseJSON?.message ? err?.responseJSON?.message : "Something went wrong");
                $(".loading-collections").css({ display: "none" });
                $(".no-collections").removeClass("d-none");
            }
        });
    }

    getCollections();



    function showCollection(colllections) {

        if (colllections.length === 0) {
            return false;
        }
        // $(".collections-rows").html("");
        for (let i = 0; i < colllections.length; i++) {

            $(".collections-rows").prepend(`
                <li class="list-group-item collection-row-item rounded my-2 shadow border-0 pt-3"  data-id="${colllections[i].uuid}" style="box-shadow:0px 0px 0px 0px #ccc">
                <a href="/dashboard/collections/${colllections[i].uuid}">
                <div class="collection-item-content">
                   <div class="collection-item-content-box"> 
                  
                   <div class="mb-3 mx-1"> 
                   <h5 class="text-notesocean"> ${colllections[i].name.substring(0, 100)} </h5>
                   <small class="text-muted"> ${colllections[i]?.description ? colllections[i].description.substring(0, 100) : ""} ${colllections[i].description?.length > 100 ? "..." : ""} </small>
                <div class="pt-2 collection-info-box">
                    <div>
                     
                    <small class="text-muted ">  <i class="fa fa-file mx-1"></i> ${colllections[i]?.totalProducts ? colllections[i].totalProducts : 0} Notes </small> 
                  
                 <small class="text-muted">  <i class="fa fa-clock mx-1"></i> ${timeDifference(colllections[i].timestamp)}</small> 
                    
                    </div>

                <div>
                <button class="btn btn-notesocean dark"> Edit </button>
                <button class="btn btn-notesocean delete-collections" data-id="${colllections[i].uuid}">Delete</button>

              

                </div>
                    
                    </div>

                    

                   </div> 
                   </div>

                  <div> 
                 

                  </div>
                    
                </div>
                </a>
             
                </li>
               
            `);
        }
        deleteCollection();


    }

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
                // const file = $("input[type='file']").prop("files")[0];
                // form.append("file", file);
                var collection_json = {
                    name: name.trim(),
                    description: description
                }
                // form.append("collections", collection_json);
                form.append("collections", new Blob([JSON.stringify(collection_json)], { type: "application/json" }));
                $.ajax({
                    type: "POST",
                    url: app.getApi() + "/collections",
                    headers: {
                        Authorization: getCookie("token")
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
                        new Noty({
                            theme: "sunset",
                            type: "success",
                            text: '<i class="fa fa-check-circle">  </i>  ' + name + " Collection Created ",
                            timeout: 4000,
                        }).show();
                        $(".create-collections-modal").modal("hide");


                        // <img src="${data.thumbnails}" class="collection-items-thumbnails">

                        //     $(".collections-rows").prepend(`
                        //     <li class="list-group-item  w-100 rounded my-2 shadow  border-0" data-id="${data.i}" style="box-shadow:0px 0px 0px 0px #ccc">
                        //     <a href="/dashboard/collections/${data.uuid}" class="w-100">
                        //         <div class="collection-item-content">
                        //             <div class="collection-item-content-box">
                        //                     <div class="mb-3 mx-1"> ${data.name} </div>
                        //             </div>

                        //             <div class=""> 
                        //             <small class="text-muted">  <i class="fa fa-file mx-1"> </i>  0 Notes </small> 
                        //                <br>
                        //             <small class="text-muted">  <i class="fa fa-clock mx-1"></i> ${timeDifference(data.timestamp)} </small> 

                        //             </div>
                        //         </div>
                        //     </a>

                        // </li>

                        // `);

                        let arrary = [];
                        arrary.push(data);
                        showCollection(arrary);

                    },
                    error: function (error) {
                        $("button[type='submit']").html("Create");
                        $("button[type='submit']").prop("disabled", false);
                        app.alert(err.status, err?.responseJSON?.message ? err?.responseJSON?.message : "Something went wrong");
                        $(".create-collections-modal").modal("hide");
                    }
                })

            } else {
                $('input[name="collectionName"]').addClass("is-invalid");
            }
        })
    };


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
        $(".delete-collections").each(function () {
            $(this).click(function () {
                const collection_id = $(this).attr("data-id");
                var btn = $(this);
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
                                url: app.getApi() + "/collections/" + collection_id,
                                contentType: "application/json",
                                processData: false,
                                headers: {
                                    Authorization: getCookie("token")
                                },
                                beforeSend: function () {
                                    $(btn).prop("disabled", true);
                                    $(btn).html("Deleting...");
                                },
                                success: function (data) {
                                    $(btn).prop("disabled", false);
                                    $(btn).html("Delete");
                                    $(".collections-rows").find(`.list-group-item[data-id="${collection_id}"]`).trigger("remove");
                                    $(".collections-context-menu").modal("hide");

                                    new Noty({
                                        theme: "sunset",
                                        type: "error",
                                        text: '<i class="fa fa-check-circle">  </i> Collection Deleted ',
                                        timeout: 4000,
                                    }).show();
                                },
                                error: function (err) {
                                    $("#delete-collections").prop("disabled", false);
                                    $("#delete-collections").html("Delete");
                                    app.alert(err.status, err?.responseJSON?.message ? err?.responseJSON?.message : "Something went wrong");
                                    $(".collections-context-menu").modal("hide");
                                }
                            })

                        }
                    });
                return false;
            });

        })

    }


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

    createCollection();

    // search collection
    function clearData() {
        $(".collections-rows").html("");
    }
    $("form.search-collection-form").submit(function (e) {
        e.preventDefault();
        const input = $("input[type='search']").val();
        if (input.length > 0) {
            $.ajax({
                type: "GET",
                url: app.getApi() + "/collections/self/search/" + input,
                headers: {
                    Authorization: app.getToken()
                },
                beforeSend: function () { },
                success: function (data) {

                    if (data.size == 0) {
                        new Noty({
                            theme: "sunset",
                            type: "error",
                            text: "No results found",
                            timeout: 4000,
                        }).show();
                    } else {
                        clearData();
                        showCollection(data.requested);
                        new Noty({
                            theme: "sunset",
                            type: "success",
                            text: "Found " + data.size + " results",
                            timeout: 4000,
                        }).show();
                    }


                },
                error: function (err) {
                    app.alert(err.status, err?.responseJSON?.message ? err?.responseJSON?.message : "Something went wrong");
                }
            })
        }

    });

    $(".search-input").on("search", function () {
        if ($(this).val() == "") {
            clearData();
            getCollections();
        }
    });




});