let mongoose=require('mongoose'); 
const Schema = mongoose.Schema;

  
let CanvasSchema = new Schema({ 
    canvasData: [],
    lastModified: {
        type: String,
        required: true
    },
}); 
  
module.exports  = mongoose.model('canvas', CanvasSchema);