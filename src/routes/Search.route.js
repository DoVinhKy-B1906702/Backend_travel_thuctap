const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/auth')

const searchController = require('../controllers/search.controller');



// search User
router.get('/', verifyToken, searchController.findUser);
// router.get('/searchId', searchController.findUserbyYourId);
router.get('/searchyourID', searchController.findUserbyYour);

module.exports = router;