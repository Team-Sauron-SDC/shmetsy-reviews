import React from 'react';

const ReviewListEntry = ({review}) =>
  (<div>
    <div>{review.username}</div>
    <div>{new Date(review.reviewDate).toDateString().substring(3,10) + ', ' + new Date(review.reviewDate).toDateString().substring(11)}</div>
    <div>{review.rating}</div>
    <div>{review.review}</div>
  </div>)



export default ReviewListEntry;