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
                    let nodes = document.createTreeWalker(posts[i], NodeFilter.SHOW_ALL, null, null);
                    let node, pnode;
                    let currLength = 0;
                    while(node = nodes.nextNode()){
                        console.log(node);
                        if(node.nodeName === '#text'){
                            // We know the previous node must have had text in it.
                            currLength += pnode.innerText.length;
                            if(currLength > elem[0].positions[0].beginOffset){
                                // The word is in this element.
                                currLength -= pnode.innerText.length;
                                let pos = elem[0].positions[0].beginOffset - currLength;
                                let str = elem[0].positions[0].content;
                                pnode.innerHTML = pnode.innerHTML.slice(0,pos) + '<span style="background-color: yellow;">' + pnode.innerHTML.slice(pos, pos+str.length) + '</span>' + pnode.innerHTML.slice(pos+str.length);
                            }
                        }
                        pnode = node;
                    }
                }
            });
        }

        if(i + 1 < posts.length) {
            setTimeout(recurse, 1000, i + 1); // Untested might change
        }
    })(0);
}, 3000); // Timeout acts as a buffer while page loads  
