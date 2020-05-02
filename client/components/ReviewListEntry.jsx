import React from 'react';
import Rating from 'react-rating';

const ReviewListEntry = ({review}) =>
  (<div>
    <div>{review.username}</div>
    <div>{new Date(review.reviewDate).toDateString().substring(3,10) + ', ' + new Date(review.reviewDate).toDateString().substring(11)}</div>

    <Rating emptySymbol="fa fa-star-o" fullSymbol="fa fa-star" initialRating={review.rating} readonly={true}/>
    <div>{review.review}</div>
  </div>)



export default ReviewListEntry;