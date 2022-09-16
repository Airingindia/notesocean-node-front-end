class notesocean{
    getApi(){
        return CryptoJS.enc.Base64.parse(decodeURIComponent(getCookie("api"))).toString(CryptoJS.enc.Utf8);
    }
    getToken(){
        return getCookie("token")
    }
    getCurrentUserid(){
        return JSON.parse(atob(decodeURIComponent(getCookie("token")).split(".")[1])).userUuid;
    }
    logout(){
        $.ajax({
            type: "GET",
            url: app.getApi() + "/authenticate/logout",
            headers: {
                Authorization: app.getToken(),
            },
            success: function (data) {
                app.clearData();
                window.location = "/login";
            },
            error: function (err) {
                app.clearData();
                window.location = "/login";
            }
        });
    }

    clearData(){
        localStorage.removeItem("token");
        localStorage.removeItem("userinfo");
        document.cookie = "token" + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    getSlefProducts(){
       return new Promise((resolve,reject)=>{
           $.ajax({
               type: "GET",
               url: app.getApi() + "/products",
               headers: {
                   Authorization: app.getToken(),
               },
               success: function (data) {
                resolve(data);
               },
               error: function (err) {
                  reject(err);
               }
           });
       })
    }


    alert(status,message){
        if(status === 200){
            new Noty({
                type: "success",
                layout: "topRight",
                text: message,
                timeout: 2000
        }).show();
        }
        else if(status === 204){
            new Noty({
                type: "success",
                layout: "topRight",
                text: message,
                timeout: 2000
        }).show();
        }
        else if(status === 401){
            new Noty({
                    type: "error",
                    layout: "topRight",
                    text: "Logging out...",
                    timeout: 2000
            }).show();
          window.location.href = "/session-expire";
        } 
        else if (status === 404) {
                new Noty({
                    type: "error",
                    layout: "topRight",
                    text:message,
                    timeout: 2000
                }).show();
        }else if(status === 500){
                new Noty({
                    type: "error",
                    layout: "topRight",
                    text: "somthing went wrong!",
                    timeout: 2000
                }).show();
        }
        else if(status === 400){
                new Noty({
                    type: "error",
                    layout: "topRight",
                    text: message,
                    timeout: 2000
                }).show();
        }
        else if(status === 408 ){
                new Noty({
                    type: "error",
                    layout: "topRight",
                    text: "Request time out ! try again", 
                    timeout: 2000
                }).show();
        }else if(status === 503){
                new Noty({
                    type: "error",
                    layout: "topRight",
                    text: "Server is down ! try again later", 
                    timeout: 2000
                }).show();
        }
        else if(status === 502){
                new Noty({
                    type: "error",
                    layout: "topRight",
                    text: "Bad Gateway ! try again later", 
                    timeout: 2000
                }).show();
        }else if(status ===0){
                new Noty({
                    type: "error",
                    layout: "topRight",
                    text: "Network Error ! try again later", 
                    timeout: 2000
                }).show();
        }
        else{
            new Noty({
                type: "error",
                layout: "topRight",
                text: message,
                timeout: 2000
            }).show();
        }
    }
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
const app = new notesocean();