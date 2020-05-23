setTimeout(function(){

    let posts = [...document.querySelectorAll('div.entry')];

    for(let i = 0; i < posts.length; i++) {
        let arr = [...posts[i].querySelectorAll('div.usertext-body')];
        if(arr.length === 0) { // post is a title
            posts[i] = [...posts[i].querySelectorAll('.title')][1];
        } else {
            posts[i] = arr[0];
        }

    }


}, 3000);
