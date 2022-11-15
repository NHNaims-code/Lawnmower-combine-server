const Mongoose = require('mongoose');
const Tileset = require('../../models/tileset-schema');
const User = require('../../models/user-schema');
const SampleUserData = { firstName: "JohnTest", lastName: "Test", username: "jdoe123", email: "t@t.com", passwordHash: "test1234" };

describe('User Model Test', () => {
    let tilesetId;
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

    it('Create Tileset', async () => {
        let owner = createdUser._id;
        let username = createdUser.username;
        let title = "Sample Title";
        let tileSize = 64;
        tilesetId = await Tileset.create({owner: owner, ownerUsername: username, title: title, tileSize: tileSize});

        expect(tilesetId._id).toBeDefined();
        expect(tilesetId.title).toBe(title);
        expect(tilesetId.tileSize).toBe(tileSize);
    });

    it('Create Tileset without required fields', async () => {
        const invalidTileset = new Tileset({ title: 'Summoner\'s Rift Tileset' });
        let err;
        try {
            const savedTileset = await invalidTileset.save();
            error = savedTileset;
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(Mongoose.Error.ValidationError);
    });

    it('Update Tileset', async () => {
        let newTitle = "What's Up Folks";
        let tileSize = 32;
        const updatedTileset = await Tileset.findOneAndUpdate({_id: tilesetId._id}, {title: newTitle, tileSize: tileSize}, {new: true});

        expect(updatedTileset.title).toBe(newTitle);
        expect(updatedTileset.tileSize).toBe(tileSize);
    });

    it('Delete Tileset', async () => {
        const tileset = await Tileset.findOneAndDelete({_id: tilesetId._id});
        expect(tileset._id).toStrictEqual(tilesetId._id);
        const getTilesetAgain = await Tileset.findOneAndDelete({_id: tilesetId._id});
        expect(getTilesetAgain).toBeNull();
    });
});