const httpServices = require("../services/http.services");
const getUserCollection = async (collectionID) => {
    const response = await httpServices.get("/collections/" + collectionID);
    return response.body;
}


module.exports = {
    getCollection: getUserCollection
}