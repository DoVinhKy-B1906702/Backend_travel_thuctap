const Like = require('../models/Like.model');


const dotenv = require('dotenv');

dotenv.config();




// @route get /auth/:yourId
// @desc get 1 user
// @access public and having token


exports.addLike = async (req, res) => {
    try {
        // const yourId = req.query.id;
        const post = req.query.post;
        const liked = await Like.findOneAndDelete({user: req.userId, post: post})
        if (liked) {
            return res.status(200).json({success: false, message: 'unLiked !!!', like: liked});
        }
        
        const newLike = new Like({
            user: req.userId,
            post : post
        })
      
       
        await newLike.save();
        
        res.status(200).json({success: true, message: 'Liked !!!', like: newLike});
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error
        });
    }
}
exports.getLikes = async (req, res) => {
        try {
            const post = req.query.post;
            const allLike = await Like.find({post: post}).sort({createdAt: -1})
                        .populate('user', ['firstName', 'lastName', 'image', 'gender', 'yourId','_id'])
            res.status(200).json({success: true, message: 'Get like successfully !!!', like: allLike});
        } catch (error) {
            console.log(error);
            res.status(500).json({
                error: error
            });
        }
}