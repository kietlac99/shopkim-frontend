import React, { Fragment, useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";

import Loader from "../layout/Loader";
import MetaData from "../layout/MetaData";

import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { getProductDetails as getProductDetailsAction, clearErrors, newReviewAction } from "../../actions/productActions";
import { addItemToCartAction } from '../../actions/cartActions';
import { NEW_REVIEW_RESET } from '../../constants/productConstants';
import ListReviews from "../review/ListReviews";

const ProductDetails = ({ match }) => {

  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const dispatch = useDispatch();

  const { loading, error, product } = useSelector(state => state.productDetails);
  const { user } = useSelector(state => state.auth);
  const { error: reviewError, success } = useSelector(state => state.newReview);

  const alert = useAlert();

  const formattedPrice = product?.price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

  useEffect(() => {
    dispatch(getProductDetailsAction(match.params.id));

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (reviewError) {
      alert.error(reviewError);
      dispatch(clearErrors());
    }

    if(success) {
      alert.success('Đánh giá hoàn tất!');
      dispatch({ type: NEW_REVIEW_RESET });
    }
  }, [dispatch, alert, error, reviewError, match.params.id, success]);

  const addToCart = () => {
    dispatch(addItemToCartAction(match.params.id, quantity));
    alert.success('Sản Phẩm Đã Thêm Vào Giỏ Hàng');
  };

  const increaseQty = () => {
    const count = document.querySelector('.count');

    if (count.valueAsNumber >= product.stock) return;

    const qty = count.valueAsNumber + 1;
    setQuantity(qty);
  };

  const decreaseQty = () => {
    const count = document.querySelector('.count');

    if (count.valueAsNumber <= 1) return;

    const qty = count.valueAsNumber - 1;
    setQuantity(qty);
  };

  function setUserRatings() {
    const stars = document.querySelectorAll('.star');

    stars.forEach((star, index) => {
      star.starValue = index + 1;

      ['click', 'mouseover', 'mouseout'].forEach(function(e) {
        star.addEventListener(e, showRatings);
      });
    });

    function showRatings(e) {
      stars.forEach((star, index) => {
        if(e.type === 'click') {
          if(index < this.starValue) {
            star.classList.add('orange');

            setRating(this.starValue);
          } else {
            star.classList.remove('orange');
          }
        }

        if(e.type === 'mouseover') {
          if(index < this.starValue) {
            star.classList.add('yellow');
          } else {
            star.classList.remove('yellow')
          }
        }

        if(e.type === 'mouseout') {
          star.classList.remove('yellow')
        }
      })
    }
  }

  const reviewHandler = () => {
    const formData = new FormData();

    formData.set('rating', rating);
    formData.set('comment', comment);
    formData.set('productId', match.params.id);

    dispatch(newReviewAction(formData));
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={product.name} />
          <div className="row f-flex justify-content-around">
            <div className="col-12 col-lg-5 img-fluid" id="product_image">
              <Carousel pause="hover">
                {product.images &&
                  product.images.map((image) => (
                    <Carousel.Item key={image.public_id}>
                      <img
                        className="d-block w-100"
                        src={image.url}
                        alt={product.title}
                      />
                    </Carousel.Item>
                  ))}
              </Carousel>
            </div>

            <div className="col-12 col-lg-5 mt-5">
              <h3>{product.name}</h3>
              <p id="product_id">Sản Phẩm # {product._id}</p>

              <hr />

              <div className="rating-outer">
                <div
                  className="rating-inner"
                  style={{
                    width: `${(product.ratings / 5) * 100}%`,
                  }}
                ></div>
              </div>
              <span id="no_of_reviews">
                ({product.numOfReviews} Đánh Giá)
              </span>

              <hr />

              <p id="product_price">{formattedPrice}</p>
              <div className="stockCounter d-inline">
                <span className="btn btn-danger minus" onClick={decreaseQty}>-</span>

                <input
                  type="number"
                  className="form-control count d-inline"
                  value={quantity}
                  readOnly
                />

                <span className="btn btn-primary plus" onClick={increaseQty}>+</span>
              </div>
              <button
                type="button"
                id="cart_btn"
                className="btn btn-primary d-inline ml-4"
                disabled={product.stock <= 0}
                onClick={addToCart}
              >
                Thêm vào giỏ hàng
              </button>

              <hr />

              <p>
                Trạng thái:{" "}
                <span
                  id="stock_status"
                  className={
                    product.stock > 0 ? "greenColor" : "redColor"
                  }
                >
                  {product.stock > 0
                    ? "Còn hàng"
                    : "Hết hàng"}
                </span>
              </p>

              <hr />

              <h4 className="mt-2">Mô tả sản phẩm:</h4>
              <p>{product.description}</p>
              <hr />
              <p id="product_seller mb-3">
                Nhà cung cấp: <strong>{product.seller}</strong>
              </p>

              {user ? <button
                id="review_btn"
                type="button"
                className="btn btn-primary mt-4"
                data-toggle="modal"
                data-target="#ratingModal"
                onClick={setUserRatings}
              >
                Đánh giá sản phẩm
              </button>
              :
                <div className="alert alert-danger mt-5" type='alert'>Đăng nhập để đánh giá sản phẩm.</div>
              }
              

              <div className="row mt-2 mb-5">
                <div className="rating w-50">
                  <div
                    className="modal fade"
                    id="ratingModal"
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="ratingModalLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog" role="document">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title" id="ratingModalLabel">
                            Đánh giá
                          </h5>
                          <button
                            type="button"
                            className="close"
                            data-dismiss="modal"
                            aria-label="Close"
                          >
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div className="modal-body">
                          <ul className="stars">
                            <li className="star">
                              <i className="fa fa-star"></i>
                            </li>
                            <li className="star">
                              <i className="fa fa-star"></i>
                            </li>
                            <li className="star">
                              <i className="fa fa-star"></i>
                            </li>
                            <li className="star">
                              <i className="fa fa-star"></i>
                            </li>
                            <li className="star">
                              <i className="fa fa-star"></i>
                            </li>
                          </ul>

                          <textarea
                            name="review"
                            id="review"
                            className="form-control mt-3"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                          >

                          </textarea>

                          <button
                            className="btn my-3 float-right review-btn px-4 text-white"
                            onClick={reviewHandler}
                            data-dismiss="modal"
                            aria-label="Close"
                          >
                            Xác nhận
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {product.reviews && product.reviews.length > 0 && (
            <ListReviews reviews={product.reviews} />
          )}

        </Fragment>
      )}
    </Fragment>
  );
};

export default ProductDetails;
