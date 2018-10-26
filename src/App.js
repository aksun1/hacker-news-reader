import React, { Component } from 'react';
import './App.css';
import {News} from './News.js';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			filter:'top'
		};
		
		this.handleFilterChange = this.handleFilterChange.bind(this);
	}
	handleFilterChange(e) {
		this.setState({
			filter: e.target.value
		});
	}
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Hacker News Reader</h1>
        </header>
		<section className="actions">
			<div className="container">
				<ul className="actions-list">
					<li>
						<label>
							<input type="radio" value="top" checked={this.state.filter === 'top'} onChange={this.handleFilterChange} />
							<span className={this.state.filter == 'top' ? 'active' : undefined}>top</span>
						</label>
					</li>
					<li>
						<label>
							<input type="radio" value="best" checked={this.state.filter === 'best'} onChange={this.handleFilterChange} />
							<span className={this.state.filter == 'best' ? 'active' : undefined}>best</span>
						</label>
					</li>
					<li>
						<label>
							<input type="radio" value="show" checked={this.state.filter === 'show'} onChange={this.handleFilterChange} />
							<span className={this.state.filter == 'show' ? 'active' : undefined}>show</span>
						</label>
					</li>
					<li>
						<label>
							<input type="radio" value="ask" checked={this.state.filter === 'ask'} onChange={this.handleFilterChange} />
							<span className={this.state.filter == 'ask' ? 'active' : undefined}>ask</span>
						</label>
					</li>
					<li>
						<label>
							<input type="radio" value="jobs" checked={this.state.filter === 'jobs'} onChange={this.handleFilterChange} />
							<span className={this.state.filter == 'jobs' ? 'active' : undefined}>jobs</span>
						</label>
					</li>
					<li>
						<label>
							<input type="radio" value="new" checked={this.state.filter === 'new'} onChange={this.handleFilterChange} />
							<span className={this.state.filter == 'new' ? 'active' : undefined}>new</span>
						</label>
					</li>
				</ul>
			</div>
		</section>
		<section className="content">
			<News filter={this.state.filter} />
		</section>
      </div>
    );
  }
}

export default App;
