$(document).ready(function () {
    $(window).scroll(function () {
        console.log("doc height", $(document).height());
        console.log("wind height", $(window).height());
        console.log("scroll top", $(window).scrollTop());
        let windowHeight = $(window).height();
        let scrollTop = $(window).scrollTop();
        let docHeight = $(document).height();
        console.log("win + scroll top", (windowHeight + scrollTop + 10).toFixed(0));
        if ((windowHeight + scrollTop + 1).toFixed(0) == docHeight.toFixed(0)) {
            // alert("okay");
        }
    });
})