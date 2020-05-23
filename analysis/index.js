require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const bodyParser = require('body-parser');
const lang = require('@google-cloud/language');

let app = express();
const client = new lang.LanguageServiceClient();

app.use(bodyParser.json())

app.post('/getOpinion', (req, res) => {
    if(!req.body || !req.body.text || typeof(req.body.text) !== "string"){
        res.status(400);
        res.end();
        return;
    }
        client.analyzeEntitySentiment({
        document: {
            content: req.body.text,
            type: 'PLAIN_TEXT'
        }
    })
        /* only the FIRST document */
        .then(data => res.send(data).end())
        /* .then(data => data[0])
        .then(data => 
            data.entities
                .filter(entity => entity.mentions.sentiment.magnitude >= 0.5)
                .map(entity => ({
                })
        ); */
});

app.listen(5678);
