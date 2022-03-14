$(document).ready(function () {
    // sherron init
    Shareon.init();
    // amplitude
    if (localStorage.getItem("token") !== null) {
        const viewerid = JSON.parse(atob(localStorage.getItem("token").split(".")[1])).userId;
        amplitude.getInstance().logEvent("product view", {
            collection_id: window.location.pathname.split("/")[2],
            userid: viewerid
        });
    } else {
        amplitude.getInstance().logEvent("product view", {
            collection_id: window.location.pathname.split("/")[2],
        });
    }

    // share btn

    $(".share-btn").click(function () {
        $(".share-modal").modal("show");
    })
});

