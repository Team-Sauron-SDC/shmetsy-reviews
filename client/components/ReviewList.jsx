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
        <div className="testing">
        <button className="rev-button" onClick={filterProductReviews}>Reviews for this item</button>
        <span className="wt-badge">{shop}</span>
        </div>
      <div className="testing">
        <button  className="rev-button" onClick={filterShopReviews}>Reviews for this shop</button>
        <span className="wt-badge">{total}</span>
        </div>
      </div>
      {reviews.map((review, index) =>
      <ReviewListEntry review={review} key={index} current={current}/>
      )}
      <div className="wt-page" onClick={previous}>&#x2190;</div>
      <div className="wt-page">{page}</div>
      <div className="wt-page" onClick={next}>&#x2192;</div>
    </div>
  )
}

export default ReviewList;
