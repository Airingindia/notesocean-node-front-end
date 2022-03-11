const httpServices = require("../services/http.services");
const getuserinfo = async (userid) => {
    const response = await httpServices.get("/users/" + userid);
    return response.body;
}

module.exports = {
    getInfo: getuserinfo
}