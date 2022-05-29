require("dotenv").config();
const ajax = require('supertest');
const api_endpoint = process.env.API_URL;
const postRequest = (api_path) => {
    return new Promise((resolve, reject) => {
        ajax(api_endpoint)
            .post(api_path)
            .send()
            .expect(200)
            .end(function (err, response) {
                if (err) {
                    reject(err);
                } else {
                    resolve(response);
                }
            });
    });
}

const getRequest = (api_path) => {
    return new Promise((resolve, reject) => {
        ajax(api_endpoint)
            .get(api_path)
            .send()
            .end(function (err, response) {
                if (err) {
                    reject(err);
                } else {
                    resolve(response);
                }
            });
    });
}

const getRequestWithToken = (api_path, token) => {
    return new Promise((resolve, reject) => {
        ajax(api_endpoint)
            .get(api_path)
            .set("Authorization", token)
            .send()
            .expect(200)
            .end(function (err, response) {
                if (err) {
                    reject(err);
                } else {
                    resolve(response);
                }
            });
    });
}

module.exports = {
    post: postRequest,
    get: getRequest,
    getWithAuth: getRequestWithToken
}