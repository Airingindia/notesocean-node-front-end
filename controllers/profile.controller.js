const httpServices = require("../services/http.services");
const getuserinfo = (userid) => {
    return new Promise((resolve, reject) => {
        httpServices.get("/users/" + userid).then((response) => {
            if (response.statusCode == 200) {
                resolve(response.body);
            } else {
                reject(response);
            }
        }).catch((error) => {
            reject(error);
        })
    })
}

const logout = (token) => {
    return new Promise((resolve, reject) => {
        httpServices.getWithAuth("/authenticate/logout", token).then((response) => {
            resolve(response);
        }).catch((err) => {
            reject(err);
        })
    })
}

const validateToken = (token) => {
    return new Promise((resolve, reject) => {
        httpServices.getWithAuth("/validate", token).then((response) => {
            resolve(response);
        }).catch((err) => {
            reject(err);
        })
    })
}

module.exports = {
    getInfo: getuserinfo,
    logout: logout,
    validateToken: validateToken
}