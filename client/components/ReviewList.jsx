import React from 'react';
import ReviewListEntry from './ReviewListEntry.jsx';

const ReviewList = ({reviews, current, total, shop, filterProductReviews}) => {
  return (
    <div>
      <h3>{`${total} Reviews`}</h3>
      <div>
        <button onClick={filterProductReviews}>Reviews for this item</button>
        <div>{shop}</div>
        <button>Reviews for this shop</button>
        <div>{total}</div>
      </div>
      {reviews.map((review, index) =>
      <ReviewListEntry review={review} key={index} current={current}/>
      )}
    </div>
  )
}

export default ReviewList;
