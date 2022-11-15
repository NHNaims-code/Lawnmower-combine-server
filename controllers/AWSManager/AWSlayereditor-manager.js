const Layer = require("../../models/layer-schema");
const Map = require("../../models/map-schema");

module.exports.createLayer = async (layerName, mapId) => {
    if (!layerName) return null;

    const newLayer = new Layer(layerName);
    const savedLayer = await newLayer.save();

    // Save into map
    const fetchedMap = await Map.findById(mapId);
    if (!fetchedMap) return null;
    fetchedMap.layers.push(savedLayer);
    await fetchedMap.save();
    return savedLayer;
};

module.exports.deleteLayer = async (layerId, mapId) => {
    if(!layerId) return null;

    const deletedLayer = await Layer.findOneAndDelete({_id: layerId}).catch(err => {return null;});
    if (!deletedLayer) return null;
    const fetchedMap = await Map.findOne({_id: mapId}).catch(err => {return null;});
    fetchedMap.layers.pull({_id: layerId});
    await fetchedMap.save();
    return deletedLayer;
};

module.exports.getLayer = async (layerId) => {
    if(!layerId) return null;

    const layer = await Layer.findById(layerId);
    if (!layer) return null;
    return layer;
};

module.exports.updateLayer = async (layerId, newLayer) => {
    const updatedLayer = await Layer.findOneAndUpdate({_id: layerId}, newLayer, {new: true});
    if (!updatedLayer) return null;
    return updatedLayer;
};