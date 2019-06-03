import React, { Component } from "react";
import "./App.css";
import Table from "./components/Table";
import Search from "./components/Search";
import Button from "./components/Button";

const DEFAULT_QUERY = "Redux";
const DEFAULT_HPP = "100";
const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const PARAM_PAGE = "page=";
const PARAM_HPP = "hitsPerPage=";

// const searchFilter = searchTerm => item =>
//   item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: null,
      searchKey: "",
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
  fetchSearchTopStories(searchTerm, page = 0) {
    fetch(
      `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`
    )
      .then(res => res.json())
      .then(result => this.setSearchTopStories(result))
      .catch(err => err);
  }

  setSearchTopStories = result => {
    const { hits, page } = result;

    //if page is not 0 then it's => this.state.result.hits
    //otherwise its empty
    const oldHits = page !== 0 ? this.state.result.hits : [];
    const updatedHits = [...oldHits, ...hits];
    this.setState({
      result: { hits: updatedHits, page }
    });
  };

  //when you click 'search' the fetch function is executed
  onSearchSubmit = e => {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
    e.preventDefault();
  };

  render() {
    const { searchTerm, result } = this.state;
    console.log(result);
    //if there's something in result then page is result.page from API
    const page = (result && result.page) || 0;

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
        {result && <Table list={result.hits} onDismiss={this.onDismiss} />}
        <div className='interactions'>
          <Button
            onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}
          >
            More
          </Button>
        </div>
      </div>
    );
  }
}

export default App;
