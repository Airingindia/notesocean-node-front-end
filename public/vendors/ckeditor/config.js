DecoupledEditor
    .create(document.querySelector('#editor'), {
        // toolbar: [ 'heading', '|', 'bold', 'italic', 'link' , 'exportPdf', '|',]
    })
    .then(editor => {
        const toolbarContainer = document.querySelector('main .toolbar-container');

        toolbarContainer.prepend(editor.ui.view.toolbar.element);

        window.editor = editor;
    })
    .catch(err => {
        console.error(err.stack);
    });