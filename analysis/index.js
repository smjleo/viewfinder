require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const bodyParser = require('body-parser');
const lang = require('@google-cloud/language');
let isControversial = require('./controversial.js');

let app = express();
const client = new lang.LanguageServiceClient();

app.use(bodyParser.json())

app.post('/getOpinion', (req, res) => {
    console.log(req.body);
    if(!req.body || !req.body.text || typeof(req.body.text) !== "string"){
        res.status(400);
        res.end();
        return;
    }
    client.analyzeEntitySentiment({
        document: {
            content: req.body.text,
            language: "EN",
            type: 'PLAIN_TEXT'
        },
        "encodingType": "UTF8"
    })
        /* only the FIRST document */
        .then(data => data[0])
        .then(async data => {
            // Result array
            let result = [];
            // topic cache in case we run into duplicates
            data.entities.sort((a, b) => b.salience - a.salience);
            // The threshold at which to consider the opinion volatile.
            const SENTIMENT_THRESHOLD = 0.5;
            let entity = data.entities[i];
            // Check cache
            let url;
            url = await isControversial(entity.name);
            // Check if the topic is controversial,
            // if it is this URL will have a url in it
            if(url){
                // Check all volatile mentions of the topic, and get the opinion.
                // If it swings between bad and good, then the answer is "mixed".
                // If it stays good or stays bad, the answer is "positive" or "negative".
                // If it doesn't run into volatile opinions, it will be "neutral".
               
                // Sentiment sign. (negative: negative, positive: positive)
                let sign = 0;
                // Opinion.
                let opinion = "neutral";
                // Positions of the places where it is mentioned.
                let positions = [];

                for(let j = 0; j < entity.mentions.length; j++){
                    let score = entity.mentions[j].sentiment.score;
                    if(Math.abs(score) >= SENTIMENT_THRESHOLD){
                        if(sign && Math.sign(score) !== sign){
                            opinion = "mixed";
                            sign = 0;
                            break;
                        } else {
                            sign = Math.sign(score);
                        }
                    }
                    positions.push(entity.mentions[j].text.beginOffset);
                }
                if(sign){
                    opinion = (sign > 0 ? "positive" : "negative");
                }
                res.send([{
                    topic: entity.name,
                    opinion,
                    link: url,
                    positions
                }]).end();
            }
        });
});

app.listen(5678);
