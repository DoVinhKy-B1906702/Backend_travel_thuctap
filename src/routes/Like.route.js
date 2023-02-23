const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/auth')
const likeController = require('../controllers/like.controller');


router.post('/add', verifyToken, likeController.addLike);
router.get('/get', verifyToken, likeController.getLikes);

module.exports = router;