import React, { Component } from "react";
import "./App.css";
import Table from "./components/Table";
import Search from "./components/Search";

const DEFAULT_QUERY = "Redux";
const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";

// const searchFilter = searchTerm => item =>
//   item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY
    };
  }

  onDismiss = id => {
    const updatedHits = this.state.result.hits.filter(
      item => item.objectID !== id
    );
    console.log(updatedHits);

    this.setState({
      result: { ...this.state.result, hits: updatedHits }
    });
  };

  //search term is updating every time you type a character
  onSearchChange = e => {
    this.setState({ searchTerm: e.target.value });
  };

  //when component is mounted it will run fetch function
  componentDidMount() {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
  }

  //fetching results based on search term
  fetchSearchTopStories(searchTerm) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(res => res.json())
      .then(result => this.setState({ result }))
      .catch(err => err);
  }

  //when you click 'search' the fetch function is executed
  onSearchSubmit = e => {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
    e.preventDefault();
  };

  render() {
    const { searchTerm, result } = this.state;

    return (
      <div className='page'>
        <div className='interactions'>
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search
          </Search>
        </div>
        {result && (
          <Table
            list={result.hits}
            onDismiss={this.onDismiss}
            pattern={searchTerm}
          />
        )}
      </div>
    );
  }
}

export default App;
