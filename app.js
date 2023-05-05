const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const app = express();
let path = require('path');
let expressSession = require('express-session');
let passport = require('passport');
let localStrategy = require('passport-local');
let moment = require('moment');


mongoose.connect('mongodb+srv://prashuguptapg66:prashugupta@jobsduniya.usr7wdo.mongodb.net/?retryWrites=true&w=majority')
.then(function(){
    console.log('DB-connected');
})
.catch(function(error){
    console.log(error);
});

app.use(expressSession({
    secret: 'SuperSecretPassWord',
    resave: false,
    saveUninitialised : true,
    cookie: {
        httpOnly: true,
        // secure : true,
        maxAge : 1000 * 60 *60 * 14

    }

}));

let User = require('./models/userDB');
// passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ! SERVER SETUP AND MIDDLEWARES
app.use(express.static(path.join(__dirname + '/public'))); // static resources
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.moment = moment;
    next();
});

let jobRoutes = require('./routes/job.js');
let notifRoutes = require('./routes/notification.js');
let authRoutes = require('./routes/auth.js');
let userRoutes = require('./routes/user.js');
let questionRoutes = require('./routes/question');
app.use(jobRoutes);
app.use(notifRoutes);
app.use(authRoutes);
app.use(userRoutes);
app.use(questionRoutes);

app.listen(3000, function(){
    console.log('Server running at port 3000');
});