const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/auth')
const upload = require('../utils/multer');
const postController = require('../controllers/post.controller');


router.get('/', verifyToken, postController.getPosts);
router.get('/:id', verifyToken, postController.getPostsPrivate);
router.post('/travel', verifyToken, upload.single('image'), postController.createPost);
router.post('/list', verifyToken, upload.array('images'), postController.createPostList);

router.put('/comment/:id', verifyToken, postController.updateComment)

// delete post
router.delete('/:id', verifyToken, postController.deletePost);

module.exports = router;