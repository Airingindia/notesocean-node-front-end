const httpServices = require("../services/http.services");
const getProductInfo = async (productid) => {
    const response = await httpServices.get("/products/" + productid);
    return response.body;
}
module.exports = {
    getInfo: getProductInfo
}