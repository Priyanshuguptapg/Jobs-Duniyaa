let express = require('express');
let router = express.Router();
let Notification = require('../models/notifDB');

// middlewares
let {isLoggedIn, isAdmin} = require('../middlewares/index');

// index
router.get('/notification', async (req, res)=>{
try {
     let allnotifs = await Notification.find({});
    res.render('notifications/index-notif.ejs', {allnotifs});
} catch (error) {
    console.log('ERROR WHILE FETCHING NOTIFICATIONS', error);
}
});

// new
router.get('/notification/new', (req, res)=>{
    res.render('notifications/new-notif.ejs');
});
// create
router.post('/notification', async (req, res)=>{
   try {
      let notif = new Notification({
     body : req.body.body,
     author : req.body.author  
      });
      await notif.save();
      res.redirect('/notification');
   } catch (error) {
    console.log('ERROR WHILE CREATING NOTIFICATIONS', error);
   }

});

// delete
router.delete('/notifiaction/:id', isLoggedIn, isAdmin, async function(req, res){
try {
    await Notification.findByIdAndDelete(req.params.id);
    res.redirect('/notification');
} catch (error) {
    console.log('ERROR WHILE DELETING NOTIFICATIONS', error);
}
}); 

module.exports = router;
