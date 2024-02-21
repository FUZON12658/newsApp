import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

export class News extends Component {
  static defaultProps = {
    country: "us",
    category: "general",
    pageSize: 10,
  };

  static defaultProps = {
    country: PropTypes.string,
    category: PropTypes.string,
    pageSize: PropTypes.number,
  };

  constructor() {
    super();
    this.state = {
      articles: [],
      loading: true,
      page: 1,
      totalResults: 0,
      apiKey: process.env.REACT_APP_NEWS_API
    };
  }

  async updateNews(){
    this.props.setProgress(20);
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.state.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    let data = await fetch(url);
    this.props.setProgress(40);
    let parsedData = await data.json();
    this.props.setProgress(80);
    console.log(parsedData);
    this.setState({
      articles: parsedData.articles,
      totalResults: parsedData.totalResults,
      loading: false,
    });
    this.props.setProgress(100);
  }

  async componentDidMount() {
    this.updateNews();
  }

  fetchMoreData = async ()=>{
    this.setState({page: this.state.page + 1});
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.state.apiKey}&page=${this.state.page+1}&pageSize=${this.props.pageSize}`;
    let data = await fetch(url);
    let parsedData = await data.json();
    console.log(parsedData);
    this.setState({
      articles: this.state.articles.concat(parsedData.articles),
      totalResults: parsedData.totalResults,
    });
  }

  
  render() {
    return (
      <div className="container my-4">
        <h1 className="text-center">NewsMonkey-Top headlines</h1>
        {this.state.loading && <Spinner/>}
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.state.totalResults}
          loader={<Spinner/>}
          // scrollableTarget="scrollableDiv"
        >
          <div className="container">
          <div className="row">
            {this.state.articles.map((element) => {
              return (
                <div className="col-md-4" key={element.url}>
                  <NewsItem
                    title={element.title?element.title.slice(0, 45) : ""}
                    description={element.description}
                    imageUrl={
                      element.urlToImage?element.urlToImage:"https://www.cancercenter.com/-/media/ctca/images/others/blogs/2017/04-april/02-blog-fake-news-l.jpg?h=630&la=en&w=1200&hash=38E18B1AD452C6869D2EFC320BA63CD9"
                    }
                    newsUrl={element.url}
                  />
                </div>
              );
            })}
          </div>
          </div>
        </InfiniteScroll>  
      </div>
    );
  }
}

export default News;
