const http = require("./../services/http.services");
const getRequestDetails = (uuid, token) => {
    return new Promise((resolve, reject) => {
        http.getWithAuth("/requests/" + uuid, token).then((res) => {
            resolve(res.body);
        }).catch((error) => {
            reject(error);
        })
    })
};

const getAllRequests = (token) => {
    return new Promise((resolve, reject) => {
        http.getWithAuth("/requests/feed/page/0/size/20", token).then((res) => {
            resolve(res.body);
        }).catch((error) => {
            reject(error);
        })
    })
};

module.exports = {
    get: getRequestDetails,
    getAll: getAllRequests
}