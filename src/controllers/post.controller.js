

const Post = require('../models/Post.model');
const cloudinary = require('../utils/cloudinary');

const dotenv = require('dotenv');

dotenv.config();


// @route GET api/posts
// @desc Get post
// @access Private
exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('user', ['username','firstName', 'lastName', 'image']);

        res.status(200).json({success: true, posts})
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Internal server error'})
    }
}

// @route POST api/posts
// @desc Create post
// @access Private

exports.createPost = async (req, res) => {
  
    const {title,content} = req.body;

    //simple validation
    if (!title) {
        return res.status(400).json({status: false, message: 'Title is required'})
    }

    try {
      const result = await cloudinary.uploader.upload(req.file.path,{ folder: "postTravel" });
      // const {title, content} = req.body;
        const newPost = new Post({
            title,
            content,
            image: result.secure_url,
            cloudinary_id: result.public_id,
            user: req.userId
        })
        await newPost.save();
        
        res.status(200).json({success: true, message: 'Happy Learning', post: newPost})
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Internal server error'})
    }
}



