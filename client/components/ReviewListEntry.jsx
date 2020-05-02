import React from 'react';
// import Rating from 'react-rating';
import ReactStars from 'react-stars';

const ReviewListEntry = ({review}) =>
  (<div>
    <div>{review.username}</div>
    <div>{new Date(review.reviewDate).toDateString().substring(3,10) + ', ' + new Date(review.reviewDate).toDateString().substring(11)}</div>
    <ReactStars count={5} value={review.rating} edit={false} size={30}/>
    {/* <div>{review.rating}</div> */}
    <div>{review.review}</div>
  </div>)



export default ReviewListEntry;