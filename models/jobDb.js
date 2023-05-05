const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
   name:String,
   company: String,
   location: String,
   jobtype: {
      type: String,
       default: 'Fulltime',
   },
   eligibility : String,
   salary: Number,
   address: String,
   logo: String,
   description: String,
   deadline: { type: Date,
               default: Date.now
            },
            createdAt: {
               type: Date,
               default: Date.now
            },
   appliedusers :  [{
      type : mongoose.Schema.Types.ObjectId,
      ref : 'user' 
   }],
   questions: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'question'
		}
	]
});

const Job = mongoose.model('jobs', jobSchema);

module.exports = Job;