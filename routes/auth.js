let express = require('express');
const passport = require('passport'); 
let router = express.Router();
let User = require('../models/userDB.js');


router.get('/register', (req, res)=>{
 res.render('authentication/register');
});

router.post('/register', async (req,res)=>{
     let user = new User({
        username : req.body.username
     });
     let registeredUser = await User.register(user, req.body.password);
     console.log(registeredUser);
     req.login(registeredUser, (err)=>{
      if(err){
        console.log('ERROR WHILE REGISTERING USER');
        }
        res.redirect('/jobs');
     });

});

router.get('/login', (req, res)=>{
  res.render('authentication/login');
});

router.post(
	'/login',
	passport.authenticate('local', {
		failureRedirect: '/login'
	}), (req, res)=>{
   res.redirect('/jobs');
});

router.get('/logout', (req, res)=>{
   req.logOut(function(err){
      if(err){
         console.log('ERROR WHILE LOGGING OUT');
      }
      res.redirect('/login');
   });
});

module.exports = router;

