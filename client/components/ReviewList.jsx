import React from 'react';
import ReviewListEntry from './ReviewListEntry.jsx';

const ReviewList = ({reviews}) => {
  return (
    <div>
      <h3>535 Reviews</h3>
      {reviews.map((review, index) =>
      <ReviewListEntry review={review} key={index}/>
      )}
    </div>
  )
}

export default ReviewList;
