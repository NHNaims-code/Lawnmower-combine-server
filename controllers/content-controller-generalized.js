const databaseManager= require('../controllers/AWSManager/AWSmongoose-manager');
// this controller is generalized to work with any db

function createMap(req, res) {
    const {owner, ownerUsername, title, height, width, tileSize} = req.body;
    const body = {owner, ownerUsername, title, height, width, tileSize};
    if (!owner || !ownerUsername || !title || !height || !width || !tileSize) {
        return res.status(400).json({
            success: false,
            errorMessage: 'Improperly formatted request'
        });
    }
    let newMap;
    databaseManager.createMap(body, req.userId).then((map) => 
    {
        newMap = map;
        if (newMap) {
            return res.status(201).json({
                success: true,
                map: newMap
            });
        } else {
            return res.status(400).json({
                success: false,
                errorMessage: 'Unable to create map'
            });
        }
    }
    );
}

function deleteMap(req, res) {
    databaseManager.deleteMap(req.params.mapId, req.userId).then((deletedMap) => {
        if (deletedMap) {
            return res.status(200).json({
                success: true,
                map: deletedMap
            });
        } else {
            return res.status(400).json({
                success: false,
                errorMessage: 'Unable to delete map'
            });
        }
    }).catch(err => res.status(400).json({
        success: false,
        errorMessage: err
    }));
}

function getMapById(req, res) {
    databaseManager.getMapById(req.params.mapId, req.userId).then((map) => {
        if (map) {
            return res.status(200).json({
                success:true,
                map: map
            });
        }
        return res.status(404).json({
            success:false,
            errorMessage: 'Map not found'
        });
    });
}


// only get public maps for community page viewing
function getMaps(req, res) {
    databaseManager.getMaps().then((maps) => {;
        if (maps) {
            return res.status(200).json({
                success: true,
                maps: maps
            });
        }
        return res.status(404).json({
            success: false,
            errorMessage: 'Maps not found'
        });
    });
}

function updateMapGeneral(req, res) {
    const newMap = req.body;
    databaseManager.updateMapGeneral(newMap).then((updatedMap) => {
        if (updatedMap) {
            return res.status(200).json({
                success: true,
                map: updatedMap
            });
        } else {
            return res.status(400).json({
                success: false,
                errorMessage: 'Unable to update map'
            });
        }
    });
}

function createTileset(req, res) {
    const {owner, ownerUsername,  title, tileSize} = req.body;
    const body = {owner, ownerUsername, title, tileSize};
    if (!owner || !ownerUsername || !title || !tileSize) {
        return res.status(400).json({
            success: false,
            errorMessage: 'Improperly formatted request'
        });
    }
    databaseManager.createTileset(body, req.userId).then((tileset) => {
        if (tileset) {
            return res.status(201).json({
                success: true,
                tileset: tileset
            });
        } else {
            return res.status(400).json({
                success: false,
                errorMessage: 'Unable to create tileset'
            });
        }
    });
}

function deleteTileset(req, res) {
    databaseManager.deleteTileset(req.params.tilesetId, req.userId).then((deletedTileset) => {
        if (deletedTileset) {
            return res.status(200).json({
                message: 'Tileset deleted',
                tileset: deletedTileset,
                success: true
            });
        } else {
            return res.status(400).json({
                success: false,
                errorMessage: 'Unable to delete tileset'
            });
        }
    }).catch(err => res.status(400).json({
        success: false,
        errorMessage: err
    }));
}

function getTilesetById(req, res) {
    databaseManager.getTilesetById(req.params.tilesetId, req.userId).then((tileset) => {
        if (tileset) {
            return res.status(200).json({
                success: true,
                tileset: tileset
            });
        }
        return res.status(404).json({
            errorMessage: 'Tileset not found',
            success: false
        });
    });
}

// only get public tilesets for community page viewing
function getTilesets(req, res) {
    databaseManager.getTilesets().then((tilesets) => {
        if (tilesets) {
            return res.status(200).json({
                success: false,
                tilesets: tilesets
            });
        }
        return res.status(404).json({
            success: false,
            errorMessage: 'Tilesets not found'
        });
    });
}

function updateTilesetGeneral(req, res) {
    const newTileset = req.body;
    databaseManager.updateTilesetGeneral(newTileset).then((updatedTileset) => {
        if (updatedTileset) {
            return res.status(200).json({
                success: true,
                tileset: updatedTileset
            });
        } else {
            return res.status(400).json({
                success: false,
                errorMessage: 'Unable to update tileset'
            });
        }
    });
}

module.exports = {
    createMap,
    deleteMap,
    getMapById,
    getMaps,
    updateMapGeneral,
    createTileset,
    deleteTileset,
    getTilesetById,
    getTilesets,
    updateTilesetGeneral
};