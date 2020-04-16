const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create a Schema
// This is a Schema to use with Mongoose with mongoDB
const UserSchema = new Schema({
    // The username is type string and is required
    username: {
        type: String,
        required: true
    },
    // The category is type String and the default is "Experimental"
    password: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
});

// This exports the module as User, which uses this Schema
module.exports = User = mongoose.model('user', UserSchema);