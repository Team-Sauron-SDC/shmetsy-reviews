/* eslint-disable linebreak-style */
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import ReviewList from './components/ReviewList.jsx';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reviews: [{
        user: 'Travis Scott',
        text: 'this is honestly wack'
    },{
      user: 'Lionel Richie',
      text: 'This mask is love'
    }],
    current: '',
    }
  }

  componentDidMount() {
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
    // axios.get('/reviews', {params: {
    //   ID: this.state.current
    // }})
      .then(res => {
        console.log("this is the response", res);
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
