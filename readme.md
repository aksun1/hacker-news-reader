Hacker News Reader 

23.-26.10.2018


Technologies:
- ReactJs
- Node.js
   - Express.js

I chose these technologies since I had experience working with them from earlier projects of mine.

Requirements:
    "express": "^4.16.4",

    "react": "^16.5.2",

    "react-dom": "^16.5.2",

    "react-infinite-scroller": "^1.2.2",

    "react-scripts": "2.0.5",

    "react-timeago": "^4.1.9"



Description:

Hacker News Reader app allows you to seamlessly browse the articles of Hacker News (https://news.ycombinator.com/). 
Built with the trendiest technologies of today's web development, Hacker News Reader reintroduces Hacker News to you with simple but efficient design, 
ability to filter posts based on their type and other handy features. Of course, the app is mobile responsive.

Implementation:

The idea of the app developed over time so initially the only goal was to modernize the experience of reading Hacker News. However, there were a couple of things that I 
wanted to, but could not implement due to timing constraints:
- Posts with large amount of comments take lots of time to load. This could be solved by loading only a few comments at a time and loading more as the user scrolls down.
- Dynamic post images. Using OpenGraph data, we could scrape the article image and other details from the source code of the article.
- HN polls are not supported.
- Placeholder loading for the news articles and comments would have been nice.
