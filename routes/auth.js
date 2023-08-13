

const express = require("express"); // 
const { validationResult, body } = require("express-validator");
const router = express.Router(); 
const User = require("../models/User");
const bcrypt= require('bcryptjs');  // NPM I BCRYPTJS
const jwt = require('jsonwebtoken'); // import jwt
// FOR SIGNING THE WEB TOKEN
const JWT_SECRET = process.env.JWT_SECRET;

const fetchuser = require('../middleware/fetchuser');

// ROUTE 1 ==>>> Create a User using : POST "/api/auth/createuser". Doesn't require Auth
router.post(
  "/createuser",
  [
    body("email", "Enter a valid Email").isEmail(),
    body("name", "Enter a Valid Name").isLength({ min: 3 }),
    body("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    // const user = new User(req.body);
    // console.log(user);
    
    let success=false;
    // IF THERE ARE ERRORS RETURN BAD REQUEST AND THE ERRORS
    const result = validationResult(req);
    if (!result.isEmpty()) {
      
      return res.status(400).json({success, errors: result.array() });
    }

    // CHECK WHETHER THE USER WITH THIS EMAIL EXISTS ALREADY
    // console.log(user);
    try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      // console.log(user);
      return res.status(400).json({ success,
        error: "Sorry, a user with this email already exists",
      });
    }


    // FOR SECURING PASSWORD 
    const salt= await bcrypt.genSalt(10);

    const  secPass = await bcrypt.hash (req.body.password,salt);
      // CREATE THE NEW USER

      const newUser = await User.create({
        name: req.body.name,
        password: secPass,

        email: req.body.email,
        date: Date(req.body.date),
        // console.log(newUser),
        
      });
      // console.log(newUser)
      const data={
        user :{
           id: newUser.id,
        }
      }
      const authToken = jwt.sign(data,JWT_SECRET);
      // console.log(jwtData);
      // console.log(newUser)
      success=true;
      res.json({success,authToken});
      // CATCH errors
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: "An error occurred while creating the user",
        message: err.message,
      });
    }
  }
);


// ROUTE 2 ==>>> Authenticate a User  using their log in credentialss  : POST "/api/auth/login". Doesn't require Auth


  router.post("/login", [
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password can not be empty").exists(),
  ], async (req, res) => {
    
    let success=false;
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
  
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        success=false;

        return res.status(400).json({ success, "error": "Invalid Email or Password" });
      }
  
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success=false;
        return res.status(400).json({ success, "error": "Invalid Email or Password" });
      }
  
      const payload = {
        user: {
          id: user.id
        }
      }
      const authToken = jwt.sign(payload, JWT_SECRET);
      success=true;
      res.json({success, authToken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error, Please wait!");
    }
  });
  
  // ROUTE 3 ==>>> GET LOGGEDIN USER  DATA  : POST "/api/auth/GETUSER". Doesn't require Auth
  
  router.post("/getuser",fetchuser, async (req, res) => {
   
  

  
    try {
      const userId= req.user.id;
      const user = await User.findById(userId).select("-password");
      res.send(user);
  
      
  
      
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error, Please wait!");
    }
  });
  





module.exports = router;