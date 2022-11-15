const Mongoose = require('mongoose');
const Post = require('../../models/post-schema');

describe('Post Model Test', () => {
    let post;

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

    it('Create Post', async () => {
        let user = "jdoe123";
        let title = "Cool Story Bro";
        post = await Post.create({user: user, title: title});

        expect(post._id).toBeDefined();
        expect(post.user).toBe(user);
        expect(post.title).toBe(title);
    });

    it('Update Post', async () => {
        let likes = ["jdoe123"];
        const updatedPost = await Post.findOneAndUpdate({_id: post._id}, {likes: likes}, {new: true});

        expect(updatedPost.user).toBe("jdoe123");
        expect(updatedPost.likes.length).toBe(1);
        expect(updatedPost.likes[0]).toBe("jdoe123");
    });

    it('Delete Post', async () => {
        const deletedPost = await Post.findOneAndDelete({_id: post._id});
        expect(deletedPost._id).toStrictEqual(post._id);
        const getPostAgain = await Post.findOneAndDelete({_id: post._id});
        expect(getPostAgain).toBeNull();
    });
});