let express = require('express');
let router = express.Router();
let Question = require('../models/questionDb');
let Job = require('../models/jobDb');
let User = require('../models/userDB.js'); 
let { isLoggedIn, isAdmin } = require('../middlewares/index');
// index (nesting)
router.get('/jobs/:id/questions', isLoggedIn, isAdmin, async (req, res) => {
	try {
		let jobId = req.params.id;
		let job = await Job.findById(jobId).populate('questions');
		let questions = job.questions;
		res.render('questions/index-que', { questions, jobId });
	} catch (error) {
		console.log('ERROR WHILE GETTING QUESTION FOR THIS JOB',error);
	}
});
// new
router.get('/jobs/:id/questions/new', isLoggedIn, isAdmin, (req, res) => {
	let jobId = req.params.id;
	res.render('questions/new-que', { jobId });
});
// create
router.post('/jobs/:id/questions', isLoggedIn, isAdmin, async (req, res) => {
	try {
		// 1. create a question
		// 2. save that question
		// 3. add that question into the corresponding job
		// 4. save new job
		let question = new Question(req.body.question);
		await question.save();
		let job = await Job.findById(req.params.id);
		job.questions.push(question);
		await job.save();
		res.redirect(`/jobs/${req.params.id}/questions`);
	} catch (error) {
		console.log('ERROR WHILE CREATING QUESTION FOR THIS JOB',error);
	}
});
// delete
router.delete('/jobs/:id/questions/:questionID', isLoggedIn, isAdmin, async (req, res) => {
	try {
		await Question.findByIdAndDelete(req.params.questionID);
		res.redirect(`/jobs/${req.params.id}/questions`);
	} catch (error) {
		console.log('ERROR WHILE DELETING QUESTION FOR THIS JOB',error);
	}
});

// TESTS
router.get('/jobs/:id/test', isLoggedIn, async (req, res) => {
	try {
		// validations:user can only give test once, selected/rejected users cannot give test
		// 1. extract job
		// 2. populate questions
		// 3. render test form
        let job = await Job.findById(req.params.id).populate('questions');
        let applied = false;
        for (let user of job.appliedusers) {
			if (user._id.equals(req.user._id)) {
                applied = true;
                res.render('questions/test', { job });				
			}
		}
        if(applied === false){
            res.send('Please Apply First');
        }
	} catch (error) {
		console.log(error);
	}
});

router.post('/jobs/:id/test',isLoggedIn,  async (req, res) => {
	try {
		
		let job = await Job.findById(req.params.id).populate('questions');
		let questions = job.questions;
		let marks = 0;
		let required = 0.75 * questions.length;
		for (let i in questions) {
			if (questions[i].correctOption === req.body.answers[i]) {
				marks += 1;
			}
		}
		if (marks >= required) {
            req.user.selected = true;
			await req.user.save();
			return res.send(`you passed the test with ${marks} marks`);
            
		} else {
			return res.send(`you failed the test with ${marks} marks`);
		}
	} catch (error) {
		console.log(error);
	}
});

module.exports = router;
