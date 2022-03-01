const httpServices = require("../services/http.services");
const getFeed = async () => {
    const feed = await httpServices.get("/products/feeds/0");
    return feed.body.requested;
}

module.exports = {
    getFeed: getFeed
}