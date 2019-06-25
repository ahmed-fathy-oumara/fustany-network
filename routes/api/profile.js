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
      return res.status(400).json({
        errors: errors.array()
      });
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
      let profile = await Profile.findOne({
        user: req.user.id
      });

      if (profile) {
        //If Profile exists update it
        profile = await Profile.findOneAndUpdate({
          user: req.user.id
        }, {
          $set: profileFields
        }, {
          new: true
        });

        return res.json(profile);
      }


      //If profile doesnt exist Create it
      profile = new Profile(profileFields);

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//Get all profiles route
//@route    Get api/profile (request type)
//@desc     Get all profiles (description for what the route does)
//@access   Public (mentions whether it is public or private)

router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar'])
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//Get profile user ID
//@route    Get api/profile/user/:user_id (request type)
//@desc     Get profile by user ID (description for what the route does)
//@access   Public (mentions whether it is public or private)

router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', ['name', 'avatar']);

    //If profile doesnt exist
    if (!profile) return res.status(400).json({
      msg: 'Profile is not found'
    });
    //If profile exists
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    //If profile ID doesnt exist
    if (err.kind == 'ObjectId') {
      return res.status(400).json({
        msg: 'Profile is not found'
      });
    }
    res.status(500).send('Server Error');
  }
});

//Delete profile, user and posts
//@route    DELETE api/profile (request type)
//@desc     Delete profile, user and posts (description for what the route does)
//@access   Private (mentions whether it is public or private)

router.delete('/', auth, async (req, res) => {
  try {
    //@todo - Remove user posts

    //Remove profile
    await Profile.findOneAndRemove({
      user: req.user.id
    });
    //Remove user
    await User.findByIdAndRemove({
      _id: req.user.id
    });

    res.json({
      msg: 'User deleted'
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


//Add profile experience
//@route    PUT api/profile/experience (request type)
//@desc     Add profile experience (description for what the route does)
//@access   Private (mentions whether it is public or private)
router.put(
  '/experience',
  [auth,
    [
      check('title', 'Title is required')
      .not()
      .isEmpty(),
      check('company', 'Company is required')
      .not()
      .isEmpty(),
      check('from', 'From is required')
      .not()
      .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    //Destructuring experience fields
    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;

    //Creating and object with the data that user submits
    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExp);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);


module.exports = router;