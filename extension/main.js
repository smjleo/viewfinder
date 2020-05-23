setTimeout(function(){
    let posts = [...document.querySelectorAll('div.entry')];

    for(let i = 0; i < posts.length; i++) {
        let arr = [...posts[i].querySelectorAll('div.usertext-body')]; // Set arr as array of div children with usertext-body class
        if(arr.length === 0) { // Check if post is a title
            posts[i] = [...posts[i].querySelectorAll('.title')][1]; // Set posts element as title of a post
        } else {
            posts[i] = arr[0]; // Set posts element as comment or post content
        }

    }
}, 3000); // Timeout acts as a buffer while page loads
