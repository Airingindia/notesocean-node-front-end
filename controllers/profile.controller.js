const httpServices = require("../services/http.services");
const getuserinfo = async (userid) => {
    const response = await httpServices.get("/users/" + userid);
    if (response.statusCode == 200) {
        return response.body;
    } else {
        return throwErr;
    }
}

module.exports = {
    getInfo: getuserinfo
}