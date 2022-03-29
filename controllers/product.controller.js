const httpServices = require("../services/http.services");
const getProductInfo = async (productid, token) => {
    if (token.length > 10) {
        return getProductInfoWithToken(productid, token);
    }
    const response = await httpServices.get("/products/" + productid);
    if (response.statusCode == 200) {
        return response.body;
    } else {
        return throwErr;
    }

}

const getProductInfoWithToken = async (productid, token) => {
    const response = await httpServices.getWithAuth("/products/" + productid, token);
    if (response.status == 200) {
        return response.body;
    } else {
        return throwErr;
    }
}
module.exports = {
    getInfo: getProductInfo,
    getInfoWithAuth: getProductInfoWithToken
}