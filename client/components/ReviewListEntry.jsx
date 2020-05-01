import React from 'react';

const ReviewListEntry = ({review}) =>
  (<div>
    <div>{review.username}</div>
    <div>{review.reviewDate}</div>
    <div>{review.review}</div>
  </div>)



export default ReviewListEntry;