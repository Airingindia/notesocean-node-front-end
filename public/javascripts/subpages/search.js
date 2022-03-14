$(document).ready(function () {
    if (localStorage.getItem("token") !== null) {
        const viewerid = JSON.parse(atob(localStorage.getItem("token").split(".")[1])).userId;
        amplitude.getInstance().logEvent("search", {
            query: window.location.search.split("?query=")[1],
            userid: viewerid
        });
    } else {
        amplitude.getInstance().logEvent("search", {
            query: window.location.search.split("?query=")[1]
        });
    };
})