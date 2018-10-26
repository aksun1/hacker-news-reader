import React, { Component } from 'react';
import TimeAgo from 'react-timeago';
import InfiniteScroll from 'react-infinite-scroller';
import newslogo from './news.png';


class Comment extends Component {
  render() {
	var comment = this.props.data;
	var replies = this.props.data.hasOwnProperty('comments') && this.props.data.comments.map((reply)=><Comment key={reply.id} data={reply} />);
	// while dangerouslySetInnerHTML should get rid of the script tags by itself, there's a chance of XSS and could be improved
    return (
		<div className="comment">
			{!comment.deleted ? <p className="text" dangerouslySetInnerHTML={{__html: comment.text}} /> : <p className="text"><i>This post was deleted.</i></p>}
			<div className="actions">
				<span>posted <TimeAgo date={comment.time*1000} />{!comment.deleted && ' by '+comment.by}</span>
			</div>
			<div className="replies">
			{replies}
			</div>
		</div>
    );

  }
}

class NewsItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			viewing: false,
			comments:[],
			loaded:0
		};
		
		this.viewThread = this.viewThread.bind(this);
		this.loadComments = this.loadComments.bind(this);
	}
	loadComments() {
		fetch('/api/comments?id='+this.props.data.id)
		  .then(response => response.json())
		  .then((data) => {
					this.setState({ comments:data,loaded:1 })
				});

	}

	viewThread(e) {
		e.preventDefault();
		this.setState({
			viewing:!this.state.viewing
		},()=> {
			if(this.state.viewing) {
				this.loadComments()
			}
		});
	}
  render() {
	var item = this.props.data;
	var comments = this.state.loaded && (this.state.comments.hasOwnProperty('error') ? 'No comments found.' : this.state.comments.map((com)=><Comment key={com.id} data={com}/>));
    return (
      <div className="news-item">
		<div className="row">
			<div className="image">
				<img src={newslogo} alt="logo" />
			</div>
			<div className="content">
				<h2><a href={item.url} target="_blank" rel="noopener noreferrer">{item.title}</a></h2>
				<div className="actions">
					<span className="type">{item.type}</span>
					<span className="source">{item.domain}</span>
					<span>posted <TimeAgo date={item.time*1000} /> by {item.by}</span>
					<a href="#" onClick={this.viewThread}>{this.state.viewing ? 'hide' : 'show'} thread</a>
				</div>
			</div>
		</div>
	  {this.state.viewing &&
		  <div className="row">
		  <h3>Comments</h3>
		  {comments ? comments : 'Loading...'}
		  </div>
	  }

	  </div>
    );
  }
}

class News extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loaded:0,
			news:{'top':[],'new':[],'jobs':[],'show':[],'best':[],'ask':[]},
			items:{'top':0,'new':0,'jobs':0,'show':0,'best':0,'ask':0},
			hasMore:{'top':true,'new':true,'jobs':true,'show':true,'best':true,'ask':true}
		};
		
		this.loadFunc = this.loadFunc.bind(this);
	}
	loadFunc() {
		var currentFilter=this.props.filter;
		fetch('/api/posts?start='+this.state.items[this.props.filter]+'&filter='+this.props.filter)
		  .then(response => response.json())
		  .then((data) => {
					if(!data.hasOwnProperty('error')) {
						var newstate = this.state;
						newstate.news[this.props.filter] = [...this.state.news[this.props.filter],...data];
						newstate.items[this.props.filter] = this.state.items[this.props.filter]+data.length;
						this.setState({news: newstate.news, loaded: 1, items: newstate.items});
					}
					else {
						var newstate = this.state;
						newstate.hasMore[this.props.filter] = false;
						this.setState({hasMore: newstate.hasMore});
					}
				});

	}
  render() {
	var items = this.state.loaded ? this.state.news[this.props.filter].map((item)=><NewsItem key={item.id} data={item} />) : '';
    return (
      <div className="container news-items">
		<InfiniteScroll
			pageStart={0}
			loadMore={this.loadFunc}
			hasMore={this.state.hasMore[this.props.filter]}
			loader={<div className="loader" key={0}>Loading ...</div>}
		>
		{items}
		</InfiniteScroll>
      </div>
    );
  }
}

export {News};
