$(document).ready(function () {
    if (localStorage.getItem("token") !== null) {
        const viewerid = JSON.parse(atob(localStorage.getItem("token").split(".")[1])).userId;
        amplitude.getInstance().logEvent("collection view", {
            collection_id: window.location.pathname.split("/")[2],
            userid: viewerid
        });
    } else {
        amplitude.getInstance().logEvent("collection view", {
            collection_id: window.location.pathname.split("/")[2],
        });
    }
});

