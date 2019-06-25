//Importing express
const express = require('express');
//Importing express.router
const router = express.Router();
//Importing auth
const auth = require('../../middleware/auth');
//Importing Express validator
const {
  check,
  validationResult
} = require('express-validator/check');
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
      return res.status(400).json({
        msg: 'There is no profile for this user'
      });
    }

    //If there is profile
    res.json(profile);

    //If there is error
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route    Post api/profile/me (request type)
//@desc     Create or update user profile (description for what the route does)
//@access   Private (mentions whether it is public or private)

router.post(
  '/',
  [auth,
    [
      //Check status
      check('status', 'Status is required').not().isEmpty(),
      //Check skills
      check('skills', 'Status is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //Destructuring
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;


    //Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    //Split skills into array
    if (skills) {
      profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    //Build social newtworks object
    profileFields.social = {}
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;


    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        //If Profile exists update it
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }


      //If profile doesnt exist Create it
      profile = new Profile(profileFields);

      await profile.save();
      res.json(profile);
    } catch(err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;