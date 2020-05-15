import React from 'react';
import ReviewListEntry from './ReviewListEntry.jsx';
import Rating from 'react-rating';
import listStyles from './ReviewList.module.css';

const ReviewList = ({reviews, current, total, shop, filterProductReviews, filterShopReviews, avg, next, previous, page, classy, unselected, last, pageOne, pageLast}) => {
  return (
    <div>
      <div className="container-one">
        <div className="heading">{`${total} reviews`}</div>
          <Rating  className="head-star" emptySymbol="fa fa-star-o" fullSymbol="fa fa-star" initialRating={avg} readonly={true}/>
       </div>
      <div className="container-two">

            <div className={classy}>
              <button className="rev-button" onClick={filterProductReviews}>Reviews for this item</button>
                <span className="wt-badge">{shop}</span>
            </div>

        <div className="empty"></div>

            <div className={unselected}>
              <button  className="shop-button" onClick={filterShopReviews}>Reviews for this shop</button>
                <span className="wt-badge">{total}</span>
            </div>

      </div>
      {reviews.map((review, index) =>
      <ReviewListEntry review={review} key={index} current={current}/>
      )}
      <div className="wt-page" onClick={previous}><i className="fas fa-arrow-left"></i></div>
      <div className="wt-page" onClick={pageOne}>1</div>
      <div className="dots">...</div>
      <div className="wt-page dark">{page}</div>
      <div className="dots">...</div>
      <div className="wt-page" onClick={pageLast}>{last}</div>
      <div className="wt-page" onClick={next}><i className="fas fa-arrow-right"></i></div>
    </div>
  )
}

export default ReviewList;
