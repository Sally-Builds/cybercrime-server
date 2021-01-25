const express = require('express');
const questionsController = require('../controller/questionsController');

const router = express.Router();

router.get('/zonedata', questionsController.getZoneData);

router
  .route('/')
  .get(questionsController.getSurveyData)
  .post(questionsController.getSurveyAnswer);

router.route('/:id').post(questionsController.getZoneData);
module.exports = router;
