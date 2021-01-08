const express = require('express')
const passport = require('passport')
const router = express.Router()

require('../config/passport')(passport)
//  auth with google
// get/auth/google
router.get('/google',
 passport.authenticate('google', {scope: ['profile']}))

//  google auth callback
// get/auth/google/callback
router.get('/google/callback',
 passport.authenticate('google', { failureRedirect: '/' }),
(req, res) =>
  // Successful authentication, redirect home.
  {res.redirect('/dashboard')}
)
// logout
// get/auth/logout
router.get('/logout',(req, res)=>{
  req.logout()
  res.redirect('/')
})

module.exports= router