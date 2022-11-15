const Mongoose = require('mongoose');
const Tags = require('../../models/tags-schema');

describe('Tags Model Test', () => {
    let tag;

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

    it('Create Tag', async () => {
        let name = "Forest";
        tag = await Tags.create({name: name});

        expect(tag._id).toBeDefined();
        expect(tag.name).toBe(name);
    });

    it('Update Tag', async () => {
        let newName = "Desert";
        const updatedTag = await Tags.findOneAndUpdate({_id: tag._id}, {name: newName}, {new: true});

        expect(updatedTag.name).toBe(newName);
    });

    it('Delete Tag', async () => {
        const oldTag = await Tags.findOneAndDelete({_id: tag._id});
        expect(oldTag._id).toStrictEqual(tag._id);
        const getTagAgain = await Tags.findOneAndDelete({_id: tag._id});
        expect(getTagAgain).toBeNull();
    });
});