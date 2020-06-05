/* eslint-disable linebreak-style */
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import ReviewList from './components/ReviewList.jsx';

const ip = 'http://54.219.182.134';


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
      classProd: "selected",
      classShop: "unselected",
      last: 0,
    }
    this.filterProductReviews = this.filterProductReviews.bind(this);
    this.filterShopReviews = this.filterShopReviews.bind(this);
    this.onNextReviews = this.onNextReviews.bind(this);
    this.onPreviousReviews = this.onPreviousReviews.bind(this);
    this.onPageOneClick = this.onPageOneClick.bind(this);
    this.onLastPageClick = this.onLastPageClick.bind(this);
  }

  componentDidMount() {
    let newPath = '';
    for(var i = 0; i < window.location.pathname.length; i ++) {
      if(window.location.pathname[i] !== "/") {
        newPath += window.location.pathname[i];
      }
    }
    this.setState({
      current: newPath,
    }, () => {
      this.getReviews();
    });
  }

  getReviews() {
    axios.get(`${ip}/api/reviews/${this.state.current}`)
      .then(res => {
        console.log(res.data);
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
      if (rev.productid == curr) {
        prodRevs.push(rev);
      }
    });
    let max = Math.floor(prodRevs.length / 4) + 1;
    this.setState({
      reviews: prodRevs,
      numProdRev: prodRevs.length,
      displayed: prodRevs.slice(0,4),
      sIndex: 0,
      eIndex: 4,
      prodReviews: prodRevs,
      onProd: true,
      counter: 1,
      classProd: "selected",
      classShop: "unselected",
      last: max,
    })
  }

  filterShopReviews() {
    const shopRevs = this.state.shopReviews;
    let max = Math.floor(shopRevs.length / 4) + 1;
    this.setState({
      displayed: shopRevs.slice(0,4),
      sIndex: 0,
      eIndex: 4,
      onProd: false,
      counter: 1,
      classShop: "selected",
      classProd: "unselected",
      last: max
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
      console.log(maxPresses);
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

  onPageOneClick () {
    if(this.state.onProd === true) {
        let first = this.state.prodReviews.slice(0, 4);
        this.setState({
          counter: 1,
          sIndex: 0,
          eIndex: 4,
          displayed: first,
        })
      } else {
        let first = this.state.shopReviews.slice(0, 4);
        this.setState( {
          counter: 1,
          sIndex: 0,
          eIndex: 4,
          displayed: first,
        })
      }
    }

    onLastPageClick () {
      if(this.state.onProd === true) {
        let test = 4 * this.state.last;
        let end = this.state.prodReviews.length;
        let start = end % 4;
        let evenLast = this.state.prodReviews.slice(end - 4, end);
        let last = this.state.prodReviews.slice(end - start, test);
        let lastPage = Math.floor(end / 4) + 1;
        if(start !== 0) {
          this.setState({
            counter: lastPage,
            sIndex: test - 4,
            eIndex: test,
            displayed: last,
          })
        } else {
          this.setState({
            counter: lastPage,
            sIndex: end - 4,
            eIndex: end,
            displayed: evenLast,
          })
        }

      } else {
        let test = 4 * this.state.last;
        let end = this.state.shopReviews.length;
        let start = end % 4;
        let evenLast = this.state.shopReviews.slice(end - 4, end);
        let last = this.state.shopReviews.slice(end - start, test);
        let lastPage = Math.floor(end / 4) + 1;
        if(start !== 0) {
          this.setState({
            counter: lastPage,
            sIndex: test - 4,
            eIndex: test,
            displayed: last,
          })
        } else {
          this.setState({
            counter: lastPage,
            sIndex: end - 4,
            eIndex: end,
            displayed: evenLast,
          })
        }
      }
    }

  render() {
    return (
      <div className="reviews-container">
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
          classy={this.state.classProd}
          unselected={this.state.classShop}
          last={this.state.last}
          pageOne={this.onPageOneClick}
          pageLast={this.onLastPageClick}
        />
      </div>
    );
  }

};

ReactDOM.render(<App />, document.getElementById('reviewz'));
