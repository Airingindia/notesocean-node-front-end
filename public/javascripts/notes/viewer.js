var myModal = new bootstrap.Modal(document.getElementById('adsModal'));
function showPdf() {
    document.addEventListener("adobe_dc_view_sdk.ready", function () {
        var adobeDCView = new AdobeDC.View({ clientId: document.querySelector("#pdfShow").getAttribute("data-client"), divId: "pdfShow" });
        let resultPromise = adobeDCView.previewFile(
            {
                content: { location: { url: document.querySelector("#pdfShow").getAttribute("data-url") } },
                metaData: { fileName: document.querySelector(" #pdfShow").getAttribute("data-name") }
            },
            {
                embedMode: "SIZED_CONTAINER",
                showDownloadPDF: false,
                showPrintPDF: false,
                enableLinearization: true,
                showAnnotationTools: false,
                enableFormFilling: false,
                hasReadOnlyAccess: true
            });
        resultPromise.then(adobeViewer => {
            adobeViewer.getAPIs().then(apis => {
                apis.getPDFMetadata()
                    .then(result => {
                        totalPages = result.numPages;
                        myModal.hide();
                    })
                    .catch(error => myModal.hide());
            }).catch(error => myModal.hide());
        });
    });
}



var width = $(window).width();
if ((width > 1024)) {
    myModal.show();
    (adsbygoogle = window.adsbygoogle || []).push({});
}
else {
    myModal.hide();
}

showPdf();
