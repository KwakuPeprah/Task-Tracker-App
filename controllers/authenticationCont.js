const jwt = require('jsonwebtoken');// Import the jsonwebtoken library
const { signupSchema } = require('../middlewares/validator');// Import the signupSchema from the userModel
const User = require('../models/usersModel');// Import the User model
const { doHash, doHashValidation } = require('../utils/hashing');// Import the doHash function from the hashing module

const { v4: uuidv4 } = require('uuid');// Import the uuid library to generate unique verification codes
const { sendVerificationEmail } = require('../utils/mailer');// Import the sendVerificationEmail function from the mailer module

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

      //Genearate a unique verification code
      const verificationToken = require('uuid').v4();

      // Create a new user object
      const newUser = new User({
        email, 
        password: hashedPassword,
        verified: false, //Initially not verified
        verificationToken: verificationToken,
        verificationTokenExpires: Date.now() + 24 * 3600 * 1000,// Token expires in 24 hours
    });

      // Save the new user to the database
      const savedUser = await newUser.save();

      //Construct the verification link
      const verificationLink = `${req.protocol}://${req.get('host')}/api/auth/verify-email?token=${verificationToken}`;

    // Send the verification email
      const emailSent = await sendVerificationEmail(savedUser.email, verificationLink);

    if (emailSent) {
      res.status(201).json({
        success: true,
        message: 'User account created successfully. Please check your email to verify your account.',
        savedUser: { _id: savedUser._id, email: savedUser.email }, // Send back only essential info
      });
    } else {
      // Consider if you want to delete the user if email sending fails, or just inform the user
      res.status(500).json({
        success: false,
        message: 'User account created successfully, but failed to send verification email. Please try again later.',
      });
    }
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ success: false, message: 'An error occurred during signup.' });
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

// FUNCTION TO HANDLE EMAIL VERIFICATION
exports.verifyEmail = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send('Verification token is missing.');
  }

  try {
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).send('Invalid or expired verification token.');
    }

    user.verified = true; // Update the 'verified' field
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.status(200).send('Your email has been successfully verified! You can now log in.');
    // Optionally, redirect the user to the login page: res.redirect('/login');
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).send('An error occurred while verifying your email.');
  }
}