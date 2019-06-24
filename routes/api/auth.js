//Importing express
const express = require('express');
//Importing express.router
const router = express.Router();
//Importing auth from middleware
const auth = require('../../middleware/auth');
//Importing user
const User = require('../../models/User');


//@route    Get api/auth (request type)
//@desc     Test route (description for what the route does)
//@access   Public (mentions whether it is public or private)
router.get('/', auth, async (req, res) => { 
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;