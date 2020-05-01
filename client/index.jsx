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
    }
  }

  render() {
    return (<div>
      <h1>Review List Component</h1>
      <ReviewList reviews={this.state.reviews}/>
    </div>)
  }

};

ReactDOM.render(<App />, document.getElementById('app'));
