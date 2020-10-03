const schedule = require('node-schedule');



var j = schedule.scheduleJob({second: 10}, function(){
    console.log('Today is recognized by Rebecca Black!');
  });