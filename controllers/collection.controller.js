const httpServices = require("../services/http.services");
const getUserCollection = async (collectionID) => {
    const response = await httpServices.get("/collections/" + collectionID);
    return response.body;
}

const setCollectionview = (collectionID) => {
    return new Promise((resolve, reject) => {
        httpServices.post("/collections/" + collectionID).then((response) => {
            resolve(response);
        }).catch((err) => {
            reject(err);
        })
    })
}


module.exports = {
    getCollection: getUserCollection,
    addView: setCollectionview
}