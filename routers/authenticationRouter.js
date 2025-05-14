const express = require('express');
const authenticationCont = require('../controllers/authenticationCont');
const router = express.Router();

router.post('/signup', authenticationCont.signup);//when a request come to /api/auth/signup, it will be directed to the signup function in authenticationController
router.post('/signin', authenticationCont.signin);//when a request come to /api/auth/signin, it will be directed to the signin function in authenticationController
router.post('/signout', authenticationCont.signout);//when a request come to /api/auth/signout, it will be directed to the signout function in authenticationController











//export the router
module.exports = router;