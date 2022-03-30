const httpServices = require("../services/http.services");
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

            } else {
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
module.exports = {
    getInfo: getProductInfo,
    getInfoWithAuth: getProductInfoWithToken
}