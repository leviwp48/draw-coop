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

const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
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

module.exports  = mongoose.model('user', UserSchema);