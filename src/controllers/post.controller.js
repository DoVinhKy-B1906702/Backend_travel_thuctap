

const Post = require('../models/Post.model');
const Like = require('../models/Like.model');
const User = require('../models/User.model');
const cloudinary = require('../utils/cloudinary');

const dotenv = require('dotenv');

dotenv.config();


// @route GET api/posts
// @desc Get all post
// @access Public
exports.getPosts = async (req, res) => {
    try {
       
        const posts = await Post.find().sort({createdAt: -1})
            .populate('user', ['firstName', 'lastName', 'image', 'gender', 'yourId', '_id'])
            .populate('comments.user',['firstName', 'lastName', 'image', 'gender', 'yourId', '_id'])
            .limit(parseInt(req.query.limit))
        // let newArray = [];
        // for (let i = posts.length - 1; i >= 0; i--) {
        //  newArray.push(posts[i]);
        //  }
        res.status(200).json({length: posts.length,success: true,posts})
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Internal server error'})
    }
}
// @route GET /posts/:id
// @desc Get all post private
// @access Public
exports.getPostsPrivate = async (req, res) => {
    try {
        const posts = await Post.find({user: req.params.id})
            .populate('user', ['firstName', 'lastName', 'image', 'gender', 'yourId', '_id'])
            .populate('comments.user',['firstName', 'lastName', 'image', 'gender', 'yourId', '_id'])

        res.status(200).json({success: true, posts})
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Internal server error'})
    }
}

// @route POST /posts/travel
// @desc Create post with single image
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


// @route POST /posts/travel
// @desc Create post with single image
// @access Private
const cloudinaryImageUploadMethod = async file => {
    return new Promise(resolve => {
        cloudinary.uploader.upload( file,{ folder: "postTravel" } , (err, res) => {
          if (err) return res.status(500).send("upload image error")
            resolve({
              res: {image: res.secure_url, cloudinary_id: res.public_id }
            }) 
          }
        ) 
    })
  }
exports.createPostList = async (req,res) => {
    try {
        const urls = [];
        const files = req.files;
        for (const file of files) {
          const { path } = file;
          const newPath = await cloudinaryImageUploadMethod(path);
          urls.push(newPath);
        }
        
        const post = new Post({ 
          title: req.body.title,
          content:req.body.content,
          images: urls.map( url => url.res ),
          user: req.userId
        });
        
        await post.save();
        res.status(200).json({success: true, message: 'Happy Learning', post})
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Internal server error'})
    }
   
        
}

// @route UPDATE /posts/:idPosts
// @desc Update post's comment
// @access public and having token
exports.updateComment = async (req, res) => {
    try {
        let post =  await Post.findByIdAndUpdate({_id: req.params.id})
            .populate('user', ['firstName', 'lastName', 'image', 'gender', 'yourId', '_id'])
            .populate('comments.user',['firstName', 'lastName', 'image', 'gender', 'yourId', '_id'])
        // let user = await User.findById(req.userId).select('-password');
        post.comments.push({user: req.userId, text: req.body.text})
        
        

        post.save();

        res.status(200).json({success: true, message: 'Happy Learning', post })
    
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Internal server error'})
    }
   
}



// @route delete /posts/:idPost
// @desc delete a post
// @access private and having token

exports.deletePost = async (req, res) => {
    try {
        const postDeleteCondition = {_id: req.params.id, user: req.userId};
        // const deleteImage = await Post.findOne({_id: req.params.id})
       
        const deletePost = await Post.findOneAndDelete(postDeleteCondition);
        // xoa hinh anh
        for (let i = 0; i < deletePost.images.length ; i++) {
            await cloudinary.uploader.destroy(deletePost.images[i].cloudinary_id);
        }
          // user not authorised to update post or post not found
          if (!deletePost) {
            return res.status(401).json({success: false, message:'Post not found or user not authorised '})
        }
        await Like.deleteMany({post: req.params.id});
        

        res.status(200).json({success: true ,message:'Deleted successfully !!!'})
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Internal server error'})
    }
}