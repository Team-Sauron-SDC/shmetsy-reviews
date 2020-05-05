import React from 'react';
import ReviewListEntry from './ReviewListEntry.jsx';
import ReactStars from 'react-stars';

const ReviewList = ({reviews, current, total, shop, filterProductReviews, filterShopReviews, avg}) => {
  return (
    <div>
      <h3>{`${total} Reviews`}</h3>
      <ReactStars count={5} value={avg} edit={false} size={30} color2={"black"} />
      <div>
        <button onClick={filterProductReviews}>Reviews for this item</button>
        <div>{shop}</div>
        <button onClick={filterShopReviews}>Reviews for this shop</button>
        <div>{total}</div>
      </div>
      {reviews.map((review, index) =>
      <ReviewListEntry review={review} key={index} current={current}/>
      )}
    </div>
  )
}

export default ReviewList;
