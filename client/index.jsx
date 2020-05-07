/* eslint-disable linebreak-style */
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import ReviewList from './components/ReviewList.jsx';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: 1,
      reviews: [],
      displayed: [],
      sIndex: 0,
      eIndex: 4,
      shopReviews: [],
      prodReviews: [],
      onProd: true,
      len: 0,
      current: '',
      numProdRev: 0,
      avgShopRating: 0,
    }
    this.filterProductReviews = this.filterProductReviews.bind(this);
    this.filterShopReviews = this.filterShopReviews.bind(this);
    this.onNextReviews = this.onNextReviews.bind(this);
    this.onPreviousReviews = this.onPreviousReviews.bind(this);
  }

  componentDidMount() {
    const uniqueID = window.location.pathname.substring(1,2);
    this.setState({
      current: uniqueID
    }, () => {
      this.getReviews();
    });

  }

  getReviews() {
    axios.get(`/reviews/${this.state.current}`)
      .then(res => {
        this.setState({
          reviews: res.data,
          shopReviews: res.data,
        })
      }).catch((err) => {
        console.log("There was an error fetching data");
      }).then(() => {
        this.getShopReviewCount();
      }).then(() => {
        this.filterProductReviews();
      }).then(() => {
        this.getAverageShopReview();
      }).then(() => {
        let slice = this.state.reviews.slice(0,4);
        this.setState({
          displayed: slice
        })
      })
  }

  getShopReviewCount () {
    const len = this.state.shopReviews.length;
    this.setState({
      len: len
    })
  }

  filterProductReviews() {
    const prodRevs = [];
    const allRevs = this.state.reviews;
    const curr = this.state.current;
    allRevs.forEach(rev => {
      if (rev.productID == curr) {
        prodRevs.push(rev);
      }
    });
    this.setState({
      reviews: prodRevs,
      numProdRev: prodRevs.length,
      displayed: prodRevs.slice(0,4),
      sIndex: 0,
      eIndex: 4,
      prodReviews: prodRevs,
      onProd: true,
      counter: 1,
    })
  }

  filterShopReviews() {
    const shopRevs = this.state.shopReviews;
    this.setState({
      displayed: shopRevs.slice(0,4),
      sIndex: 0,
      eIndex: 4,
      onProd: false,
      counter: 1,
    })
  }

  getAverageShopReview() {
    const shopRevs = this.state.shopReviews;
    let total = 0;
    shopRevs.forEach((rev) => {
      total += rev.rating;
    })
    let avg = total/this.state.len;
    this.setState({
      avgShopRating: avg
    })
  }

  onNextReviews() {
    if(this.state.onProd === true) {
      let counter = this.state.counter;
      let productRevLength = this.state.prodReviews.length;
      let maxPresses = Math.floor(productRevLength / 4);
      if(counter <= maxPresses) {
        let start = this.state.sIndex + 4;
        let end = this.state.eIndex + 4;
        let next = this.state.prodReviews.slice(start, end);
        counter ++;
        this.setState({
          counter: counter,
          sIndex: start,
          eIndex: end,
          displayed: next,
        })
      }
    } else {
      let counter = this.state.counter;
      let shopRevLength = this.state.shopReviews.length;
      let maxPresses = Math.floor(shopRevLength / 4);
      if(counter <= maxPresses) {
        let start = this.state.sIndex + 4;
        let end = this.state.eIndex + 4;
        let next = this.state.shopReviews.slice(start, end);
        counter ++;
        this.setState({
          counter: counter,
          sIndex: start,
          eIndex: end,
          displayed: next,
        })
      }
    }
  }

  onPreviousReviews() {
    if(this.state.onProd === true) {
      let counter = this.state.counter;
      let productRevLength = this.state.prodReviews.length;
      let maxPresses = Math.floor(productRevLength / 4);
      if(counter > 1) {
        let start = this.state.sIndex - 4;
        let end = this.state.eIndex - 4;
        let next = this.state.prodReviews.slice(start, end);
        counter --;
        this.setState({
          counter: counter,
          sIndex: start,
          eIndex: end,
          displayed: next,
        })
      }
    } else {
      let counter = this.state.counter;
      let shopRevLength = this.state.shopReviews.length;
      let maxPresses = Math.floor(shopRevLength / 4);
      if(counter > 1) {
        let start = this.state.sIndex - 4;
        let end = this.state.eIndex - 4;
        let next = this.state.shopReviews.slice(start, end);
        counter --;
        this.setState({
          counter: counter,
          sIndex: start,
          eIndex: end,
          displayed: next,
        })
      }
    }
  }





  render() {
    return (<div>
      <h1>Review List Component</h1>
      <ReviewList
      reviews={this.state.displayed}
      current={this.state.current}
      total={this.state.len}
      shop={this.state.numProdRev}
      filterProductReviews={this.filterProductReviews}
      filterShopReviews={this.filterShopReviews}
      avg={this.state.avgShopRating}
      next={this.onNextReviews}
      previous={this.onPreviousReviews}
      page={this.state.counter}
      />
    </div>)
  }

};

ReactDOM.render(<App />, document.getElementById('app'));
