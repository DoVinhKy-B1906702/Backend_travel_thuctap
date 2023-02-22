const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/auth')

const searchController = require('../controllers/search.controller');

// router.post('/register', authController.register);
// router.post('/login', authController.login);
// router.get('/', verifyToken, authController.getUser);


// router.put('/:id',verifyToken ,authController.updateUser);
// router.put('/image/:id',verifyToken , upload.single('image'),authController.updateImage);

// search User
router.get('/', verifyToken, searchController.findUser);
router.get('/searchId', searchController.findUserbyYourId);

module.exports = router;