
class notesocean {
    getApi() {
        return CryptoJS.enc.Base64.parse(decodeURIComponent(app.getCookie("api"))).toString(CryptoJS.enc.Utf8);
    }
    getToken() {
        return app.getCookie("token")
    }
    getCurrentUserid() {
        return JSON.parse(atob(decodeURIComponent(app.getCookie("token")).split(".")[1])).userUuid;
    }
    logout() {
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

    clearData() {
        localStorage.removeItem("token");
        localStorage.removeItem("userinfo");
        document.cookie = "token" + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    getSlefProducts() {
        return new Promise((resolve, reject) => {
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

    getUserEarning() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "GET",
                url: app.getApi() + "/earnings",
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

    getUserInfo() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "GET",
                url: app.getApi() + "/users/self",
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


    alert(status, message) {
        if (status === 200) {
            new Noty({
                type: "success",
                layout: "topRight",
                text: message,
                timeout: 2000
            }).show();
        }
        else if (status === 204) {
            new Noty({
                type: "success",
                layout: "topRight",
                text: message,
                timeout: 2000
            }).show();
        }
        else if (status === 401) {
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
                text: message,
                timeout: 2000
            }).show();
        } else if (status === 500) {
            new Noty({
                type: "error",
                layout: "topRight",
                text: "somthing went wrong!",
                timeout: 2000
            }).show();
        }
        else if (status === 400) {
            new Noty({
                type: "error",
                layout: "topRight",
                text: message,
                timeout: 2000
            }).show();
        }
        else if (status === 408) {
            new Noty({
                type: "error",
                layout: "topRight",
                text: "Request time out ! try again",
                timeout: 2000
            }).show();
        } else if (status === 503) {
            new Noty({
                type: "error",
                layout: "topRight",
                text: "Server is down ! try again later",
                timeout: 2000
            }).show();
        }
        else if (status === 502) {
            new Noty({
                type: "error",
                layout: "topRight",
                text: "Bad Gateway ! try again later",
                timeout: 2000
            }).show();
        } else if (status === 0) {
            window.location = "/no-internet";
            return false;
        }
        else {
            new Noty({
                type: "error",
                layout: "topRight",
                text: message,
                timeout: 2000
            }).show();
        }
    }

    getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
    setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    getTime = (previous) => {
        const current = Date.now();
        var msPerMinute = 60 * 1000;
        var msPerHour = msPerMinute * 60;
        var msPerDay = msPerHour * 24;
        var msPerMonth = msPerDay * 30;
        var msPerYear = msPerDay * 365;

        var elapsed = current - previous;

        if (elapsed < msPerMinute) {
            return Math.round(elapsed / 1000) + ' seconds ago';
        }

        else if (elapsed < msPerHour) {
            return Math.round(elapsed / msPerMinute) + ' minutes ago';
        }

        else if (elapsed < msPerDay) {
            return Math.round(elapsed / msPerHour) + ' hours ago';
        }

        else if (elapsed < msPerMonth) {
            return Math.round(elapsed / msPerDay) + ' days ago';
        }

        else if (elapsed < msPerYear) {
            return Math.round(elapsed / msPerMonth) + ' months ago';
        }

        else {
            return Math.round(elapsed / msPerYear) + ' years ago';
        }
    };

    // load user info if not stored in loaclstorage
    loadUserData = () => {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "GET",
                url: app.getApi() + "/users/self",
                headers: {
                    Authorization: app.getToken()
                },
                beforeSend: function () { },
                success: function (data) {
                    localStorage.setItem("userInfo", JSON.stringify(data));
                    resolve(data)
                },
                error: function (err) {
                    reject(err)
                    app.logout();
                    app.alert(400, "Failed to load your data , please login again")
                }
            })
        })
    }
}


const app = new notesocean();