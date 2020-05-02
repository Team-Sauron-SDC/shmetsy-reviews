/* eslint-disable linebreak-style */
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import ReviewList from './components/ReviewList.jsx';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reviews: [],
      shopReviews: [],
      len: 0,
    current: '',
    numProdRev: 0,
    }
    this.filterProductReviews = this.filterProductReviews.bind(this);
    this.filterShopReviews = this.filterShopReviews.bind(this);
  }

  componentDidMount() {
    console.log(window.location.href);
    const uniqueID = window.location.pathname.substring(1,2);
    console.log(uniqueID);
    this.setState({
      current: uniqueID
    }, () => {
      this.getReviews();
    });

  }

  getReviews() {
    axios.get(`/reviews/${this.state.current}`)
      .then(res => {
        console.log("this is the response", res.data);
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
    })
  }

  filterShopReviews() {
    const shopRevs = this.state.shopReviews;
    this.setState({
      reviews: shopRevs,
    })
  }

  render() {
    return (<div>
      <h1>Review List Component</h1>
      <ReviewList
      reviews={this.state.reviews}
      current={this.state.current}
      total={this.state.len}
      shop={this.state.numProdRev}
      filterProductReviews={this.filterProductReviews}
      filterShopReviews={this.filterShopReviews}/>
    </div>)
  }

};

ReactDOM.render(<App />, document.getElementById('app'));
