import React from 'react'

const ListReviews = ({ reviews }) => {
  return (
    <div className="reviews w-75">
        {reviews && reviews.map(review => (
            <div key={review._id} className="product__details__tab__content__item">
            <h5>{review.name}</h5>
            <div className="rating-outer">
              <div className="rating-inner" style={{ width: `${(review.rating /5) * 100}%` }}></div>
            </div>
            <p>{review.comment}</p>
            </div>
        ))}
    </div>
  )
}

export default ListReviews