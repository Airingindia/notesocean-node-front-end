require("dotenv").config();
const ajax = require('supertest');
const api_endpoint = process.env.API_URL;
const postRequest = async (api_path) => {
    return new Promise(async (resolve, reject) => {
        ajax(api_endpoint)
            .post(api_path)
            .send().then((response) => {
                resolve(response);
            }).catch((error) => {
                reject(error);
            });
    });
}

const getRequest = async (api_path) => {
    return new Promise(async (resolve, reject) => {
        ajax(api_endpoint)
            .get(api_path)
            .send().then((response) => {
                resolve(response);
            }).catch((error) => {
                reject(error);
            })
    });
}

const getRequestWithToken = async (api_path, token) => {
    return new Promise(async (resolve, reject) => {
        ajax(api_endpoint)
            .get(api_path)
            .set("Authorization", token)
            .send().then((response) => {
                resolve(response);
            }).catch((error) => {
                reject(error);
            })
    });
}

module.exports = {
    post: postRequest,
    get: getRequest,
    getWithAuth: getRequestWithToken
}