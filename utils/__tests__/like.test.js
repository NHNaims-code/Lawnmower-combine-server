const Mongoose = require('mongoose');
const Like = require('../../models/like-schema');

describe('Like Model Test', () => {
    let like;

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

    it('Create Like', async () => {
        let user = "Forest";
        like = await Like.create({user: user});

        expect(like._id).toBeDefined();
        expect(like.user).toBe(user);
    });

    it('Update Like', async () => {
        let newUser = "Desert";
        const updatedLike = await Like.findOneAndUpdate({_id: like._id}, {user: newUser}, {new: true});

        expect(updatedLike.user).toBe(newUser);
    });

    it('Delete Like', async () => {
        const oldLike = await Like.findOneAndDelete({_id: like._id});
        expect(oldLike._id).toStrictEqual(like._id);
        const getLikeAgain = await Like.findOneAndDelete({_id: like._id});
        expect(getLikeAgain).toBeNull();
    });
});