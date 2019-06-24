//Importing express
const express = require('express');
//Importing express.router
const router = express.Router();
//Importing bcript for password encryption
const bcrypt = require('bcryptjs');
//Importing auth from middleware
const auth = require('../../middleware/auth');
//Importing jwt
const jwt = require('jsonwebtoken');
//Importing config
const config = require('config');
//Importing express.validator
const { check, validationResult } = require('express-validator/check');
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

//@route    Post api/auth (request type)
//@desc     Authenticate user and get token (description for what the route does)
//@access   Public (mentions whether it is public or private)

router.post('/',
  [
    //Email validation
    check(
      'email',
      'Please insert a valid email'
    ).isEmail(),

    //Password validation
    check(
      'password',
      'Please is required'
    ).exists()
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
      email,
      password
    } = req.body;

    try {
      //Check if user exists
      let user = await User.findOne({
        email
      });

      //Check if user deosnt exist
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      //Check if password matches
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const payload = {
        user: {
          id: user.id
        }
      };

      //JWT
      jwt.sign(
        payload,
        config.get('jwtSecret'), {
          expiresIn: 360000
        },
        (err, token) => {
          if (err) throw err;
          res.json({
            token
          });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);


module.exports = router;