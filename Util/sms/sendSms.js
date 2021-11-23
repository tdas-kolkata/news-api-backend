const authToken = process.env.FS_AUTH_TOKEN;
const axios = require('axios');
const url = 'https://www.fast2sms.com/dev/bulkV2';

const header = {
  'authorization':authToken,
  'Content-Type':"application/json"
};

const body ={
  "route" : "v3",
  "sender_id" : "Cghpet",
  "message" : "",
  "variables_values" : "",
  "language" : "english",
  "flash" : 0,
  "numbers" : "",
};

function sendWelcome(num) {
  body.message = 'Welcome to News Sonar';
  body.numbers = num;
  axios.post(url,body,{headers:header}).then(res=>console.log('Msg sent'))
  .catch(err=>console.log(err));
}

module.exports = {sendWelcome}; 