const schedule = require('node-schedule');
const moment = require('moment');
const massive = require('massive');

require('dotenv').config();
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

let dbInstance;
massive({connectionString: process.env.SQL_CREDZ, rejectUnauthorized: false, ssl: true})
.then(massiveInstance => {
    dbInstance = massiveInstance
})
.catch(err => console.log("An error: ", err))

var j = schedule.scheduleJob({second: 10}, function(){
    console.log("Running the task now, at" , moment(new Date()).format('HH:mm'), ' oclock');
    if(dbInstance) {
        dbInstance.getUsers()
        .then(rsp => {
            rsp.forEach(user => {
                dbInstance['users'].update({id: user.id}, {password: `${Math.floor(Math.random() * 9999)}`}) 
                .then(resp => {
                    console.log('done: ', resp)
                    if(Array.isArray(resp)) {
                        if(resp.length > 0) {
                            const dataObj = resp[0];
                            dbInstance['PasswordsUpdated'].insert({user_id: dataObj.id, date_time: moment(new Date()).format('YYYYMMDDHHmmss')})
                            .then('record created!')
                            .catch(err => console.log('record not created: ', err))
                        }
                    }
                })
                .catch(err => console.log('err : ', err))
            })
        })
        .catch(err => console.log('an err: ', err))
    }
});

schedule.scheduleJob({second: 20}, () => {
    console.log('Running 2nd task now...')
    dbInstance.getUsers()
    .then(rsp => {
        console.log('Here is a list of users with updated passwords:')
        rsp.forEach(user => {
            console.log(`${user.username} updated his password to ${user.password}`)
        })
    })
    .catch(err => console.log("Failed to run verification query: ", err))
}) 