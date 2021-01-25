const fs = require('fs');

//READ JSON FILE
exports.data = JSON.parse(fs.readFileSync(`${__dirname}/data.json`, 'utf-8'));
