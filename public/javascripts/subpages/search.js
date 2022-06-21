$(document).ready(function () {
    $("input").each(function () {
        $(this).val(window.location.search.split("?query=")[1].replace("+", " "));
    });
    // document.querySelector("input").value = window.location.search.split("?query=")[1];
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