var express = require('express');
var bodyparser = require('body-parser');
var app = express();

app.use(bodyparser.json());

const PORT = process.env.PORT || 8085;

const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');
const version = "2019-02-28";
var url = "https://gateway-lon.watsonplatform.net/assistant/api";
var apikey = "{{apikey}}"; 
var assistantId = "{{assistantID}}";

const assistant = new AssistantV2({
  version,
  authenticator: new IamAuthenticator({
    apikey
  }),
  url
});


app.post("/message", (req, res) => 
{
  var message = req.body.message;
  var sessionId;
  assistant.createSession({
    assistantId
  })
    .then(res3 => {
      sessionId = res3.result.session_id;
      console.log(JSON.stringify(res3, null, 2));
      assistant.message({
        assistantId,
        sessionId,
        input: {
          "message_type": "text",
          "text": message
        }
      }
      
      ).then(res2 => {
        console.log(JSON.stringify(res2,null,2));
        res.status(200).send(res2);
      }).catch(err => {
        console.log(err);
      })


    })
    .catch(err => {
      console.log(err);
    });



}
)

app.listen(PORT, () => {
  console.log(`watsontest listening on http ${PORT}`);
});