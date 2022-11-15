const Mongoose = require('mongoose');
const Map = require('../../models/map-schema');
const User = require('../../models/user-schema');
const SampleUserData = { firstName: "JohnTest", lastName: "Test", username: "jdoe123", email: "t@t.com", passwordHash: "test1234" };

describe('Map Model Test', () => {
    let map;
    let createdUser;

    beforeAll(async () => {
        await Mongoose.connect(global.__MONGO_URI__, { useNewUrlParser: true, socketTimeoutMS: 5000, serverSelectionTimeoutMS: 3000 }, (err) => {
            if (err) {
                console.log(err);
            }
        });
        createdUser = await User.create(SampleUserData);
    });

    afterAll(async () => {
        await User.findOneAndDelete({_id: createdUser._id});
        await Mongoose.connection.dropDatabase();
        await Mongoose.connection.close();
    });

    it('Create Map', async () => {
        const sampleMapData = {
            owner: createdUser._id,
            ownerUsername: createdUser.username,
            title: "Sample Title",
            height: 128,
            width: 128,
            tileSize: 64
        };
        
        map = await Map.create(sampleMapData);

        expect(map._id).toBeDefined();
        expect(map.owner).toStrictEqual(createdUser._id);
        expect(map.title).toBe(sampleMapData.title);
        expect(map.height).toBe(sampleMapData.height);
        expect(map.width).toBe(sampleMapData.width);
        expect(map.tileSize).toBe(sampleMapData.tileSize);
    });

    it('Update Map', async () => {
        const sampleMapData = {
            title: "Summoner's Rift",
            height: 64,
            width: 64,
            tileSize: 32
        };

        const updatedMap = await Map.findOneAndUpdate({_id: map._id}, sampleMapData, {new: true});

        expect(updatedMap.owner).toStrictEqual(createdUser._id);
        expect(updatedMap.title).toBe(sampleMapData.title);
        expect(updatedMap.height).toBe(sampleMapData.height);
        expect(updatedMap.width).toBe(sampleMapData.width);
        expect(updatedMap.tileSize).toBe(sampleMapData.tileSize);
    });

    it('Create Map without required fields', async () => {
        const invalidMap = new Map({ title: 'Summoner\'s Rift' });
        let err;
        try {
            const savedMap = await invalidMap.save();
            error = savedMap;
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(Mongoose.Error.ValidationError);
    });

    it('Delete Map', async () => {
        const deletedMap = await Map.findOneAndDelete({_id: map._id});
        expect(deletedMap._id).toStrictEqual(map._id);
        const getMapAgain = await Map.findOneAndDelete({_id: map._id});
        expect(getMapAgain).toBeNull();
    });
});