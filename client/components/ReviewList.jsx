import React from 'react';
import ReviewListEntry from './ReviewListEntry.jsx';
import Rating from 'react-rating';

const ReviewList = ({reviews, current, total, shop, filterProductReviews, filterShopReviews, avg, next, previous}) => {
  return (
    <div>
      <h3>{`${total} Reviews`}</h3>
      <Rating emptySymbol="fa fa-star-o" fullSymbol="fa fa-star" initialRating={avg} readonly={true}/>
      <div>
        <button onClick={filterProductReviews}>Reviews for this item</button>
        <div>{shop}</div>
        <button onClick={filterShopReviews}>Reviews for this shop</button>
        <div>{total}</div>
      </div>
      {reviews.map((review, index) =>
      <ReviewListEntry review={review} key={index} current={current}/>
      )}
      <button onClick={previous}>&#x0003C;-</button>
      <button onClick={next}>-></button>
    </div>
  )
}

export default ReviewList;
