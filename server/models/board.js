let mongoose=require('mongoose'); 
const Schema = mongoose.Schema;

  
let BoardSchema = new Schema({ 
    boardData: [],
    lastModified: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
}); 
  
module.exports  = mongoose.model('board', BoardSchema);