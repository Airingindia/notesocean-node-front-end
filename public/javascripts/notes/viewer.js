$(document).ready(function () {
    if ($("#pdfShow").hasClass("active")) {
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
                }
            );

            // end previewFile

            // resultPromise.then(adobeViewer => {
            //     adobeViewer.getAPIs().then(apis => {
            //         apis.getPDFMetadata()
            //             .then((metadata) => {
            //                 $(".ads-box").remove();
            //             })
            //             .catch(() => {
            //                 $(".ads-box").remove();
            //             });
            //     }).catch((error) => {
            //         $(".ads-box").remove();
            //     });
            // });
        });
    };
});