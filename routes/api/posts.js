const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const User =require('../../model/User');
const Post =require('../../model/Post');
const Profile =require('../../model/Profile');

//@rout    Post api/posts
//@desc    Create a post
//@access   private
router.post(
  "/",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    //check errors
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors:errors.array() });
    }
    //Get user by ID
    try {
        const user =await User.findById(req.user.id).select('-password');
        const newPost = new Post({
            text:req.body.text,
            name:user.name,
            avatar:user.avatar,
            user:req.user.id
        });
        const post = await newPost.save();
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
  }
);


//@rout    Get api/posts
//@desc    Get all posts
//@access   private
router.get('/',auth,async (req,res)=>{
  //Find posts
  try {
    const posts =await Post.find().sort({date:-1});
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@rout    Get api/posts/:id
//@desc    Get post by ID
//@access   private
router.get('/:id',auth,async(req,res)=>{
  try {
    //get post by ID
    const post = await Post.findById(req.params.id);
    if(!post) {
      return res.status(404).json({ msg:'Post not found' })
    }
    res.json(post);
  } catch (err) {
    console.error(err.message);
    if(err.kind === 'ObjectId') {
      return res.status(404).json({ msg:'Post not found' })
    }
    res.status(500).send('Server Error')
  }
});

//@rout    Delete api/posts/:id
//@desc    Delete post
//@access   private
router.delete('/:id',auth,async(req,res)=>{
  try {
    //Get post by ID
    const post = await Post.findById(req.params.id);

    if(!post) {
      return res.status(404).json({ msg:'Post not found' })
    }

    //check if user the owner post
    if(post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg:'User not authorized' });
    }
    await post.deleteOne();
    res.json({msg:'Post removed'});
  } catch (err) {
    console.error(err.message);
    if(err.kind === 'ObjectId') {
      return res.status(404).json({ msg:'Post not found' })
    }
    res.status(500).send('Server Error');
  }
});

//@rout    Put api/posts/like/:id
//@desc    Like a post
//@access   private
router.put('/like/:id',auth,async(req,res)=>{
  //check post
  try {
    const post = await Post.findById(req.params.id);
    //check if post already been liked
    if(post.likes.filter(like=>like.user.toString()===req.user.id).length >0 ) {
      return res.status(400).json({ msg:'Post already liked' });
    }

    post.likes.unshift({user:req.user.id});
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@rout    Put api/posts/unlike/:id
//@desc    unLike a post
//@access   private
router.put('/unlike/:id',auth,async(req,res)=>{
  //check post
  try {
    const post = await Post.findById(req.params.id);
    //check if post have not been liked
    if(post.likes.filter(like=>like.user.toString()===req.user.id).length ===0 ) {
      return res.status(400).json({ msg:'Post have not been liked' });
    }
    //Get remove index
    const removeIndex = post.likes.map(like=>like.user.toString()).indexOf(req.user.id);
    post.likes.splice(removeIndex,1);
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@rout    Post api/posts/comment/:id
//@desc    Comment on post
//@access   private
router.post(
  "/comment/:id",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    //check errors
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors:errors.array() });
    }
    //Get user by ID
    try {
        const user =await User.findById(req.user.id).select('-password');
        const post = await Post.findById(req.params.id);
        const newComment = {
            text:req.body.text,
            name:user.name,
            avatar:user.avatar,
            user:req.user.id
        };
        post.comments.unshift(newComment);
        await post.save();
        res.json(post.comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
  }
);

//@rout    Delete api/posts/comment/:id/comment_id
//@desc    Delete comment
//@access   private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    //get post by id
    const post = await Post.findById(req.params.id);
    const comment = post.comments.find(comment=>comment.id.toString() === req.params.comment_id);
    //check if comment exist
    if(!comment) {
      return res.status(404).json({msg:'Comment not found' });
    }
    //check if user owner comment
    if(comment.user.toString()!==req.user.id) {
      return res.status(401).json({msg:'User not authorized' });
    }
    //delete comment
    //get remove index
    const removeIndex = post.comments.map(comment=>comment.user.toString()).indexOf(req.user.id);
    post.comments.splice(removeIndex,1);
    await post.save();
    res.json(post.comments)
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error')
  }
});
module.exports = router;
