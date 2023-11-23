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

const UserListSchema = new Schema({
    boardId: {
        type: String,
        required: true
    },
    userList: {
        type: Array,
        required: true
    },
});

module.exports  = mongoose.model('userList', UserListSchema);