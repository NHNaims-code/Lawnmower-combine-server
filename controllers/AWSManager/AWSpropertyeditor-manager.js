const Property = require("../../models/property-schema");
const Layer = require("../../models/layer-schema");

module.exports.createProperty = async (name, layerId) => {
    const newProperty = new Property({name});
    if (!newProperty) return null;
    await newProperty.save();

    const layer = await Layer.findOne({ _id: layerId });
    if (!layer) return null;
    layer.properties.push(newProperty);
    await layer.save();
    
    return newProperty;
};

module.exports.deleteProperty = async (propertyId) => {
    const deletedProperty = await Property.findOneAndDelete({ _id: propertyId });
    if (!deletedProperty) return null;
    return deletedProperty;
};

module.exports.getProperty = async (propertyId) => {
    return await Property.findOne({ _id: propertyId});
};

module.exports.updateProperty = async (propertyToUpdate) => {
    const updatedProperty = await Property.findOneAndUpdate({ _id: propertyToUpdate._id }, propertyToUpdate, { new: true });
    if (!updatedProperty) return null;
    return updatedProperty;
};