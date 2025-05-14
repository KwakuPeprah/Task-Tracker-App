const express = require('express');
const authenticationCont = require('../controllers/authenticationCont');

const router = express.Router();

router.post('/signup', authenticationCont.signup);//when a request come to /api/auth/signup, it will be directed to the signup function in authenticationController
//export the router
module.exports = router;