$(document).ready(function () {
    // get users collections
    function getCollection() {
        $.ajax({
            type: "GET",
            url: atob(getCookie("api")) + "/collections",
            contentType: "application/json",
            processData: false,
            headers: {
                Authorization: getCookie("token")
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



    function showCollection(colllections) {
        $(".collections-rows").html("");

        for (let i = 0; i < colllections.length; i++) {
            var productlength = 0;
            if (colllections[i].products !== undefined) {
                productlength = colllections[i].totalProducts;
            }

            $(".collections-rows").append(`
                <li class="list-group-item collection-row-item rounded my-2 shadow   border-0"  data-id="${colllections[i].id}" style="box-shadow:0px 0px 0px 0px #ccc">
                <a href="/dashboard/collections/${colllections[i].id}">
                <div class="collection-item-content">
                   <div class="collection-item-content-box "> 
                  
                   <div class="mb-3 mx-1"> ${colllections[i].name} </div> 
                   </div>

                  <div> 
                  <small class="text-muted">  <i class="fa fa-file mx-1"></i>   ${productlength} Notes </small> 
                     
                  <small class="text-muted">  <i class="fa fa-clock mx-1"></i> ${timeDifference(colllections[i].timestamp)}</small> 

                  </div>
                    
                </div>
                </a>
             
                </li>
               
            `);
        }

        contextmenu();

    }

    // <img src="${colllections[i].thumbnails.replace("https://s3.ap-south-1.amazonaws.com/thumbnails.notesocean.com", "https://thumbnails.ncdn.in/fit-in/300x300/filters:format(webp)/filters:quality(100)")}" class="collection-items-thumbnails">
    // collection routes



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
                    url: atob(getCookie("api")) + "/collections",
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

                        $(".collections-rows").prepend(`
                        <li class="list-group-item  w-100 rounded my-2 shadow  border-0" data-id="${data.i}" style="box-shadow:0px 0px 0px 0px #ccc">
                        <a href="/dashboard/collections/${data.id}" class="w-100">
                            <div class="collection-item-content">
                                <div class="collection-item-content-box">
                                        <div class="mb-3 mx-1"> ${data.name} </div>
                                </div>

                                <div> 
                                <small class="text-muted">  <i class="fa fa-file mx-1"></i>  0 Notes </small> 
                                   
                                <small class="text-muted">  <i class="fa fa-clock mx-1"></i> ${timeDifference(data.timestamp)} </small> 
              
                                </div>

                                

                            </div>
                        </a>
                       
                    </li>
                       
                    `);

                    },
                    error: function (error) {
                        $("button[type='submit']").html("Create");
                        $("button[type='submit']").prop("disabled", false);
                        new Noty({
                            theme: "nest",
                            type: "error",
                            text: '<i class="fa fa-check-circle">  </i>  ' + name + " : Failed to create collection",
                            timeout: 4000,
                        }).show();
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
                            url: atob(getCookie("api")) + "/collections/" + collection_id,
                            contentType: "application/json",
                            processData: false,
                            headers: {
                                Authorization: getCookie("token")
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
                                new Noty({
                                    theme: "sunset",
                                    type: "error",
                                    text: '<i class="fa fa-check-circle">  </i> Failed to delete collection',
                                    timeout: 4000,
                                }).show();
                                $(".collections-context-menu").modal("hide");
                            }
                        })

                    }
                });
        });
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
    window.onload = function () {

        createCollection();
        deleteCollection();
        getCollection();
    }


});