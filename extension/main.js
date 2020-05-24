function getAnalysis(_text) {
    return fetch('http://localhost:5678/getOpinion', {method : "POST", body : JSON.stringify({"text" : _text}), headers : {'Content-Type': 'application/json'}})
    .then(res => res.json())
}

let sleep = ms => new Promise((resolve, reject) => setTimeout(resolve, ms));


let popupStyle = document.createElement('style');
popupStyle.innerText = `
@import url('https://rsms.me/inter/inter.css');
html { font-family: 'Inter', sans-serif; }

@supports (font-variation-settings: normal) {
  html { font-family: 'Inter var', sans-serif; }
}

@font-face {
    font-family: 'Material Icons';
    font-style: normal;
    font-weight: 400;
    src: url(https://example.com/MaterialIcons-Regular.eot); /* For IE6-8 */
    src: local('Material Icons'),
        local('MaterialIcons-Regular'),
        url(https://example.com/MaterialIcons-Regular.woff2) format('woff2'),
        url(https://example.com/MaterialIcons-Regular.woff) format('woff'),
        url(https://example.com/MaterialIcons-Regular.ttf) format('truetype');
}

.material-icons {
    font-family: 'Material Icons';
    font-weight: normal;
    font-style: normal;
    font-size: 24px;  /* Preferred icon size */
    display: inline-block;
    line-height: 1;
    text-transform: none;
    letter-spacing: normal;
    word-wrap: normal;
    white-space: nowrap;
    direction: ltr;

    /* Support for all WebKit browsers. */
    -webkit-font-smoothing: antialiased;
    /* Support for Safari and Chrome. */
    text-rendering: optimizeLegibility;

    /* Support for Firefox. */
    -moz-osx-font-smoothing: grayscale;

    /* Support for IE. */
    font-feature-settings: 'liga';
}

.viewfinder-popup {
    visibility: hidden;
    position: absolute;
    font-family: 'Inter', sans-serif !important;
    color: black;
    box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background-color: white;
    padding: 20px 20px 20px 15px;
    color: black !important;
}

.viewfinder-popup h2 {
    color: black !important;
    font-weight: 600 !important;
    font-size: 1.5em !important;
    margin: 0 0 5px 0;
}

.viewfinder-popup p {
    color: black !important;
    font-weight: 500 !important;
    font-size: 1.3em !important;
    opacity: 0.8 !important;
}

.viewfinder-popup a {
    text-decoration: none !important;
    color: black !important;
    display: flex;
    align-items: center;
    text-align: left;
    margin: 0 0 5px 0;
    cursor: pointer;
    opacity: 0.5;
}

.viewfinder-popup a:hover {
    opacity: 0.7;
}

.viewfinder-popup a img {
    margin: 0 20px 0 0;
    width: 20px;
}

.viewfinder-word:hover {
    cursor: pointer;
}
`;
let moreIcon = `<img src = "https://cdn.discordapp.com/attachments/705022189359071263/714002361743441930/more_horiz-24px.svg" alt = "Read Icon">`;
let chatIcon = `<img src = "https://cdn.discordapp.com/attachments/705022189359071263/714002359705141299/chat-24px.svg" "alt = "Chat Icon">`;

document.body.appendChild(popupStyle);

function appendPopup(elementProperties, analysis, randid) {
    let popup = document.createElement('div');

    popup.id = "viewfinder-popup-" + randid;

    popup.classList.add("viewfinder-popup");
    popup.style.left = (elementProperties.x + window.scrollX) + "px";
    popup.style.top = (elementProperties.y + elementProperties.height + window.scrollY)+ "px";

    let h2 = document.createElement('h2');
    h2.innerText = "This topic seems controversial.";

    let p = document.createElement('p');
    p.style.margin = "0 0 20px 0";

    let opinion;
    let opinionColor;
    switch(analysis.opinion) {
        case "negative":
            opinion = "oppose"
            opinionColor = "#d32f2f";
            break;
        case "positive":
            opinion = "support"
            opinionColor = "#2E7D32";
            break;
        case "mixed":
            opinion = "be mixed about"
            opinionColor = "#f9a825";
            break;
        case "neutral":
            opinion = "be neutral about"
            opinionColor = "black";
            break;
    }
    p.innerHTML = `This text seems to` + ` <span style = "color: ` + opinionColor + `; font-weight: 700;">` + opinion + `</span> ` + analysis.topic + ".";

    let readMore = document.createElement('a');
    readMore.innerHTML = moreIcon + `<p> Read more </p>`;

    let chat = document.createElement('a');
    chat.innerHTML = chatIcon + `<p> Discuss this topic </p>`;

    popup.appendChild(h2);
    popup.appendChild(p);
    popup.appendChild(readMore);
    popup.appendChild(chat);

    document.body.appendChild(popup);
}

setTimeout(function(){
    let text;
    let posts = [...document.querySelectorAll('div.entry')];

    (function recurse(i) {
        let arr = [...posts[i].querySelectorAll('div.usertext-body')]; // Set arr as array of div children with usertext-body class
        if(arr.length === 0) { // Check if post is a title
            posts[i] = [...posts[i].querySelectorAll('.title')][1]; // Set posts element as title of a post
        } else {
            posts[i] = arr[0]; // Set posts element as comment or post content
        }

        var analysisObject;

        if(!(posts[i] === undefined)) {
            getAnalysis(posts[i].innerText).then(elem => {
                if(elem.length !== 0) {
                    console.log(elem[0]);
                    analysisObject = elem[0];
                    // Walk through the tree.
                    let nodes = document.createTreeWalker(posts[i], NodeFilter.SHOW_ALL, null, null);
                    // Current node, previous node
                    let node, pnode;
                    // Amount of text we have lookked through so far
                    let currLength = 0;
                    while(node = nodes.nextNode()){
                        console.log(node);
                        if(node.nodeName === '#text'){
                            // We know the previous node must have had a "direct" text in it.
                            currLength += pnode.innerText.length;
                            if(currLength > elem[0].positions[0].beginOffset){
                                // The word is in this element.
                                currLength -= pnode.innerText.length;
                                let pos = elem[0].positions[0].beginOffset - currLength;
                                let str = elem[0].positions[0].content;
                                // Highlight the word.
                                let rand = Math.random().toString();
                                pnode.innerHTML = pnode.innerHTML.slice(0,pos) + '<span onmousedown = "if(document.getElementById(\'viewfinder-popup-' + rand + '\').style.visibility !== \'visible\') {document.getElementById(\'viewfinder-popup-' + rand + '\').style.visibility = \'visible\'} else {document.getElementById(\'viewfinder-popup-' + rand + '\').style.visibility = \'hidden\'}" class = "viewfinder-word" id = "' + rand + '" style="background-color: yellow;">' + pnode.innerHTML.slice(pos, pos+str.length) + '</span>' + pnode.innerHTML.slice(pos+str.length);
                                return rand;
                            }
                        }
                        pnode = node;
                    }
                }
            }).then(randid => {
                if(randid) {
                    let element = document.getElementById(randid);
                    console.log(analysisObject);

                    appendPopup(element.getBoundingClientRect(), analysisObject, randid);
                }
            });
        }

        if(i + 1 < posts.length) {
            setTimeout(recurse, 10, i + 1); // Untested might change
        }
    })(0);

}, 3000); // Timeout acts as a buffer while page loads  