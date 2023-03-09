const mongoose = require('mongoose');



const UserSchema = mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },  
    lastName:{
        type: String,
        required: true
    }, 
    username:{
        type: String,
        required: true,
        unique: true
    },  
    yourId: {
        type: String,
        required: true,
        unique: true
    },
    password: {type: String, required: true, minlength: 8,},
    admin:{
        type: Boolean,
        default: false,
    },
    image: {
        type: String
    },
    cash:{
        type: Number,
        default: 0
    },
    phone:{
        type: String,
        default: "Chưa có số điện thoại"
    },
    email:{
        type: String,
        default: "Chưa có email"
    },
    gender: {
        type: Boolean,
        default: false
    },
    cloudinary_id : {
        type: String
    },
}, {timestamps: true});



module.exports = mongoose.model('users', UserSchema);