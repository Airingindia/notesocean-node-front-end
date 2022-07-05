require("dotenv").config();
const api_endpoint = process.env.API_URL;
const httpServices = require("../services/http.services");
const ajax = require('supertest');
const getProductInfo = async (productid, token) => {
    if (token.length > 10) {
        return getProductInfoWithToken(productid, token);
    }
    return new Promise(async (resolve, reject) => {
        httpServices.get("/products/" + productid).then((response) => {
            if (response.statusCode == 200) {
                if (response.body.product !== null) {
                    resolve(response.body);
                } else {
                    reject(response);
                }

            }
            else {
                reject(response);
            }
        }).catch((error) => {
            reject(error);
        })

    });
}

const getProductInfoWithToken = async (productid, token) => {
    return new Promise(async (resolve, reject) => {
        httpServices.getWithAuth("/products/" + productid, token).then((response) => {
            if (response.status == 200) {
                if (response.body.product !== null) {
                    resolve(response.body);
                } else {
                    reject(response);
                }
            } else {
                reject(response);
            }
        }).catch((error) => {
            reject(error);
        })

    });

}

const addViews = async (productid, token, deviceId) => {
    return new Promise(async (resolve, reject) => {
        if (token !== "") {
            ajax(api_endpoint)
                .post("/views/products/" + productid)
                .set("Authorization", token)
                .set("DeviceId", deviceId)
                .send()
                .end((error, response) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(response.body);
                })
        } else {
            ajax(api_endpoint)
                .post("/views/products/" + productid)
                .set("DeviceId", deviceId)
                .send()
                .end((error, response) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(response.body);
                })
        }
    })
}

const getMostViewedNotes = () => {
    return new Promise((resolve, reject) => {
        httpServices.get("/products/top-performing-products").then((response) => {
            if (response.statusCode == 200) {
                resolve(response.body);
            } else {
                reject(response);
            }
        }).catch((error) => {
            reject(error);
        })
    });
};

const searchProducts = (query) => {
    return new Promise((resolve, reject) => {
        httpServices.get("/products/search/" + query).then((response) => {
            if (response.status == 200) {
                resolve(response.body);
            } else {
                reject(response);
            }
        }).catch((error) => {
            reject(error);
        })
    });
}
module.exports = {
    getInfo: getProductInfo,
    getInfoWithAuth: getProductInfoWithToken,
    addViews: addViews,
    getMostViewedNotes: getMostViewedNotes,
    searchProducts: searchProducts
}