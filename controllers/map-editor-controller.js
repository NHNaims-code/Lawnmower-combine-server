const databaseManager = require("./AWSManager/AWSmapeditor-manager");
const mongooseManager = require("./AWSManager/AWSmongoose-manager");

module.exports.updateMap = async (req, res) => {
    const id = req.params.mapId;
    const newMap = req.body.map;

    console.log(id)

    let mapToUpdate = await mongooseManager.getMapById(id, req.userId);
    //console.log(mapToUpdate); //prints null rn

    if(!mapToUpdate) {
        return res.status(400).json({
            success: false,
            errorMessage: "Map not found"
        });
    };

    databaseManager.updateMap(newMap).then((mapToUpdate) => {
        if(!mapToUpdate) {
            return res.status(400).json({
                success: false,
                errorMessage: "Unable to update map"
            });
        } else {
            return res.status(200).json({
                success: true,
                map: mapToUpdate
            });
        }
    });
}