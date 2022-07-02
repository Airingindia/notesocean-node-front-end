$(document).ready(function () {
    // document.querySelector("input").value = window.location.search.split("?query=")[1];
    if (getCookie("token") !== undefined) {
        const viewerid = JSON.parse(atob(getCookie("token").split(".")[1])).userId;
        amplitude.getInstance().logEvent("search", {
            query: window.location.search.split("?query=")[1],
            userid: viewerid
        });
    } else {
        amplitude.getInstance().logEvent("search", {
            query: window.location.search.split("?query=")[1]
        });
    };

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
    };

    function filter() {
        $("#modal-filter input").each(function () {
            $(this).click(function () {
                let name = $(this).attr("name");
                let value = $(this).attr("value")
                const url = new URL(window.location);
                url.searchParams.set(name, value);
                window.history.pushState({}, '', url);
                window.location = window.location.href;
            })
        })
    }

    filter();
})