## Viewfinder
![Viewfinder Logo](./assets/blue-logo.png)

Project for OpenHacks 2020 that aims to bring differing views into an understanding and create an open mind for individuals.

## Build and Run

How to use this project:
- Ensure you have nothing running on ports :4000 and :5678.
- Load the extension from the `extension/` folder into Chrome.
    - Go to `chrome://extensions/`
    - Click the `Load unpacked` button
    - Select the folder titled `extension`
- Get a Google Cloud API key for the Natural Language API, rename it `key.json`, and put it in the `analysis/` folder.
- `cd analysis && yarn && node index.js &`
- `cd chat/backend && yarn && node app.js &`
- Done!

## Inspiration

Many social media sites recommend content based on what the user wants. As such, it is incredibly easy for internet users today to slip into a feedback loop that continuously reinforces their ideals, commonly referred to as an "echo chamber". This eventually begins to widen the divide of opinion between users who otherwise would have had close-to-similar views. To further prevent this from occurring, we sought to provide a tool to allow users to easily identify and discuss controversial topics: Viewfinder.

As more and more people incorporate social media into their lives, it is also important that people are aware of false information and fake news. Controversial and charged opinions can often be a source of false information as some may try to get the upper hand in the everlasting debate. Hence, the Viewfinder extension also attempts to inform users of the information they should be wary of and attempts to provide a neutral source for information about the topic.

## What it does

Viewfinder does the following:

- Highlights words or phrases that are controversial
- Offers a verdict to discern how supportive or opposing a text is towards a topic
- Links additional resources to highlighted controversial issues
- Supplies a convenient room-based online chat platform based on the highlighted issue This is coherently connected with a Chrome extension and an ExpressJS backend.

## How we built it

We first scrape the posts and comments off a social media site. We chose Reddit for this because it's particularly easy to scrape, although the basic concept would work with any site, regardless of whether or not it would be a Facebook post or a Wordpress blog. The scraping is done by the Viewfinder chrome extension, which parses through the page HTML and finds the posts and comments.

Then, the extension sends off the posts and comments to the ExpressJS backend in order to be analyzed for controversial opinions and sentiments. In order to do this, we used Google Cloud Platform's Natural Language API, which provides options to break down the text into its topics and the sentiment per topic. In order to detect whether or not a topic is controversial, we use the MediaWiki OpenSearch API along with Wikipedia's list of controversial issues to see if any topic is controversial. Finally, we combine this data, filter out 'boringly mentioned' topics, and send it back to the client.

The Chrome extension proceeds to highlight words and render popups. If the user chooses, they can pull themselves into a chatroom, which uses an ExpressJS backend + Socket.IO to chat efficiently.

## Challenges we ran into

During development, we found a bottleneck in our system. We were rate limited by Wikipedia's OpenSearch API, which was really annoying, especially since the API page explicitly said that there were no rate limits. We spent a solid 5 hours with our code having workarounds for this, leading to really slow development time (having to wait for >20 seconds for our app to even find a controversial opinion).

Then we decided to read the error message, and noticed that it was asking for us to add a User-Agent HTTP header. Adding "User-Agent: Viewfinder/0.0.1 (bot)" immediately solved all of our problems. Searching this up revealed that the MediaWiki API had a User-Agent requirement that was not linked to anywhere on the OpenSearch API page. The fact that it even worked without the User-Agent, as long as you didn't send too many, was surprising and a stellar example of why you should pay attention to error messages.

## Accomplishments that we're proud of

Being able to reliably communicate with teammates and stay productive while having fun.

Our greatest accomplishment, however, was having one of our members win the skribble.io mini event.

## What we learned

- How to unite multiple technologies and skillsets while sustaining a straightforward user experience.
- The susceptibility of being part of an echo chamber and how it can influence people’s opinions.
- How there is a lot of strongly opinionated comments on the internet.
- `document.createTreeWalker`

## What's next for Viewfinder

Future features may include multilanguage support, fake news detection, and support for more websites.

## Conclusion

We are grateful for us being able to participate in OpenHacks. Thank you to the OpenHacks team for giving us this wonderful learning opportunity.
