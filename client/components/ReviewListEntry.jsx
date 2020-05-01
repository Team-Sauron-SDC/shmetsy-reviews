import React from 'react';

const ReviewListEntry = ({review}) =>
  (<div>
    <div>{review.user}</div>
    <div>{review.text}</div>
  </div>)



export default ReviewListEntry;