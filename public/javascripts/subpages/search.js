$(document).ready(function () {
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

    // show ads each time the ins tags


   function showAds(){
    $(".ad_box").each(function () {
        if ($(window).width() < 960) {
            $(this).append(`<ins class="adsbygoogle"
            style="display:block"
            data-ad-format="fluid"
            data-ad-layout-key="-6t+ed+2i-1n-4w"
            data-ad-client="ca-pub-3834928493837917"
            data-ad-slot="7743309097"></ins>`);
        }
        else {
            $(this).append(`<ins class="adsbygoogle"
            style="display:block"
            data-ad-format="fluid"
            data-ad-layout-key="-fb+5w+4e-db+86"
            data-ad-client="ca-pub-3834928493837917"
            data-ad-slot="5268602269"></ins>`);
        }
        (adsbygoogle = window.adsbygoogle || []).push({});
    }); 
   }

   



   showAds();

    
})