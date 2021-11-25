var cron = require('node-cron');
var hinduLoader = require('./Util/Scrapper/hinduScrapper');

var task = cron.schedule('*/1 * * * *', () =>  {
  hinduLoader();
});

task.start();