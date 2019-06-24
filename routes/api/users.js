//Importing express
const express = require('express');
//Importing express.router
const router = express.Router();
//Importing express.validator
const {
  check,
  validationResult
} = require('express-validator/check')

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
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    res.send('User route');
  }
);

module.exports = router;