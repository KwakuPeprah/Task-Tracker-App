const express = require('express');
const postController = require('../controllers/postsController');
const router = express.Router();

router.get('/all-posts', postController.getPosts);//when a request come to /api/auth/signup, it will be directed to the signup function in authenticationController
router.post('/create-post', postController.createPost);//when a request come to /api/auth/login, it will be directed to the login function in authenticationController
router.get('/single-post', postController.singlePost);//when a request come to /api/posts/single-post, it will be directed to the singlePost function in postsController
router.put('/update-post', postController.updatePost);//when a request comes to /api/posts/update-post/:id, it will be directed to the updatePost function in postsController    
router.delete('/delete-post', postController.deletePost);//when a request comes to /api/posts/delete-post/:id, it will be directed to the deletePost function in postsController

//export the router
module.exports = router;