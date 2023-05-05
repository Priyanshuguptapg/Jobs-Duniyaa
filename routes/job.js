const express = require('express');
const { findByIdAndUpdate } = require('../models/jobDb');
const router = express.Router();

let Job = require('../models/jobDb'),
    Notification = require('../models/notifDB');

// middlewares
let {isLoggedIn, isAdmin} = require('../middlewares/index');

router.get('/', (req, res)=>{
    res.send('Working Properly');
});
// index
router.get('/jobs', async (req,res)=>{
    try {
        if (req.query.search && req.query.search.length > 0) {
			// fuzzy searching
			let regex = new RegExp(req.query.search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'gi');
			let jobs = await Job.find({ company: regex });
			res.render('index', { jobs });
		} else {
			// extract all the jobs from db
			let jobs  = await Job.find({});
			res.render('index', { jobs });
		}
    } catch (error) {
        console.log('error while getting details', error);
    }
 
});

// new
router.get('/jobs/new', isLoggedIn, isAdmin, (req,res)=>{
   res.render('new');
});

// create
router.post('/jobs',  isLoggedIn, isAdmin, async (req, res)=>{
  try {
    const newJob = new Job({
   name: req.body.name,
   company: req.body.company,
   location: req.body.location,
   jobtype: req.body.jobtype,
   eligibility : req.body.eligibility,
   salary: req.body.salary,
   logo: req.body.logo,
   description: req.body.description,
   deadline: req.body.deadline
    });
     await newJob.save();
//  for notifiication
       let notif = new Notification({
          body : 'A New Job Has Been Posted!',
          author : newJob.company 
     });
     await notif.save();
     res.redirect('/jobs');
  } catch (error) {
    console.log('error while posting the Job', error);
  }
});

// show
router.get('/jobs/:id', async (req,res)=>{
    try {
        let id = req.params.id;
        let job = await Job.findById(id).populate('appliedusers');
    res.render('show', {job});
    } catch (error) {
      console.log('error while fetching details', error);  
    }
});

// edit
router.get('/jobs/:id/edit',  isLoggedIn, isAdmin, async (req,res)=>{
    try {
        let id = req.params.id;
        let job = await Job.findById(id);
       res.render('edit', {job});
    } catch (error) {
        console.log('error while editing', error);
    }
});

// update

router.patch('/jobs/:id',  isLoggedIn, isAdmin, async (req,res)=>{
    try {
      let id = req.params.id;
      let updatedjob = {
        name: req.body.name,
        company: req.body.company,
        location: req.body.location,
        jobtype: req.body.jobtype,
        eligibility : req.body.eligibility,
        salary: req.body.salary,
        logo: req.body.logo,
        description: req.body.description,
        deadline: req.body.deadline
      };
      await Job.findByIdAndUpdate(id, updatedjob);
      //  for notifiication
      let notif = new Notification({
        body : 'A Job Has Been UPDATED!',
        author : updatedjob.company 
   });
   await notif.save();

      res.redirect(`/jobs/${id}`);
    } catch (error) {
     console.log('error while updating details', error);   
    }
});

// delete

router.delete('/jobs/:id', isLoggedIn, isAdmin, async (req, res)=>{
try {
    let id = req.params.id;
    await Job.findByIdAndDelete(id);
    res.redirect('/jobs');
} catch (error) {
    console.log('error while deleting the job', error);
}
});

// apply
router.get('/jobs/:jobId/apply', isLoggedIn, async function(req, res){
    try {
        // cgpa validation
		if (!req.user.cgpa) {
			return res.send('you have not entered your cgpa');
		}
        let { jobId } = req.params;
        let job = await Job.findById(jobId);
        // does the user pass required cgpa criteria
		if (req.user.cgpa < job.cgpa) {
			return res.send('your cgpa is not enough');
		}
        // a user can only apply once for a particular job
		for (let user of job.appliedusers) {
			if (user._id.equals(req.user._id)) {
				return res.send('you can only apply once');
			}
		}
        job.appliedusers.push(req.user);
        await job.save();
        res.redirect(`/jobs/${jobId}`);
    } catch (error) {
        console.log('ERROR WHILE APPLYING JOB', error);
    }
});

module.exports = router;