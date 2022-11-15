const databaseManager = require('./AWSManager/AWSlayereditor-manager');

function createLayer(req, res) {
    const name = req.body;
    if (!name.name) {
        return res.status(400).json({
            success: false,
            error: 'Improperly formatted request',
        });
    }
    databaseManager.createLayer(name, req.params.mapId).then((newLayer) => {
        if (newLayer) {
            return res.status(200).json({
                success: true,
                layer: newLayer,
            });
        }
        return res.status(400).json({
            success: false,
            error: 'Unable to create layer'
        });
    });

}

function deleteLayer(req, res) {
    const body = req.body;
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'Improperly formatted request'
        });
    }
    databaseManager.deleteLayer(req.params.layerId, req.params.mapId).then((deletedLayer) => {
        if (deletedLayer) {
            return res.status(200).json({
                success: true,
                layer: deletedLayer,
            });
        }
        return res.status(400).json({
            success: false,
            error: 'Unable to delete layer'
        });
    })

}

function getLayer(req, res) {
    const body = req.body
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'Improperly formatted request'
        });
    }
    databaseManager.getLayer(req.params.layerId).then((layer) => {
        if (layer) {
            return res.status(200).json({
                success: true,
                layer: layer,
            });
        }
        return res.status(404).json({
            success: false,
            error: 'Layer not found'
        });
    })
}

function updateLayer(req, res) {
    const body = req.body
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'Improperly formatted request'
        })
    }
    databaseManager.updateLayer(req.params.layerId, body).then((updatedLayer) => {
        if (updatedLayer) {
            return res.status(200).json({
                success: true,
                layer: updatedLayer,
            })
        }
        return res.status(404).json({
            success: false,
            error: 'Layer not found'
        })
    })
}

module.exports = {
    createLayer,
    deleteLayer,
    getLayer,
    updateLayer
}