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

module.exports = {
    getInfo: getuserinfo
}