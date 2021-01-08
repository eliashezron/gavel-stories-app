const passport = require ('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose')
const User = require('../models/User')
// const HttpsProxyAgent = require('https-proxy-agent');

module.exports = function(passport){
    passport.use(
        new GoogleStrategy(
    {
        clientID:process.env.GOOGLE_CLIENT_ID,
        clientSecret:process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:'http://localhost:3000/auth/google/callback'
    },
    async(accessToken, refreshToken, profile, done)=>{
        // console.log(Profile)
        const newUser = {
            googleId:profile.id,
            displayName:profile.displayName,
            firstName:profile.name.givenName,
            lastName:profile.name.familyName,
            image:profile.photos[0].value
        }
        try{
            let user = await User.findOne({googleId:profile.id})
            if (user){
                done(null, user)
            }else{
                user = await User.create(newUser)
                done(null, user)
            }
        }catch(err){
            console.error(err)
        }
    }))
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
}
// const agent = new HttpsProxyAgent(process.env.HTTP_PROXY || "http://192.168.23.4:999");
// gStrategy._oauth2.setAgent(agent);

// passport.use(gStrategy);