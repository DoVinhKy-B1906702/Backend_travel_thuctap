const User = require('../models/User.model');
const Post = require('../models/Post.model');

const dotenv = require('dotenv');

dotenv.config();

// @route get /auth/:user
// @desc get user
// @access public and having token
exports.findUser = async (req, res) => {

    try {
        const allUsers = await User.find({
            "$or": [
                {
                  "yourId": {
                    "$regex": req.query.q,
                    "$options": "i"
                    }
               
                  
                }
                ,{
                "lastName": {
                    "$regex": req.query.q,
                    "$options": "i"
                }
                }
                ,
                {
                    "firstName": {
                        "$regex": req.query.q,
                        "$options": "i",
                        
                    }
                }
                
            ],
        }).select('-password -username');
       
        // const allUsers = await User.find({$searchUsers: {$search: req.query.q}}).select('-password');
        res.status(200).json({length: allUsers.length,success: true, message: 'Get User Successfully !!!', allUsers});
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error
        });
    }
}


// @route get /auth/:yourId
// @desc get 1 user
// @access public and having token


exports.findUserbyYour = async (req, res) => {
    try {
        // const yourId = req.query.id;
        const user = await User.findOne({yourId : req.query.q}).select('-password -username');
        const id = user._id;
        const posts = await Post.find({user: id}).sort({createdAt: -1})
            .populate('user', ['firstName', 'lastName', 'image', 'gender', 'yourId', '_id'])
            .populate('comments.user',['firstName', 'lastName', 'image', 'gender', 'yourId', '_id'])
        
        res.status(200).json({success: true, message: 'Get User Successfully !!!', user, posts});
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error
        });
    }
}