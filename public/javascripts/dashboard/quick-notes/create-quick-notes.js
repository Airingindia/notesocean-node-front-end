$(document).ready(function () {
    hljs.configure({   // optionally configure hljs
        languages: ['javascript', 'ruby', 'python']
    });

    var quill = new Quill('#editor-container', {
        modules: {
            syntax: true,
            toolbar: [

                ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                ['blockquote', 'code-block'],
                [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
                [{ 'direction': 'rtl' }],                         // text direction

                [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown


                [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                [{ 'font': [] }],
                [{ 'align': [] }],

                ['clean']
            ]
        },
        placeholder: 'Write quick note here...',
        theme: 'snow' // or 'bubble'
    });

    // check if uuid  or new is present in url
    let uuid = window.location.pathname.split("/")[2];
    if (uuid != "new") {
        getData(uuid);
    }


    var saveTimer;
    quill.on('text-change', function (delta, oldDelta, source) {
        clearTimeout(saveTimer);
        var uuid = window.location.pathname.split("/")[2];
        saveTimer = setTimeout(function () {
            var note = quill.root.innerHTML;
            var title = $("#title").val();
            // check if title is empty
            if (uuid == "new") {
                create(title, note);
            } else {
                update(title, note, uuid);
            }
        }, 3000);
    });



    $("#title").on("change", function () {
        clearTimeout(saveTimer);
        saveTimer = setTimeout(function () {
            var note = quill.root.innerHTML;
            var title = $("#title").val();
            var uuid = window.location.pathname.split("/")[2];
            // check if title is empty
            if (title.trim() == "" || title.trim() == null || title.trim() == undefined || title.trim().length == 0) {
                title = "Untitled";
            }
            if (uuid == "new") {
                create(title, note);
            } else {
                update(title, note, uuid);
            }
        }, 3000);
    });


    $(".share-btn").click(function () {
        // share current url

        var url = window.location.href;
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val(url).select();
        document.execCommand("copy");
        $temp.remove();
        // app.alert(200, "Link copied to clipboard");
        $(".share-btn").html("Link Copied");
        setTimeout(function () {
            $(".share-btn").html(" <i class='fa fa-share mx-1'> </i> <span> Share </span>");
        }, 5000);
    })


    $(".save-btn").click(function () {
        var uuid = window.location.pathname.split("/")[2];
        let note = quill.root.innerHTML;
        let title = $("#title").val();
        if (uuid == "new") {
            create(title, note);
        } else {
            update(title, note, uuid);
        }

    });

    function savingChanges() {
        //   change background color of  .ql-toolbar
        $(".ql-toolbar").css({
            "background": "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.5) 100%) !important"
        });
    }

    function savedChanges() {
        //   change background color of  .ql-toolbar
        $(".ql-toolbar").css({
            "background": "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,1) 100%) !important"
        });
    }

    function create(title, note) {
        $.ajax({
            url: app.getApi() + "/instant-note",
            type: "POST",
            data: JSON.stringify({
                "title": title == "" || title == null ? null : title,
                "content": note
            }),
            headers: {
                Authorization: app.getToken()
            },
            contentType: "application/json",
            beforeSend: function (xhr) {
                savingChanges();
            },
            success: function (data) {
                savedChanges();
                console.log(data);
                let uuid = data.uuid;
                let title = data.title;
                // set title on page title
                document.title = title + " - Quick Notes";
                $("#title").val(title);
                // reaplce url with uuid of note where new note is created
                window.history.replaceState({}, document.title, "/quick-notes/" + uuid);
                app.alert(200, "Note created successfully");
            },
            error: function (err) {
                app.alert(200, err?.responseJSON?.message ? err?.responseJSON?.message : "Something went wrong");
            }
        });
    }

    function update(title, note, uuid) {
        $.ajax({
            url: app.getApi() + "/instant-note/" + uuid,
            type: "PUT",
            data: JSON.stringify({
                "title": title == "" || title == null ? null : title,
                "content": note
            }),
            contentType: "application/json",
            beforeSend: function (xhr) {

            },
            headers: {
                Authorization: app.getToken()
            },
            success: function (data) {
                // log status cod
                var uuid = data.uuid;
                var title = data.title;
                // set title on page title
                document.title = title + " - Quick Notes";
                $("#title").val(title);
                // reaplce url with uuid of note where new note is created
                window.history.replaceState({}, document.title, "/quick-notes/" + uuid);
                app.alert(200, "Note updated successfully");
            },
            error: function (err) {
                app.alert(err.status, err?.responseJSON?.message ? err?.responseJSON?.message : "Something went wrong");
            }

        });
    }

    function getData(uuid) {
        $.ajax({
            url: app.getApi() + "/instant-note/" + uuid,
            type: "GET",
            contentType: "application/json",
            success: function (data) {
                if (data == null || data == undefined) {
                    $(".editorView").addClass("d-none");
                    $(".notPublic").removeClass("d-none");
                } else {
                    $(".editorView").removeClass("d-none");
                    $(".notPublic").addClass("d-none");
                }
                var uuid = data.uuid;
                var title = data.title;
                var content = data.content;
                // set title on page title
                document.title = title + " - Quick Notes";

                // reaplce url with uuid of note where new note is created
                window.history.replaceState({}, document.title, "/quick-notes/" + uuid);

                // set title
                $("#title").val(title);

                // set content
                quill.root.innerHTML = content;

            },
            error: function (err) {
                app.alert(err.status, err?.responseJSON?.message ? err?.responseJSON?.message : "Something went wrong");
            }

        });
    }
})