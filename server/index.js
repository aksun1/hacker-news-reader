const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();
const utils = require('./utils.js');
app.use(express.static(path.join(__dirname, 'build')));

// store comments to reduce the amount of API calls:
var comments = {};



app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// gets posts from hn api based on filter and limits
app.get('/api/posts', function (req, res) {
	
	var filter = req.query.filter;
	
	switch(filter) {
		case 'top':
			var endpoint = 'https://hacker-news.firebaseio.com/v0/topstories.json';
			break;
		case 'jobs':
			var endpoint = 'https://hacker-news.firebaseio.com/v0/jobstories.json';
			break;
		case 'new':
			var endpoint = 'https://hacker-news.firebaseio.com/v0/newstories.json';
			break;
		case 'show':
			var endpoint = 'https://hacker-news.firebaseio.com/v0/showstories.json';
			break;
		case 'best':
			var endpoint = 'https://hacker-news.firebaseio.com/v0/beststories.json';
			break;
		case 'ask':
			var endpoint = 'https://hacker-news.firebaseio.com/v0/askstories.json';
			break;
		default:
			var endpoint = 'https://hacker-news.firebaseio.com/v0/newstories.json';
	}
			
	
	var curIndex = parseInt(req.query.start,10) || 0;
	var endIndex = parseInt(req.query.start,10)+10;

	var result = {};
	var completedRequests = 0;
	
	// get all stories:
	utils.ajax(endpoint,(stories) => {
		// is there more stories remaining?
		if(stories.length>curIndex+1) {
			// fetch additional information for every story:
			stories.slice(curIndex,endIndex).map((val,index,arr) => {
				utils.ajax('https://hacker-news.firebaseio.com/v0/item/'+val+'.json',(item) => {
					if(item.kids) {
						comments[item.id] = item.kids;
					}
					// we will not need this now:
					delete item.kids;
					if(item.url) {
						item.domain = utils.extractRootDomain(item.url);
					}
					result[index] = item;
					completedRequests++;
					if(completedRequests == arr.length) {
						res.send(Object.values(result));
					}
				});
				curIndex++;
			});
		}
		else {
			res.send({'error':'No more posts.'});
		}
	});
});




// get comments for a post
app.get('/api/comments', function (req, res) {
	
	var completedRequests = 0;
	var result = {};
	// is there comments for this post?
	if(comments.hasOwnProperty(req.query.id)) {
		// loop through the top level comments:
		comments[req.query.id].map((val,index,arr) => {
			// add single comments to the data array
			utils.getComment(val,(data) => {
				delete data.kids;
				result[index] = data;
				completedRequests++;
				if(completedRequests == arr.length) {
					res.send(Object.values(result));
				}

			});
		});
	}
	else {
		res.send({'error':'no comments'});
	}

});

app.listen(process.env.PORT || 8080);