const Post = require('../models/postsModel');
const { createPostSchema } = require('../middlewares/validator');

exports.getPosts = async (req, res) => {
     const {page} = req.query;
     const postsPerPage = 10;

     try{
        let pageNum = 0;
        if (page <=1){
            pageNum = 0;
        }else{
            pageNum = page -1
        } 
        const result = await Post.find().sort({createdAt: -1}).skip(pageNum * postsPerPage).limit(postsPerPage).populate({
            path:'userid',
            select: 'email'
        });

        res.status(200).json({
            success: true,
            message: 'posts',
            data: result,
        });

     }catch(error){
          console.log(error)
     }
}

exports.createPost = async (req, res) => {
    const { title, description, userid: bodyUserId } = req.body;
    // Try to get userId from req.user, fallback to req.body.userid
    const userId = (req.user && req.user.userId) || bodyUserId;

    try {
        const { error, value } = createPostSchema.validate({
            title,
            description,
            userid: userId,
        });
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
            });
        }
        
        const result = await Post.create({
            title,
            description,
            userid: userId, // Make sure this matches your model
        });
        res.status(201).json({
            success: true,
            message: 'created',
            data: result,
        });
    } catch (error) {
        console.log(error);
    }
}

exports.singlePost = async (req, res) => {
     const {_id} = req.query;
     const postsPerPage = 10;

     try{
      const result = await Post.findOne({_id})
      
      .populate({
            path:'userid',
            select: 'email'
      })
        res.status(200).json({
            success: true,
            message: 'single post',
            data: result,
        });

     }catch(error){
          console.log(error)
     }
}

exports.updatePost = async (req, res) => {
    const { title, description, userid: bodyUserId } = req.body;
    const userId = (req.user && req.user.userId) || bodyUserId;
    const postId = req.params.id; // Get post ID from route parameter

    try {
        const { error, value } = createPostSchema.validate({
            title,
            description,
            userid: userId,
        });
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
            });
        }
        
        const existingPost = await Post.findOne({ _id: postId });
        if(!existingPost){
            return res.status(404).json({
                success: false,
                message: 'Post not found',
            });
        }
        if (existingPost.userid.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to update this post',
            });
        }
        existingPost.title = title;
        existingPost.description = description;

        const result = await existingPost.save();
        res.status(200).json({
            success: true,
            message: 'updated',
            data: result,
        });
       
    } catch (error) {
        console.log(error);
    }
}

exports.deletePost = async (req, res) => {
    const {userid: bodyUserId } = req.body;
    const userId = (req.user && req.user.userId) || bodyUserId;
    const postId = req.params.id; // Get post ID from route parameter

    try {
        
        
        const existingPost = await Post.findOne({ _id: postId });
        if(!existingPost){
            return res.status(404).json({
                success: false,
                message: 'Post already unavailable',
            });
        }
        if (existingPost.userid.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized',
            });
        }

        await Post.deleteOne({ _id: postId })
        res.status(200).json({
            success: true,
            message: 'deleted',
        });
       
    } catch (error) {
        console.log(error);
    }
}