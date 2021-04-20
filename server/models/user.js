const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.set('debug', true);

/*
    ! This is the User Model that dictates what data is stored for the user in the DB. 
    * username -> holds the board information such as X & Y coordinates and colors
    * password -> holds the date when the board was last modified
    * createdAt -> holds the userId that created the baord
    * role -> tells us what role the user has
*/

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
    createdAt: {
        type: Date,
        required: true
    },
    role: {
        type: String,
        required: true
    }
});

// This exports the module as User, which uses this Schema
module.exports  = mongoose.model('user', UserSchema);