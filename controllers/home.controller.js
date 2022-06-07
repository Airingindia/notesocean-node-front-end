const httpServices = require("../services/http.services");
const getFeed = () => {
    return new Promise((resolve, reject) => {
        httpServices.get("/products/feeds/0").then((response) => {
            if (response.body.size !== 0) {
                resolve(response.body.requested);
            } else {
                reject(response);
            }
        }).catch((error) => {
            reject(error);
        })
    })
}

module.exports = {
    getFeed: getFeed
}