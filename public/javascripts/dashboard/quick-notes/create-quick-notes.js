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

                [{ 'header': 1 }, { 'header': 2 }],               // custom button values
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                // superscript/subscript
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
})