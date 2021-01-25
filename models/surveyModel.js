const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
  crimeName: {
    type: String,
    required: [true, 'please include a crimeName'],
    enum: ['phishing', 'hacking', 'identityTheft', 'malware'],
  },
  occurence: {
    type: Number,
    required: [true, 'please include the crime occurence'],
  },
  state: {
    type: String,
    required: [true, 'please include a state'],
  },
});

const Survey = mongoose.model('Survey', surveySchema);
module.exports = Survey;
