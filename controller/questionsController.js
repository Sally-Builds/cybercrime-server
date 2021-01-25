const Survey = require('../models/surveyModel');
const Data = require('../utils/import-data');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
// const Email = require('../utils/email');

exports.getData = (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: Data,
  });
};

exports.getSurveyAnswer = catchAsync(async (req, res, next) => {
  if (!req.body) {
    return next(new AppError('There must be a request body', 400));
  }
  // const tips = Data.data[req.body.type];
  // await new Email(req.body, 'url').cyberTips(tips);

  await Survey.create({
    crimeName: req.body.type,
    state: req.body.state,
    occurence: req.body.occurence,
  });

  res.status(201).json({
    status: 'success',
  });
});

//get the total occurence of the crime
const totalOcc = async () => {
  const agg = await Survey.aggregate([
    {
      $group: {
        _id: '$state',
        total: {
          $sum: '$occurence',
        },
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $group: {
        _id: 'totals',
        sum: { $sum: '$total' },
      },
    },
  ]);
  return agg[0];
};

//get the crime occurence in a zone
const zoneCrimeData = async (zone) => {
  const data = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const i of zone) {
    // eslint-disable-next-line no-await-in-loop
    const agg = await Survey.aggregate([
      {
        $match: {
          state: i,
        },
      },
      {
        $group: {
          _id: '$crimeName',
          total: { $sum: '$occurence' },
        },
      },
    ]);
    data.push({ data: agg, crimeName: i });
  }
  return data;
};

//get the total of zones or zone occurence
const zoneTotalData = async (zone) => {
  const zones = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const i of zone) {
    // eslint-disable-next-line no-await-in-loop
    let aggTotal = await Survey.aggregate([
      {
        $match: {
          state: i,
        },
      },
      {
        $group: {
          _id: '$state',
          total: { $sum: '$occurence' },
        },
      },
    ]);
    if (aggTotal.length <= 0) {
      aggTotal = [{ _id: i, total: 0 }];
    }
    // eslint-disable-next-line no-console
    // console.log(aggTotal);
    zones.push(aggTotal[0]);
  }
  return zones;
};

//get the percentages of each zone
const zonePercentage = async () => {
  const total = await totalOcc();
  const x = await zoneTotalData([
    'South-East',
    'South-West',
    'South-South',
    'North-Central',
    'North-East',
    'North-West',
  ]);
  const avg = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const zone of x) {
    const y = (zone.total / total.sum) * 100;
    avg.push({ crime: zone._id, percentage: y });
  }
  return avg;
};

//crimeData occurence totals
const crimeNameTotals = async () => {
  const agg = await Survey.aggregate([
    {
      $group: {
        _id: '$crimeName',
        total: { $sum: '$occurence' },
      },
    },
  ]);
  return agg;
};

exports.getSurveyData = catchAsync(async (req, res, next) => {
  const crimeOccurenceTotal = await totalOcc();
  const crimePercentageByZones = await zonePercentage();
  const crimeTypeSum = await crimeNameTotals();
  res.status(201).json({
    status: 'success',
    data: {
      crimeOccurenceTotal,
      crimePercentageByZones,
      crimeTypeSum,
    },
  });
});

exports.getZoneData = catchAsync(async (req, res, next) => {
  // const total = await zoneTotalData(['Enugu', 'Imo', 'Abia']);
  const crimeData = await zoneCrimeData([
    'South-East',
    'South-West',
    'South-South',
    'North-Central',
    'North-East',
    'North-West',
  ]);
  res.status(201).json({
    status: 'success',
    data: {
      // total,
      crimeData,
    },
  });
});
