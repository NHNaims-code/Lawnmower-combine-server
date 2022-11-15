const Mongoose = require('mongoose');
const Layer = require('../../models/layer-schema');
const Property = require('../../models/property-schema');

describe('Layer Model Test', () => {
    let layer;
    let createdProperty;

    beforeAll(async () => {
        await Mongoose.connect(global.__MONGO_URI__, { useNewUrlParser: true, socketTimeoutMS: 5000, serverSelectionTimeoutMS: 3000 }, (err) => {
            if (err) {
                console.log(err);
            }
        });
        createdProperty = await Property.create({name: "collideable"});
    });

    afterAll(async () => {
        await Property.findOneAndDelete({_id: createdProperty._id});
        await Mongoose.connection.dropDatabase();
        await Mongoose.connection.close();
    });

    it('Create Layer', async () => {
        const sampleLayerData = {
            name: "My Layer",
            locked: true,
            height: 128,
            width: 128
        };
        
        layer = await Layer.create(sampleLayerData);

        expect(layer._id).toBeDefined();
        expect(layer.name).toBe(sampleLayerData.name);
        expect(layer.locked).toBe(sampleLayerData.locked);
        expect(layer.height).toBe(sampleLayerData.height);
        expect(layer.width).toBe(sampleLayerData.width);
    });

    it('Update Layer', async () => {
        const sampleLayerData = {
            name: "Howling Abyss",
            locked: false,
            properties: [createdProperty._id],
            height: 64,
            width: 64
        };

        const updatedLayer = await Layer.findOneAndUpdate({_id: layer._id}, sampleLayerData, {new: true});

        expect(updatedLayer.name).toBe(sampleLayerData.name);
        expect(updatedLayer.locked).toBe(sampleLayerData.locked);
        expect(updatedLayer.properties[0]).toStrictEqual(createdProperty._id);
        expect(updatedLayer.height).toBe(sampleLayerData.height);
        expect(updatedLayer.width).toBe(sampleLayerData.width);
    });

    it('Delete Layer', async () => {
        const deletedLayer = await Layer.findOneAndDelete({_id: layer._id});
        expect(deletedLayer._id).toStrictEqual(layer._id);
        const getLayerAgain = await Layer.findOneAndDelete({_id: layer._id});
        expect(getLayerAgain).toBeNull();
    });
});