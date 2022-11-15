const Mongoose = require('mongoose');
const Comment = require('../../models/comment-schema');

describe('Comment Model Test', () => {
    let comment;

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

    it('Create Comment', async () => {
        let message = "Cool Story Bro";
        let username = "jdoe123";
        comment = await Comment.create({message: message, username: username});

        expect(comment._id).toBeDefined();
        expect(comment.message).toBe(message);
        expect(comment.username).toBe(username);
    });

    it('Update Comment', async () => {
        let message = "Cool Story Bro";
        let username = "jdoe123";
        let isDeleted = true;

        const updatedComment = await Comment.findOneAndUpdate({_id: comment._id}, {message: message, username, isDeleted: isDeleted}, {new: true});

        expect(updatedComment.message).toBe(message);
        expect(updatedComment.username).toBe(username);
        expect(updatedComment.isDeleted).toBe(true);
    });

    it('Create Comment without required fields', async () => {
        const invalidComment = new Comment({ username: 'test1234' });
        let err;
        try {
            const savedComment = await invalidComment.save();
            error = savedComment;
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(Mongoose.Error.ValidationError);
    });

    it('Delete Comment', async () => {
        const deletedComment = await Comment.findOneAndDelete({_id: comment._id});
        expect(deletedComment._id).toStrictEqual(comment._id);
        const getCommentAgain = await Comment.findOneAndDelete({_id: comment._id});
        expect(getCommentAgain).toBeNull();
    });
});