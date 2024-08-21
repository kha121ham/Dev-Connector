const express = require('express');
const router = express.Router();
const config = require('config');
const request = require('request');
const auth =require('../../middleware/auth');
const Profile =require('../../model/Profile');
const User =require('../../model/User');
const Post = require('../../model/Post');
const { check, validationResult } = require('express-validator');

//@rout    Get api/Profile/me
//@desc    Get cuurent user profile
//@access   private
router.get('/me',auth,async (req,res)=>{
    try {
        //Get User Profile By User ID
        const profile =await Profile.findOne({ user:req.user.id }).populate('user',['name,avatar']);
        //check if user profile not exist
        if(!profile){
            return res.status(400).json({ msg: 'This is no profile for this user' });
        }
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


//@rout    Post api/Profile
//@desc    Create or update user profile 
//@access   private

router.post('/',[auth,
    [
        //check for status and skills for user
        check('status','Status is required').not().isEmpty(),
        check('skills','Skills is required').not().isEmpty()
    ]
],async (req,res)=>{
const errors = validationResult(req);
if(!errors.isEmpty()) {
    return res.status(400).json({ errors:errors.array() });
}
//Destructuring prob from user
const {
    company,
    website,
    location,
    bio,
    status,
    githubusername,
    skills,
    youtube,
    facebook,
    twitter,
    instagram,
    linkedin
  } = req.body;
//Build profile object
const ProfileField={};
ProfileField.user=req.user.id;
if(company) ProfileField.company = company;
if(website) ProfileField.website = website;
if(location) ProfileField.location = location;
if(bio) ProfileField.bio = bio;
if(status) ProfileField.status = status;
if(githubusername) ProfileField.githubusername = githubusername;
if(skills) {
    ProfileField.skills=skills.split(',').map(skill=>skill.trim());
}
//Build socail object
ProfileField.social={};
if (youtube) ProfileField.social.youtube=youtube;
if (twitter) ProfileField.social.twitter=twitter;
if (facebook) ProfileField.social.facebook=facebook;
if (linkedin) ProfileField.social.linkedin=linkedin;
if (instagram) ProfileField.social.instagram=instagram;

//Create and update profile user
try {
    let profile = await Profile.findOne({ user:req.user.id });
if(profile) {
    //Update
    profile=await Profile.findOneAndUpdate(
        {user:req.user.id},
        {$set:ProfileField},
        {new:true}
    );

    return res.json(profile);
}
//Create
profile=new Profile(ProfileField);
await profile.save();
res.json(profile);

} catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
}
}
);

//@rout    Get api/Profile
//@desc    Get all profiles
//@access   puplic
router.get('/',async(req,res)=>{
    try {
        const profiles=await Profile.find().populate('user',['name','avatar']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


//@rout    Get api/Profile/user/:user_id
//@desc    Get profile by user id
//@access   puplic
router.get('/user/:user_id',async(req,res)=>{
    try {
        const profile=await Profile.findOne({user:req.params.user_id}).populate('user',['name','avatar']);
        //check if profile not exist
        if(!profile) return res.status(400).json({ msg:'Profile not found' });
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if(err.kind =='ObjectId') {
            return res.status(400).json({ msg:'Profile not found' });
        }
        res.status(500).send('Server Error');
    }
});


//@rout    Delet api/Profile
//@desc    Delet profile,user,posts
//@access   Private
router.delete('/',auth,async(req,res)=>{
    try {
        //Delete posts
        await Post.deleteMany({ user:req.user.id })

        //Delete profile
        await Profile.findOneAndDelete({ user:req.user.id });
        //Delet user
        await User.findOneAndDelete({ _id:req.user.id });
        res.json({ msg:'User Deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


//@rout    Put api/Profile/experience
//@desc    Add profile experience
//@access   Private
router.put('/experience',
    [
        auth,
        [
            check('title','Title is required').not().isEmpty(),
            check('company','Company is required').not().isEmpty(),
            check('from','From date is required').not().isEmpty()
        ]
    ],async(req,res)=>{
    //check errors
    const errors =validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors:errors.array() });
    }
    //Destructuring profile experience
    const {title,company,location,from,to,currunt,description} = req.body;
    //Create new experience object
    const newExp = {title,company,location,from,to,currunt,description};
    //Add experience to database
    try {
        const profile=await Profile.findOne({user:req.user.id});
        profile.experience.unshift(newExp);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@rout    Delete api/Profile/experience/:exp_id
//@desc    Delete profile experience
//@access   Private

router.delete('/experience/:exp_id',auth,async(req,res)=>{
    try {
        const profile =await Profile.findOne({user:req.user.id})
        //Get remove index
        const removeIndex = profile.experience
        .map(item => item.id)
        .indexOf(req.params.exp_id);
        profile.experience.splice(removeIndex,1);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


//@rout    Put api/Profile/education
//@desc    Add profile education
//@access   Private

router.put('/education',auth,[
    check('school','School is required').not().isEmpty(),
    check('degree','Degree is required').not().isEmpty(),
    check('fieldofstudy','Field of study is required').not().isEmpty()
],
async (req,res)=>{
    //check errors
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors:errors.array() });
    }
    //Destructuring profile education
    const {school,degree,fieldofstudy,from,to,current,decription} =req.body;
    //Create new education object
    const newEdu = {school,degree,fieldofstudy,from,to,current,decription};
    //add education to database
    try {
        const profile = await Profile.findOne({ user:req.user.id });
        profile.education.unshift(newEdu);
        //save education in database
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@rout    Delete api/Profile/education/:edu_id
//@desc    Delete profile experience
//@access   Private
router.delete('/education/:edu_id',auth,async (req,res)=>{
    try {
        const profile =await Profile.findOne({ user:req.user.id });
        //Get remove index
        const removeIndex = profile.education.map(item =>item.id).indexOf(req.params.edu_id);
        //Remove education
        profile.education.splice(removeIndex,1);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@rout    Get api/Profile/github/:username
//@desc    Get user repos from github
//@access   Public
router.get('/github/:username',(req,res)=>{
    try {
        const options = {
            uri:`http://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get(
            'githubClientId')}&client_secret=${config.get('githubSecret')}`,
            method:'GET',
            headers:{ 'user-agent':'node.js' }
        };
        request(options, (error,response,body)=>{
            if(error) console.error(error.message);

            if(response.statusCode !== 200) {
                return res.status(404).json({ msg:'No github profile found' });
            }

            res.json(JSON.parse(body));
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})
module.exports = router;