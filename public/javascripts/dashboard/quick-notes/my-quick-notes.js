$(document).ready(function () {
    // get all quick notes
    function encodeHTMLEntities(text) {
        return $("<textarea/>").text(text).html();
    }
    function getAll() {
        $.ajax({
            url: app.getApi() + "/instant-note/user/" + app.getCurrentUserid(),
            type: "GET",
            headers: {
                Authorization: app.getToken()
            },
            success: function (data) {
                var totalNotes = data?.numberOfElements ? data?.numberOfElements : 0;
                $(".total-notes").html(totalNotes);
                var notes = data?.content ? data?.content : [];
                show(notes);
            },
            error: function (err) {
                app.alert(err.status, err?.responseJSON?.message ? err?.responseJSON?.message : "Something went wrong");
            }
        });
    }

    getAll();

    function show(notes) {
        for (let i = 0; i < notes.length; i++) {
            let uuid = notes[i].uuid;
            let timestamp = notes[i].timestamp;
            let isPublic = notes[i].isPublic;
            let isLocked = notes[i].isLocked;
            let size = notes[i].size;
            let title = notes[i].title;
            let content = notes[i].content;
            $(".notes-list").append(`
            <li class="list-group-item shadow my-2 border-0"><a class="text-dark" href="/quick-notes/${uuid}" style="text-decoration:none">
            <div class="d-flex justify-content-start justify-content-lg-between align-items-start align-items-lg-center flex-lg-row flex-column">
                <div class="d-flex flex-column">
                    <h6 class="list-group-item-heading">
                    ${encodeHTMLEntities(title)}
                    </h6>
                    <small class="text-muted"> ${content}  </small>
                </div>
           

                <div class="d-flex justify-content-start justify-lg-content-center align-items-start align-lg-items-center text-muted my-2 my-lg-0">
                    <small class="isLocked" data-id="${uuid}" data-locked="${isLocked}"> 
                    ${isLocked ? `<i class="fa fa-lock" title="Locked , click to change"></i>` : `<i class="fa fa-unlock" title="Unlocked , click to change" ></i>`}
                
                    </small>
                    
                    <small class="isPublic mx-2" data-id="${uuid}" data-public="${isPublic}">
                    ${isPublic ? `<i class="fa fa-globe text-info" title="Note is Public , click to change"></i>` : `<i class="fa fa-user" title="Note is Private , click to change"></i>`}
                    
                    </small>

                   

                    <small class="deleteNote mx-2" data-id="${uuid}">
                    <i class="fa fa-trash text-danger" title="Delete Note"></i>
                    </small>
                    
                    <small class="createdAt mx-2"> <i class="fa fa-clock mx-1"></i>
                    <span>
                    ${moment(timestamp).format("D MMM Y")}
                
                    </span>
                    </small>
                </div>
            </div>
        </a></li>
            `);
        }

        statusChange();
    };


    function statusChange() {
        $(".isLocked").each(function () {
            $(this).click(function () {
                let btn = $(this);
                let uuid = $(this).attr("data-id");
                let isLocked = $(this).attr("data-locked");
                isLocked = isLocked == "true" ? "unlock" : "lock";
                changeLockStatus(uuid, isLocked).then((data) => {
                    // change the icon
                    if (isLocked == "lock") {
                        $(btn).html(`<i class="fa fa-lock" title="Locked , click to change"></i>`);
                        $(btn).attr("data-locked", true);
                    } else {
                        $(btn).html(`<i class="fa fa-unlock" title="Unlocked , click to change" ></i>`);
                        $(btn).attr("data-locked", false);
                    }
                }).catch((err) => {
                    $(btn).html(`<i class="fa fa-unlock" title="Unlocked , click to change" ></i>`);
                    $(btn).attr("data-locked", false);
                });
                return false;
            })
        });

        $(".isPublic").each(function () {
            $(this).click(function () {
                let btn = $(this);
                let uuid = $(this).attr("data-id");
                let isPublic = $(this).attr("data-public");
                isPublic = isPublic == "true" ? "private" : "public";
                changePublicStatus(uuid, isPublic).then((data) => {
                    // change the icon
                    if (isPublic == "public") {
                        $(btn).html(`<i class="fa fa-globe" title="Note is Public , click to change"></i>`);
                        $(btn).attr("data-public", true);
                    } else {
                        $(btn).html(`<i class="fa fa-user" title="Note is Private , click to change"></i>`);
                        $(btn).attr("data-public", false);
                    }
                }).catch((err) => {
                    $(btn).html(`<i class="fa fa-user" title="Note is Private , click to change"></i>`);
                    $(btn).attr("data-public", false);
                });
                return false;
            })
        });

        $("small.deleteNote").each(function () {
            $(this).click(function () {
                let btn = $(this);
                let uuid = $(this).attr("data-id");
                DeleteNote(uuid).then((data) => {
                    // change the icon
                    $(btn).parent().parent().parent().parent().remove();
                }).catch((err) => {
                    app.alert(err.status, err?.responseJSON?.message ? err?.responseJSON?.message : "Something went wrong");
                });
                return false;
            })
        })
    }


    function changeLockStatus(uuid, isLocked) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: app.getApi() + "/instant-note/" + uuid + "/" + "lock",
                type: "PUT",
                headers: {
                    Authorization: app.getToken()
                },
                success: function (data) {
                    resolve(data);
                    app.alert(200, "Note  " + isLocked + "ed successfully");
                },
                error: function (err) {
                    reject(err);
                    app.alert(err.status, err?.responseJSON?.message ? err?.responseJSON?.message : "Something went wrong");
                }
            });
        })

    };

    function changePublicStatus(uuid, isPublic) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: app.getApi() + "/instant-note/" + uuid + "/" + "public",
                type: "PUT",
                headers: {
                    Authorization: app.getToken()
                },
                success: function (data) {
                    resolve(data);
                    app.alert(200, "Note changed to " + isPublic + " successfully");
                },
                error: function (err) {
                    reject(err);
                    app.alert(err.status, err?.responseJSON?.message ? err?.responseJSON?.message : "Something went wrong");
                }
            });
        })

    };


    function DeleteNote(uuid) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: app.getApi() + "/instant-note/" + uuid,
                type: "DELETE",
                headers: {
                    Authorization: app.getToken()
                },
                success: function (data) {
                    resolve(data);
                    app.alert(200, "Note deleted successfully");
                },
                error: function (err) {
                    reject(err);
                    app.alert(err.status, err?.responseJSON?.message ? err?.responseJSON?.message : "Something went wrong");
                }
            });
        })
    }
})