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
    likeCount: {
        type: Number,
        default: 0
    },
    image: {
        type:String,
        require: true
    },
    cloudinary_id: {
        type: String,
        require: true
    }
}, {timestamps: true});

module.exports = mongoose.model('posts', postSchema);