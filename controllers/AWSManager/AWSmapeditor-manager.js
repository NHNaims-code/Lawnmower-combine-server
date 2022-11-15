const Map = require("../../models/map-schema");

module.exports.updateMap = async (updatedMap) => {
    return await Map.findOneAndUpdate({ _id: updatedMap._id}, updatedMap, {returnOriginal: false});
}