let mongoose=require('mongoose'); 
const Schema = mongoose.Schema;

/*
    ! This is the Board (canvas) Model that dictates what data is in the DB. 
    * boardData -> holds the board information such as X & Y coordinates and colors
    * lastModified -> holds the date when the board was last modified
    * createdAt -> tells us when the board was created
    * ownerId -> holds the userId that created the baord
    * contributors -> holds the Id's of users that drew on the board
*/
  
let BoardSchema = new Schema({ 
    boardData: {
        type: Array,
        required: true
    },    
    lastModified: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    ownerId: {
        type: String,
        required: true
    },
    contributors: {
        type: Array,
        required: true
    }
}); 
  
module.exports  = mongoose.model('board', BoardSchema);