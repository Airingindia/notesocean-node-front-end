const httpServices = require("../services/http.services");
const getCollectionDetails = async (collectionID) => {
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

const getPublicCollection = () => {
    return new Promise((resolve, reject) => {
        httpServices.get('/getpubliccollection').then((response) => {
            resolve(response);
        }).catch((errordata) => {
            reject(errordata);
        })
    })
}

const getUserCollection = (userid) => {
    return new Promise((resolve, reject) => {
        httpServices.get("/collections/users/" + userid).then((response) => {
            console.log(response);
        }).catch((error) => {
            console.log(error);
        })
    })
}


module.exports = {
    getCollectionDetails: getCollectionDetails,
    addView: setCollectionview,
    getUserCollection: getUserCollection
}