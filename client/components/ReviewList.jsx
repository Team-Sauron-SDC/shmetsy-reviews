import React from 'react';
import ReviewListEntry from './ReviewListEntry.jsx';

const ReviewList = ({reviews, current, total}) => {
  return (
    <div>
      <h3>{`${total} Reviews`}</h3>
      {reviews.map((review, index) =>
      <ReviewListEntry review={review} key={index} current={current}/>
      )}
    </div>
  )
}

export default ReviewList;
