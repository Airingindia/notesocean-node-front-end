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
                            <small class="isLocked"> 
                            ${isLocked ? `<i class="fa fa-lock"></i>` : `<i class="fa fa-unlock"></i>`}
                        
                            </small>
                            
                            <small class="isPublic mx-2">
                            ${isPublic ? `<i class="fa fa-globe"></i>` : `<i class="fa fa-user"></i>`}
                            
                            </small>
                            
                            <small class="createdAt mx-2"> <i class="fa fa-clock mx-1"></i>
                            <span>
                            ${moment(timestamp).format("D MMM Y")}
                        
                            </span>
                            </small>
                        </div>
                    </div>
                </a></li>
                    `)
                }
            },
            error: function (err) {
                app.alert(err.status, err?.responseJSON?.message ? err?.responseJSON?.message : "Something went wrong");
            }
        });
    }

    getAll();
})