const jwt = require('jsonwebtoken');// Import the jsonwebtoken library
const { signupSchema } = require('../middlewares/validator');// Import the signupSchema from the userModel
const User = require('../models/usersModel');// Import the User model
const { doHash, doHashValidation } = require('../utils/hashing');// Import the doHash function from the hashing module

// Function to handle user signup
exports.signup = async (req, res) => {

// Destructure the email and password from the request body
   const{email, password} = req.body;

try{
      const {error, value} = signupSchema.validate({email, password});// Validate the email and password using the signupSchema
      
      //If there is an error, return a 400 status code with the error message
      if(error){
         return res.status(401).json({success: false,message:error.details[0].message})// If there is an error, return a 400 status code with the error message
      }
        
      // If there is no error
      
      // Check if the user already exists in the database
      const existingUser = await User.findOne({email});

      // If the user already exists, return a 401 status code with the error message
      if(existingUser){
        return res.status(401).json({success: false, message: 'User already exists'})// If the user already exists, return a 409 status code with the error message
      }

      // If the user does not exist, create a new user
      const hashedPassword = await doHash(password,12);

      // Create a new user object
      const newUser = new User({email, password: hashedPassword,});

      // Save the new user to the database
      const savedUser = await newUser.save();

      // Return a success response with the saved user
      savedUser.password = undefined;// Remove the password from the saved user object
      res.status(201).json({success: true, message: 'User account created successfully',savedUser})// Return a 201 status code with the success message and the saved user object
   
} catch(error){
        console.log(error)
   }
};

// FUNCTION TO HANDLE USER SIGNIN
exports.signin = async (req, res) => {
    const {email, password} = req.body;
    
    try{
        // Validate the email and password using the signupSchema
        const {error, value} = signupSchema.validate({email, password});
        
        // If there is an error, return a 400 status code with the error message
        if(error){
            return res.status(401).json({success: false,message:error.details[0].message})
        }
          
        // If there is no error
        
        // Check if the user exists in the database
        const existingUser = await User.findOne({email}).select('+password');//select password to match with the password in the database
    
        // If the user does not exist, return a 401 status code with the error message
        if(!existingUser){
          return res.status(401).json({success: false, message: 'User does not exist'})// If the user does not exist, return a 401 status code with the error message
        }
    
        // If the user exists, compare the password with the hashed password in the database
        const result = await doHashValidation(password, existingUser.password);

        if(!result){
          return res.status(401).json({success: false, message: 'Invalid credentials'})// If the password does not match, return a 401 status code with the error message
        }

        // If the password matches, generate a JWT token

        // The token will contain the user ID, email, and verified status
        const token = jwt.sign({
            userId: existingUser._id,
            email: existingUser.email,
            verified: existingUser.verified,
        }, process.env.TOKEN_SECRET, 
        {
            expiresIn: '8h'// The token will expire in 8 hours
        }
        );

        // The token will expire in 8 hours
        res.cookie("Authorization", 'Bearer ' + token, { expires: new Date(Date.now() + 8 * 3600000), 
            httpOnly: process.env.NODE_ENV === 'production', secure: process.env.NODE_ENV === 'production'}) 
                .json({success: true, token, message: 'Signed in successfully'})// Return a success response with the token
    } catch(error){
          console.log(error)
    }
};

        // FUNCTION TO HANDLE USER SIGNOUT
        exports.signout = async (req, res) => {

        // Clear the cookie by setting its expiration date to the past
        res.clearCookie('Authorization',).status(200)
            .json({success: true, message: 'Signed out successfully'})// Return a success response
    
};