const schedule = require('node-schedule');
const moment = require('moment');
var Massive = require("massive");
const massive = require('massive');

require('dotenv').config();
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
// var connectionString = "postgres://massive:password@localhost/chinook";

// var db = Massive.connectSync({db : "my_db"});
// var massiveInstance = massive.connectSync({connectionString : process.env.SQL_CREDZ}) 
console.log(process.env.SQL_CREDZ)
let dbInstance;
massive({connectionString: process.env.SQL_CREDZ, rejectUnauthorized: false, ssl: true})
.then(massiveInstance => {
    dbInstance = massiveInstance
    // app.set('db', massiveInstance);
    // http.createServer(app).listen(8080);
})
.catch(err => console.log("An error: ", err))



var j = schedule.scheduleJob({second: 10}, function(){
    console.log("Running the task now, at" , moment(new Date()).format('HH:mm'), ' oclock');
    if(dbInstance) {
        dbInstance.getUsers()
        .then(rsp => {
            // console.log(rsp)
            const updatedUserIds = []
            let updatedUsers = [];
            let UPDATE_QUERY = `
                UPDATE users 
                SET password = CASE 
            `
            rsp.forEach(user => {
                UPDATE_QUERY += ` WHEN id =`
                // updatedUserIds.push(user.id)
                // updatedUsers.push(
                //    `${Math.floor(Math.random() * 99999)}`
                // )
                dbInstance['users'].update({id: user.id}, {password: `${Math.floor(Math.random() * 9999)}`}) 
                .then(resp => console.log('done: ', resp))
                .catch(err => console.log('err : ', err))
            })

           
        })
        .catch(err => console.log('an err: ', err))
        
        // dbInstance.getPeople()
        // .then(rsp => console.log("Response: ", rsp))
        // .catch(err => console.log('Get people err: ', err))
    }
});