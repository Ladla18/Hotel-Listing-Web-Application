const { number, date } = require("joi");
const mongoose = require("mongoose");
const {Schema} = mongoose;

const reviewSchema = new Schema({
    comment : {
        type:String
    },
    rating:{
        type:Number,
        min:1,
        max:5
    },
    createdat:{
        type : Date,
        default : Date.now()
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }, 
})
Review = mongoose.model("Review",reviewSchema);
module.exports = Review;