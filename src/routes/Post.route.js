const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/auth')
const upload = require('../utils/multer');
const postController = require('../controllers/post.controller');


router.get('/', verifyToken, postController.getPosts);
router.post('/travel', verifyToken, upload.single('image'), postController.createPost)


module.exports = router;