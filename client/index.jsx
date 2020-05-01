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
    current: '',
    }
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
        })
      }).catch((err) => {
        console.log("There was an error fetching data");
      })
  }

  render() {
    return (<div>
      <h1>Review List Component</h1>
      <ReviewList reviews={this.state.reviews} current={this.state.current}/>
    </div>)
  }

};

ReactDOM.render(<App />, document.getElementById('app'));
