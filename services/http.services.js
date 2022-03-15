require("dotenv").config();
const ajax = require('supertest');
const api_endpoint = process.env.API_URL;
const postRequest = async (api_path) => {
    const response = await ajax(api_endpoint)
        .post(api_path)
        .send();
    return response;
}

const getRequest = async (api_path) => {
    const response = await ajax(api_endpoint)
        .get(api_path)
        .send();
    return response;
}

const getRequestWithToken = async (api_path, token) => {
    const response = await ajax(api_endpoint)
        .get(api_path)
        .set("Authorization", token)
        .send();
    return response;
}

module.exports = {
    post: postRequest,
    get: getRequest,
    getWithAuth: getRequestWithToken
}