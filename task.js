var cron = require('node-cron');
var hinduLoader = require('./Util/Scrapper/hinduScrapper');

// setting the job to run every 10 min to pull data
var task = cron.schedule('*/10 * * * *', () =>  {
  hinduLoader();
});

task.start();