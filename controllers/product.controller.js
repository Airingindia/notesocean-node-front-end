const httpServices = require("../services/http.services");
const getProductInfo = async (productid, token) => {
    if (token.length > 10) {
        return getProductInfoWithToken(productid, token);
    }
    const response = await httpServices.get("/products/" + productid);
    return response.body;
}

const getProductInfoWithToken = async (productid, token) => {
    const response = await httpServices.getWithAuth("/products/" + productid, token);
    if (response.status == 200) {
        return response.body;
    } else {
        return getProductInfo(productid, "");
    }


}
module.exports = {
    getInfo: getProductInfo,
    getInfoWithAuth: getProductInfoWithToken
}