const https = require('https');

module.exports = {
	ajax: function(url, callback) {
		https.get(url, (resp) => {
		  let data = '';

		  // A chunk of data has been recieved.
		  resp.on('data', (chunk) => {
			data += chunk;
		  });

		  resp.on('end', () => {
			callback(JSON.parse(data));
		  });

		}).on("error", (err) => {
		  console.log("Error: " + err.message);
		});

		},
	getComment: function(val,cb) {
		var completedRequests = 0;
		var result = {};
		// get single comment data
		this.ajax('https://hacker-news.firebaseio.com/v0/item/'+val+'.json',(item) => {
			if(item) {
				delete item.id;
				delete item.type;
				delete item.parent;

				// is there replies?
				if(item.hasOwnProperty('kids')) {
					item.comments = {};
					// go through the replies
					item.kids.map((val,i,arr)=>{
						// get single reply data
						this.getComment(val,(data)=>{
							delete item.id;
							delete item.type;
							delete item.parent;
							item.comments[i] = data;
							completedRequests++;
							if(completedRequests == arr.length) {
								item.comments = Object.values(item.comments);
								cb(item);
							}

						});
					});
				}
				else {
					cb(item);
				}
			}
		});
	},
	extractHostname: function(url) {
		var hostname;
		//find & remove protocol (http, ftp, etc.) and get hostname

		if (url.indexOf("//") > -1) {
			hostname = url.split('/')[2];
		}
		else {
			hostname = url.split('/')[0];
		}

		//find & remove port number
		hostname = hostname.split(':')[0];
		//find & remove "?"
		hostname = hostname.split('?')[0];

		return hostname;
	},
	extractRootDomain: function(url) {
		var domain = this.extractHostname(url),
			splitArr = domain.split('.'),
			arrLen = splitArr.length;

		//extracting the root domain here
		//if there is a subdomain 
		if (arrLen > 2) {
			domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
			//check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
			if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
				//this is using a ccTLD
				domain = splitArr[arrLen - 3] + '.' + domain;
			}
		}
		return domain;
	}
};