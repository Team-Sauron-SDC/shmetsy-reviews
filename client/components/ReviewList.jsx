import React from 'react';
import ReviewListEntry from './ReviewListEntry.jsx';

const ReviewList = ({reviews, current}) => {
  return (
    <div>
      <h3>535 Reviews</h3>
      {reviews.map((review, index) =>
      <ReviewListEntry review={review} key={index} current={current}/>
      )}
    </div>
  )
}

export default ReviewList;
