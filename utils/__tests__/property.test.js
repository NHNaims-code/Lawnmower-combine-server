const Mongoose = require('mongoose');
const Property = require('../../models/property-schema');

describe('Property Model Test', () => {
    let property;

    beforeAll(async () => {
        await Mongoose.connect(global.__MONGO_URI__, { useNewUrlParser: true, socketTimeoutMS: 5000, serverSelectionTimeoutMS: 3000 }, (err) => {
            if (err) {
                console.log(err);
            }
        });
    });

    afterAll(async () => {
        await Mongoose.connection.dropDatabase();
        await Mongoose.connection.close();
    });

    it('Create Property', async () => {
        let name = "Collideable";
        let type = "Boolean"
        let value = "false";
        property = await Property.create({name: name, type: type, value: value});

        expect(property._id).toBeDefined();
        expect(property.name).toBe(name);
        expect(property.type).toBe(type);
        expect(property.value).toBe(value);
    });

    it('Update Property', async () => {
        let newName = "No Clipping";
        let newType = "Boolean"
        let newValue = "true";
        const updatedProperty = await Property.findOneAndUpdate({_id: property._id}, {name: newName, type: newType, value: newValue}, {new: true});

        expect(updatedProperty.name).toBe(newName);
        expect(updatedProperty.type).toBe(newType);
        expect(updatedProperty.value).toBe(newValue);
    });

    it('Delete Property', async () => {
        const deletedProperty = await Property.findOneAndDelete({_id: property._id});
        expect(deletedProperty._id).toStrictEqual(property._id);
        const getPropertyAgain = await Property.findOneAndDelete({_id: property._id});
        expect(getPropertyAgain).toBeNull();
    });
});