const argon2 = require('argon2')
const jwt = require('jsonwebtoken');

const User = require('../models/User.model');
const cloudinary = require('../utils/cloudinary');

const dotenv = require('dotenv');

dotenv.config();

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if(!user) {
            return res.status(400).json({success: false, message:'User not found'})
        }

        res.json({success: true, user})

    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Internal server error', api:'get Change router'});
    }
}

exports.register = async (req, res, next) => {
    const {username, password,  gender, firstName, lastName } = req.body;
    // simple validation
    if (!username || !password)
        return res.status(400).json({success:false, message: 'Missing username/password'})
   
    try {
        // Check for exiting user
        const user = await User.findOne({username});
      
        if (user) {
            return res.status(400).json({success: false, message :'Username already exited'});
        }

        // all Good

        const hashedPassword = await argon2.hash(password);
        const newUser = new User({
            gender,
            firstName,
            lastName,
            username,
            password: hashedPassword,
        })
        await newUser.save();

        // Return token
        const secret = process.env.ACCESS_TOKEN_SECRECT
        const accessToken = jwt.sign({userId: newUser._id},secret )

        res.status(200).json({success: true, message:'User has created successfully', accessToken})
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Internal server error'})
    }
}

exports.login = async (req, res, next) => {
    const {username, password} = req.body;

    // simple validation
    if (!username || !password)
        return res.status(400).json({success:false, message: 'Missing username/password'})

    try {
        // Check for exiting user
        const user = await User.findOne({username});
    
        if (!user ) {
            return res.status(400).json({success: false, message: 'Incorrect username/email or password'});
        }

        // Username found
        const passwordValid = await argon2.verify(user.password, password);
        if(!passwordValid) {
            return res.status(400).json({success: false, message: 'Incorrect username or password'});
        }

        // All good
        
        // Return token
        const secret = process.env.ACCESS_TOKEN_SECRECT
        const accessToken = jwt.sign({userId: user._id},secret )
  
        res.status(200).json({success: true, message:'Logged in successfully', accessToken})

    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Internal server error'})
    }
}


exports.updateUser = async (req, res, next) => {
    try {
        const {gender, firstName, lastName , email, phone} = req.body
        let updateInfo = {
            gender,
            firstName, 
            lastName,
            email,
            phone
        };
        
        const infoUpdateCondition = {_id: req.params.id};
        updateInfo = await User.findOneAndUpdate(infoUpdateCondition, updateInfo, {new: true});
        

            // user not authorised to update post or post not found
            if (!updateInfo) {
                return res.status(401).json({success: false, message:'Không thể cập nhật'})
            }
            
           
            
            res.status(200).json({success: true, message: 'Bạn đã cập nhật thông tin thành công !!!', info: updateInfo});

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error
        });
    }
}

exports.updateImage = async (req, res, next) => {
    try {
       
        const result = await cloudinary.uploader.upload(req.file.path,{ folder: "avatar" });
        let updateInfo = {
            image: result.secure_url,
            cloudinary_id: result.public_id,
        };
        const infoUpdateCondition = {_id: req.params.id};

            updateInfo = await User.findOneAndUpdate(infoUpdateCondition, updateInfo, {new: true});


            // user not authorised to update post or post not found
            if (!updateInfo) {
                return res.status(401).json({success: false, message:'Không thể cập nhật !!! '})
            }


        res.status(200).json({success: true, message: 'Congratulation !!!', info: updateInfo});
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error
        });
    }
}

// @route get /auth/:user
// @desc get user
// @access public and having token
exports.findUser = async (req, res) => {

    try {
        const allUsers = await User.find({
            "$or": [
                {
                  "username": {
                    "$regex": req.query.q,
                    "$options": "i"
                }
                  
                  
                }],
        }).select('-password');

        res.status(200).json({length: allUsers.length,success: true, message: 'Get User Successfully !!!', allUsers});
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error
        });
    }
}