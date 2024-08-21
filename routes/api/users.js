const express = require("express");
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../../model/User');
const config = require('config');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//@rout    Post api/users
//@desc    Register user
//@access   Public
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more chrarcters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    //check errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }
      //Create Avatar
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      user = new User({
        name,
        email,
        password,
        avatar,
      });

    //Encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password,salt);

    //save user in database
    await user.save();

    //return jsonwebtoken
    //*1 get user ID from database

    const payload = {
        user : {
            id:user.id
        }
    };

    //*2 Create JWT
    jwt.sign(payload,config.get('jwtSecret'),{expiresIn:360000},(err,token)=>{
        if(err) throw err;
        res.json({ token })
    });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
  }
);

module.exports = router;
