//Importing express
const express = require('express');
//Importing express.router
const router = express.Router();
//@route    Get api/auth (request type)
//@desc     Test route (description for what the route does)
//@access   Public (mentions whether it is public or private)
router.get('/', (req, res) => res.send('Auth route'));

module.exports = router;