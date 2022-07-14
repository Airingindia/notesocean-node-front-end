


// adb();

$(document).ready(function () {
    //  ad blocker code snippet credit: https://stackoverflow.com/questions/4869154/how-to-detect-adblock-on-my-website
    async function detectAdBlock() {
        let adBlockEnabled = false
        const googleAdUrl = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
        try {
            await fetch(new Request(googleAdUrl)).catch(_ => adBlockEnabled = true)
        } catch (e) {
            adBlockEnabled = true;
        } finally {
            if (adBlockEnabled) {
                if (window.location.pathname.indexOf("dashboard") == 1) {
                    document.querySelector(".second-side").innerHTML = `
                <div class="text-center" style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:100%">
                <h1 class="text-danger"> <i class="fa fa-info-circle text-dager"> </i> Opps! </h1>
                <h2  class="text-danger"> Failed to Connect Server </h2>
                        <p> Your Adblocker or third app party are blocking the request 
                        <br>
                        They can intercept your browsing data , please remove that application or try diffrent browser </p>
                </div>
               `;
                } else {
                    document.querySelector(".main-section").remove();
                    document.querySelector(".ad-blocker-detected").classList.remove("d-none");
                }
            }
        }
    }
    //  ad blocker snippet - https://www.geeksforgeeks.org/how-to-detect-adblocker-using-javascript/
    function adb() {
        let fakeAd = document.createElement("div");
        fakeAd.className = "textads banner-ads banner_ads ad-unit ad-zone ad-space adsbox"

        fakeAd.style.height = "1px"

        document.body.appendChild(fakeAd)

        let x_width = fakeAd.offsetHeight;
        let msg = document.getElementById("msg")


        if (x_width) {
            detectAdBlock();
        } else {
            if (window.location.pathname.indexOf("dashboard") == 1) {
                document.querySelector(".second-side").innerHTML = `
            <div class="text-center" style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:100%">
                    <h1 class="text-danger"> <i class="fa fa-info-circle text-dager"> </i> Opps! </h1>
                    <h2  class="text-danger"> Failed to Connect Server </h2>
                    <p> Your Adblocker or third app party blocking request 
                    <br>
                    They can intercept your files , please remove that application or try diffrent browser </p>
                    
            </div>
           `;
            } else {
                document.querySelector(".main-section").remove();
                document.querySelector(".ad-blocker-detected").classList.remove("d-none");
            }

        }
    }
    detectAdBlock();
});
