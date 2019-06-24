//Importing express
const express = require('express');
//Importing express.router
const router = express.Router();
//Importing user's gravatar
const gravatar = require('gravatar');
//Importing express.validator
const {
  check,
  validationResult
} = require('express-validator/check');
//Importing bcript for password encryption
const bcrypt = require('bcryptjs')
//Importing our user model
const User = require('../../models/User');


//@route    Post api/users (request type)
//@desc     Register user (description for what the route does)
//@access   Public (mentions whether it is public or private)

router.post('/',
  [
    //Name validation
    check(
      'name',
      'Name is required'
    ).not().isEmpty(),

    //Email validation
    check(
      'email',
      'Please insert a valid email'
    ).isEmail(),

    //Password validation
    check(
      'password',
      'Please insert a password with 6 or more characters'
    ).isLength({
      min: 6
    })
  ],
  //Handling errors
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    //Destructioring request.body  
    const {
      name,
      email,
      password
    } = req.body;

    try {
      //Check if user exists
      let user = await User.findOne({
        email
      });

      if (user) {
        return res.status(400).json({
          errors: [{
            msg: 'User already exists'
          }]
        });
      }

      //Get users gravatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: '404'
      })

      user = new User({
        name,
        email,
        avatar,
        password
      });

      //Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      //Return jsonWebToken
      res.send('User registered');

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }

  }
);

module.exports = router;