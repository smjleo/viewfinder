function getAnalysis(_text) {
    return fetch('http://localhost:5678/getOpinion', {method : "POST", body : JSON.stringify({"text" : _text}), headers : {'Content-Type': 'application/json'}})
    .then(res => res.json())
}


let sleep = ms => new Promise((resolve, reject) => setTimeout(resolve, ms));

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

        if(!(posts[i] === undefined)) {
            getAnalysis(posts[i].innerText).then(elem => {
                if(elem.length !== 0) {
                    console.log(elem[0]);
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
                                pnode.innerHTML = pnode.innerHTML.slice(0,pos) + '<span class = "viewfinder-word" id = "' + rand + '" style="background-color: yellow;">' + pnode.innerHTML.slice(pos, pos+str.length) + '</span>' + pnode.innerHTML.slice(pos+str.length);
                                return rand;
                            }
                        }
                        pnode = node;
                    }
                }
            }).then(randid => {
                if(randid) {
                    let element = document.getElementById(randid);
    
                    let elementProperties = element.getBoundingClientRect();
                    console.log(elementProperties);
    
                    let popup = document.createElement('div');
    
                    popup.style.position = 'absolute';
                    popup.style.left = (elementProperties.x + window.scrollX) + "px";
                    popup.style.top = (elementProperties.y + elementProperties.height + window.scrollY)+ "px";
    
                    popup.innerText = "Controversial Flag"; // temporary
     
                    document.body.appendChild(popup);
                }
            });
        }

        if(i + 1 < posts.length) {
            setTimeout(recurse, 1000, i + 1); // Untested might change
        }
    })(0);

}, 3000); // Timeout acts as a buffer while page loads  