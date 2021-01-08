const express = require('express')
const router = express.Router()
const{ ensureAuth, ensureGuest} = require('../middleware/auth')
const Story = require('../models/story')
//  show add page
// get/stories/add
router.get('/add',ensureAuth, (req,  res)=>{
    res.render('stories/add')
   

});

//  process and add form
// Post stories
router.post('/',ensureAuth, async(req,  res)=>{
    try{
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('/dashboard')
    }catch(err){
        console.error(err)
        res.render('error/500')
    }
})
//  fetch stories
// get stories
router.get('/',ensureAuth, async(req,  res)=>{
    try{
        
        const stories = await Story.find({status:'public'})
            .populate('user')
            .sort({creaedAt:'desc'})
            .lean()
        res.render('stories/index', {stories})
    }catch(err){
        console.error(err)
        res.render('error/500')
    }
})

module.exports= router