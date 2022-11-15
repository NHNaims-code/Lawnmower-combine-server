const mongoose = require('mongoose');

mongoose
    .connect(" mongodb+srv://developernaim20:developernaim20@cluster0.sjmet.mongodb.net/demo_lawnmower2?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to mongodb..."))
    .catch(e => {
        console.error('Connection error', e.message);
    });

const db = mongoose.connection;

module.exports = db;