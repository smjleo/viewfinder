const cont = require('./controversialTopics.js');
const fetch = require('node-fetch');

// function searchWikipedia:
// accepts a word and searches wikipedia for it using the opensearch api
// returns a promise
function searchWikipedia(word) {
    let apiLink = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${word}&limit=1&namespace=0&format=json` 
    return fetch(apiLink)
        .then(res => res.headers.get('Content-Type').indexOf('application/json') !== -1 ? res.json() : res.text().then(console.log))
        .then(data => data[3][0]);
}

// function checkControversial:
// accepts a phrase, and checks if it is a controversial topic.
// it returns a link if so, and returns undefined if it's not
function isControversial(phrase) {
    return searchWikipedia(phrase)
        .then(data => {
            if (cont.controversialTopics.includes(data)) return data;
            else return undefined;
        });
}

module.exports = isControversial;
