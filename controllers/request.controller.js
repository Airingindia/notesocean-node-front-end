const http = require("./../services/http.services");
const getRequestDetails = (uuid, token) => {
    return new Promise((resolve, reject) => {
        http.get("/requests/" + uuid).then((res) => {
            if (res.status == 200) {
                resolve(res.body);
            }
            else {
                reject(res);
            }
        }).catch((error) => {
            reject(error);
        })
    })
};

const getAllRequests = () => {
    return new Promise((resolve, reject) => {
        http.get("/requests/feed/page/0/size/20").then((res) => {
            if (res.status == 200) {
                resolve(res.body);
            }
            else {
                reject(res);
            }
        }).catch((error) => {
            reject(error);
        })
    })
};

module.exports = {
    get: getRequestDetails,
    getAll: getAllRequests
}