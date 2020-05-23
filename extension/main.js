// let controversialWords = ["problems", "Coronavirus"];

function getAnalysis(_text) {
    return fetch('http://localhost:5678/getOpinion', {method : "POST", body : JSON.stringify({"text" : _text}), headers : {'Content-Type': 'application/json'}})
    .then(res => res.json())
}


setTimeout(function(){
    let text;
    let posts = [...document.querySelectorAll('div.entry')];

    for(let i = 0; i < posts.length; i++) {
        let arr = [...posts[i].querySelectorAll('div.usertext-body')]; // Set arr as array of div children with usertext-body class
        if(arr.length === 0) { // Check if post is a title
            posts[i] = [...posts[i].querySelectorAll('.title')][1]; // Set posts element as title of a post
        } else {
            posts[i] = arr[0]; // Set posts element as comment or post content
        }

        setTimeout(function() {
            if(posts[i] === undefined) {
                continue;
            }
        
            getAnalysis(posts[i].innerText).then(elem => {
                console.log(elem);
            });
        }, 1000);
    
        // text += posts[i].innerText;
        // controversialWords.forEach(word => {
        //     if(text.includes(word)) {
        //         console.log("FOUND!");
        //     }
        // });
    }
}, 3000); // Timeout acts as a buffer while page loads  