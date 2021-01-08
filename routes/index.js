const express = require('express')
const router = express.Router()
const{ ensureAuth, ensureGuest} = require('../middleware/auth')
const Story = require('../models/story')
//  login/landing page
// get/
router.get('/',ensureGuest, (req,  res)=>{
    res.render('Login',
    {layout:'login'});

});

//  dashboard
// get/dashboard
router.get('/dashboard',ensureAuth, async(req, res)=>{
    try{
        const stories = await Story.find({user: req.user.id}).lean()
        res.render('dashboard', {
            name:req.user.firstName,
            stories
        });
    }catch (err){
        console.error(err)
        res.render('500')
    }
    
});

module.exports= router