const Map =require('../../models/map-schema');
const Tileset = require('../../models/tileset-schema');
const User = require('../../models/user-schema');
const { createCanvas } = require('canvas');
const { uploadData } = require('./AWS-S3-manager');
// content-controller-generalized.js is a generalization of database interactions
// content-controller-generalized.js handles json req, res and calls mongoose-manager.js
// this file, mongoose-manager.js, is a specialization of those interactions for mongoose
// mongoose-manager.js handles mongoose actions
// the functions should reflect this interaction

createMap = async (body, userId) => {
    let newMap = new Map(body);
    if (newMap) {
        const user = await User.findOne({ _id: userId }).catch(err => {return null;});
        
        if (!user) {
            return null;
        }

        newMap.owner = user._id;

        const updatedMap = await newMap.save().catch(err => {return null;});

        if(!updatedMap) return null;


        user.maps.push(updatedMap._id);
        await user.save().catch(err => {return null;});

        return updatedMap;
    }
}

deleteMap = async (mapId, userId) => {
    const map = await Map.findById({ _id: mapId }).catch(err => {return null;});
    if (!map) {
        return null;
    }
    if (map.owner == userId) {
        const deletedMap = await Map.findOneAndDelete({ _id: mapId });

        let user = await User.findById({ _id: userId }).catch(err => {return null;});
        if (!user) {
            return null;
        }
        user.maps = user.maps.filter(map => map != mapId);
        await user.save().catch(err => {return null;});

        return (deletedMap === {} ? null : deletedMap);
    }
    return null;
}

getMapById = async (mapId, userId) => {
    let map = await Map.findOne({ _id: mapId}).catch(err => {return null;});
    if (!map) {
        return null;
    }
    // if (map.owner == userId || map.collaborators.includes(userId)) {
    //     return map;
    // }
    return map;
    return null;
}

// getMaps returns all maps that are set to public for community page viewing
getMaps = async () => {
    return await Map.find({ public: true });
}

updateMapGeneral = async (updatedMap) => {
    return await Map.findOneAndUpdate({ _id: updatedMap.map._id}, updatedMap.map, {new: true});
}

createTileset = async (body, userId) => {
    let newTileset = new Tileset(body);
    if (newTileset) {
        const user = await User.findOne({ _id: userId }).catch(err => {return null;});
        if (!user) {
            return null;
        }

        const updatedTileset = await newTileset.save().catch(err => {return null;});
        user.tilesets.push(updatedTileset._id);
        await user.save().catch(err => {return null;});

        //Start each tileset with 1 tile
        const tileSize = newTileset.tileSize;
        const canvas = createCanvas(tileSize, tileSize);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(0, 0, tileSize, tileSize);
        const tile = ctx.getImageData(0, 0, tileSize, tileSize);

        const tileData = {
            tiles:[tile]
        }
        await uploadData(tileData, userId, updatedTileset._id, false);

        return await updatedTileset.save().catch(err => {
            return null;
        });
    }
}

deleteTileset = async (tilesetId, userId) => {
    const tileset = await Tileset.findById({ _id: tilesetId }).catch(err => {return null;});
    if (!tileset) {
        return null;
    }
    if (tileset.owner == userId) {
        const deletedTileset = await Tileset.findOneAndDelete({ _id: tilesetId });

        let user = await User.findById({ _id: userId }).catch(err => {return null;});
        if (!user) {
            return null;
        }
        user.tilesets = user.tilesets.filter(tileset => tileset != tilesetId);
        await user.save().catch(err => {return null;});
        
        return (deletedTileset === {} ? null : deletedTileset);
    }
    return null;
}

getTilesetById = async (tilesetId, userId) => {
    let tileset = await Tileset.findOne({ _id: tilesetId}).catch(err => {return null;});
    if (!tileset) {
        return null;
    }
    // if (tileset.owner == userId || tileset.collaborators.includes(userId)) {
    //     return tileset;
    // }
    return tileset;
    return null;
}

// getTilesets returns all tilesets that are set to public for community page viewing
getTilesets = async () => {
    return await Tileset.find({ public: true });
}

updateTilesetGeneral = async (updatedTileset) => {
    return await Tileset.findOneAndUpdate({ _id: updatedTileset.tileset._id}, updatedTileset.tileset, {new: true});
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
}