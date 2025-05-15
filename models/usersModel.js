
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: [true, 'Email is required!'],
        trim: true,
        unique: [true,"Email must be unique"],
        minLength:[5, 'Email must be at least 5 characters long'],
        lowercase: true,
    },
    password:{
        type: String,
        required: [true, "Password must be provided"],
        trim: true,
        select: false, // Do not return password by default

    },
    verified:{
        type: Boolean,
        default: false,
    },
    verificationToken:{
        type: String,
        select: false,
    },
    verifiedTokenExpires:{
        type: Date,
        select: false,
    },
    verificationCodeValidation:{
        type: Number,
        select: false,
    },
    forgotPasswordCode:{
        type: String,
        select: false,
    },
     forgotPasswordCodeValidation:{
        type: Number,
        select: false,
    },
},{
    timestamps: true,// Automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model('User', userSchema);
// module.exports = mongoose.model('User', userSchema);