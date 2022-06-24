$(document).ready(function () {
    if (localStorage.getItem("token") !== null) {
        const viewerid = JSON.parse(getCookie("token").split(".")[1]).userId;
        amplitude.getInstance().logEvent("collection view", {
            collection_id: window.location.pathname.split("/")[2],
            userid: viewerid
        });
    } else {
        amplitude.getInstance().logEvent("collection view", {
            collection_id: window.location.pathname.split("/")[2],
        });
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
    function setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
});

