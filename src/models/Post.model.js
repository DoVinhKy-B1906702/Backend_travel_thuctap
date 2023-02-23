const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type:String,
        require: true
    },
    content: {
        type: String,
        require: true
    },
    // attachment: String,
    user: {
        type: Schema.Types.ObjectId, ref: 'users' 
    },
    comments: [
        {
            user: {type: Schema.Types.ObjectId, ref: 'users'},
            text: String,
            createdAt: { type: Date, default: Date.now }
        }
    ]
    ,
    images: {
        type:Array,
    },
    cloudinary_id: {
        type: String,
        require: true
    }
}, {timestamps: true});

module.exports = mongoose.model('posts', postSchema);