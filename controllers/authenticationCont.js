const { signupSchema } = require('../middlewares/validator');// Import the signupSchema from the userModel
const User = require('../models/usersModel');// Import the User model
const { doHash } = require('../utils/hashing');// Import the doHash function from the hashing module

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