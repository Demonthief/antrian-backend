import mongoose from "mongoose";

const queueSchema = new mongoose.Schema({
    number : Number,
    status : {
        type : String,
        enum : ['waiting', 'called', 'done'],
        default :'waiting'
    },
    createAt: {
        type : Date,
        default : Date.now
    }
})

export default mongoose.model('Queue', queueSchema)