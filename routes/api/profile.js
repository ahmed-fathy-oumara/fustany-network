//Importing express
const express = require('express');
//Importing express.router
const router = express.Router();
//Importing auth
const auth = require('../../middleware/auth');
//Importing Profile model
const Profile = require('../../models/Profile');
//Importing User model
const User = require('../../models/User');

//@route    Get api/profile/me (request type)
//@desc     Get current users profile (description for what the route does)
//@access   Private (mentions whether it is public or private)
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate('user', ['name', 'avatar']);

    //If there is no profile
    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    //If there is profile
    res.json(profile);

    //If there is error
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;