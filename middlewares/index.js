// authentication    
const isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
       next();
    }else{
       console.log('NOT LOGGED IN');
       res.redirect('/login');
    }
 };     

//   authorization
 const isAdmin = function(req, res, next){
    if(req.user && req.user.isAdmin){
        next();
    }else{
      res.send('YOU DO NOT HAVE PERMISSION FOR THIS');
    }
 };


module.exports = {
    isLoggedIn,
    isAdmin
}