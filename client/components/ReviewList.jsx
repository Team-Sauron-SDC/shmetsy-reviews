import React from 'react';
import ReviewListEntry from './ReviewListEntry.jsx';
import Rating from 'react-rating';

const ReviewList = ({reviews, current, total, shop, filterProductReviews, filterShopReviews, avg, next, previous, page}) => {
  return (
    <div>
      <div className="container-one">
      <div className="heading">{`${total} reviews`}</div>
      <Rating  className="head-star" emptySymbol="fa fa-star-o" fullSymbol="fa fa-star" initialRating={avg} readonly={true}/>
      </div>
      <div className="container-two">
        <button className="rev-button" onClick={filterProductReviews}>Reviews for this item</button>
        <div>{shop}</div>
        <button  className="rev-button" onClick={filterShopReviews}>Reviews for this shop</button>
        <div>{total}</div>
      </div>
      {reviews.map((review, index) =>
      <ReviewListEntry review={review} key={index} current={current}/>
      )}
      <button onClick={previous}>&#x0003C;-</button>
      <button>{page}</button>
      <button onClick={next}>-></button>
    </div>
  )
}

export default ReviewList;
