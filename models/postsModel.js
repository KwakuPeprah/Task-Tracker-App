const { required } = require('joi');
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required!'],
        trim: true,
         },
    description: {
        type: String,
        required: [true, 'Description is required!'],
        trim: true,
    },
    userid:{
        type:mongoose.Schema.Types.ObjectId,// Reference to the User model to link the post to a user
        ref: 'User',//the referece of the model where the user id is from or stored
        required: true,
    }
},{timstamps: true});// Automatically add createdAt and updatedAt fields




// Export the Post model
module.exports = mongoose.model('Post', postSchema);