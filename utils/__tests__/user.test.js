const Mongoose = require('mongoose');
const User = require('../../models/user-schema');
const SampleUserData = { firstName: "JohnTest", lastName: "Test", username: "jdoe123", email: "t@t.com", passwordHash: "test1234" };

describe('User Model Test', () => {
    let userId;

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

    it('Create User', async () => {
        const validUser = new User(SampleUserData);
        const savedUser = await validUser.save();
        userId = savedUser._id;

        // Object Id should be defined when successfully saved to MongoDB.
        expect(savedUser._id).toBeDefined();
        expect(savedUser.firstName).toBe(SampleUserData.firstName);
        expect(savedUser.lastName).toBe(SampleUserData.lastName);
        expect(savedUser.username).toBe(SampleUserData.username);
        expect(savedUser.email).toBe(SampleUserData.email);
    });

    it('Create User without required fields', async () => {
        const invalidUser = new User({ firstName: 'John' });
        let err;
        try {
            const savedUser = await invalidUser.save();
            error = savedUser;
        } catch (error) {
            err = error
        }
        expect(err).toBeInstanceOf(Mongoose.Error.ValidationError);
    });

    it('Update User\'s First Name to Tom', async () => {
        const userBefore = await User.findOne({_id: userId});
        const user = await User.findOneAndUpdate({_id: userId}, {firstName: "Tom"}, {new:true});
        expect(user.firstName).toBe("Tom");
        expect(userBefore.firstName).not.toBe(user.firstName);
    });

    it('Delete User', async () => {
        const user = await User.findOneAndDelete({_id: userId});
        expect(user._id).toStrictEqual(userId);
        const getUserAgain = await User.findOneAndDelete({_id: userId});
        expect(getUserAgain).toBeNull();
    });
});