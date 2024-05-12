import React, { Fragment, useEffect, useState} from "react";
import { Link } from "react-router-dom";

import Loader from "../layout/Loader";
import MetaData from "../layout/MetaData";

import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { getProductDetails as getProductDetailsAction, clearErrors, newReviewAction } from "../../actions/productActions";
import { addItemToCartAction } from '../../actions/cartActions';
import { NEW_REVIEW_RESET } from '../../constants/productConstants';
import ListReviews from "../review/ListReviews";
import axios from "axios";

import Product from "../product/Product";

import { SHOP_KIM_API } from '../../config';

const ProductDetails = ({ match }) => {

  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [activeTabIndex , setActiveTabIndex ] = useState(0);

  const [relatedProduct, setRelatedProduct] = useState([]);

  const [showReviewForm, setShowReviewForm] = useState(false);

  const [tempRating, setTempRating] = useState(0);

  const dispatch = useDispatch();

  const { loading, error, product } = useSelector(state => state.productDetails);
  const { user } = useSelector(state => state.auth);
  const { error: reviewError, success } = useSelector(state => state.newReview);

  const alert = useAlert();

  const formattedPrice = product?.price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

  useEffect(() => {
    const getProductData = async () => {
      const link = `${SHOP_KIM_API}/api/v1/product/products?category=${product.category}`;
      try {
        const { data } = await axios({
          url: link,
          method: 'GET'
        });
        const filteredProducts = data.payload.products.filter(
          relatedProduct => relatedProduct._id !== product._id
        );

        setRelatedProduct(filteredProducts.slice(0, 4));
      } catch (error) {
        const dataError = error.response.data.errors[0].message || error.response.data.errors[0].msg;
        alert.error(dataError);
      }
    }

    if (product) {
      getProductData();
    }
  }, [product, alert]);
 

  const productRating = product.ratings; 
  const productStars = [];
  for (let i = 1; i <= 5; i++) {
    if (productRating >= i) {
      productStars.push(<i className="fa fa-star" key={i}></i>);
    } else if (productRating < i && productRating > i - 1) {
      productStars.push(<i className="fa fa-star-half-o" key={i}></i>);
    } else {
      productStars.push(<i className="fa fa-star-o" key={i}></i>);
    }
  }

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
    setQuantity(prevQty => prevQty + 1);
  };

  const decreaseQty = () => {
    if (quantity > 1) {
      setQuantity(prevQty => prevQty - 1);
    }
  };

  const handleStarClick = (value) => {
    setRating(value);
    setTempRating(0);
  };

  const handleMouseEnter = (value) => {
    setTempRating(value); // Cập nhật giá trị tạm thời
  };

  const handleMouseLeave = () => {
    setRating(rating);
    setTempRating(0)
  };


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

          <section className="shop-details">
        <div className="product__details__pic">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="product__details__breadcrumb">
                            <Link to="/">Trang Chủ</Link>
                            <Link to="/search">Mua sắm</Link>
                            <span>Chi tiết sản phẩm</span>
                        </div>
                    </div>
                </div>
                <div className="row">
                  <div className="col-lg-3 col-md-3">
                      <ul className="nav nav-tabs" role="tablist">
                          {product.images &&
                              product.images.map((image, index) => (
                                  <li className="nav-item" key={index}>
                                      <a 
                                          className={`nav-link${index === 0 ? ' active' : ''}`} 
                                          data-toggle="tab" 
                                          href={`#${image.public_id}`} 
                                          role="tab"
                                          onClick={() => setActiveTabIndex(index)} // Thêm sự kiện onClick
                                      >
                                          <div className="product__thumb__pic set-bg" style={{ backgroundImage: `url('${image.url}')` }}></div>
                                      </a>
                                  </li>
                              ))}                           
                      </ul>
                  </div>
                  <div className="col-lg-6 col-md-9">
                      <div className="tab-content">
                          {product.images && product.images.map((image, index) => (
                              <div className={`tab-pane${activeTabIndex === index ? ' active' : ''}`} id={image.public_id} role="tabpanel" key={index}>
                                  <div className="product__details__pic__item">
                                      <img src={image.url} alt={product.title} style={{ maxWidth: "474px", maxHeight: "533px" }}/>
                                  </div>
                              </div>                          
                          ))}                      
                      </div>
                  </div>
              </div>
            </div>
        </div>
        <div className="product__details__content">
            <div className="container">
                <div className="row d-flex justify-content-center">
                    <div className="col-lg-8">
                        <div className="product__details__text">
                            <h4>{product.name}</h4>
                            <div className="rating">
                                {productStars}
                                <span> - {product.numOfReviews} đánh giá</span>
                            </div>
                            <h3>
                              {formattedPrice} 
                              <span style={{ color: product.stock > 0 ? 'green' : 'red' }}>
                                {product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}
                              </span>
                            </h3>
                            <div className="product__details__cart__option">
                                <div className="quantity">
                                    <div className="pro-qty">
                                      <span className="fa fa-angle-up dec qtybtn" onClick={increaseQty}></span>
                                        <input type="text" value={quantity} readOnly/>
                                        <span className="fa fa-angle-down inc qtybtn" onClick={decreaseQty}></span>
                                    </div>
                                </div>
                                <Link to="#" className="primary-btn" disabled={product.stock <= 0} 
                                onClick={addToCart}>Thêm vào giỏ hàng</Link>
                            </div>
                            {user ? 
                              <div className="product__details__btns__option">
                                <Link to="#" onClick={() => setShowReviewForm(true)}><i className="fa fa-star" onClick={() => setShowReviewForm(true)}></i> Đánh giá</Link>
                              </div> :

                              <div className="product__details__btns__option">
                                <Link to="#"><i className="fa fa-star"></i> Đăng nhập để đánh giá</Link>
                              </div>
                            }
                            

                            {showReviewForm && (
                              <form onSubmit={reviewHandler} className="mt-4">
                              <h5>Đánh giá sản phẩm</h5>
                              <div className="form-group">
                                  {[1, 2, 3, 4, 5].map((value) => (
                                      <span
                                          key={value}
                                          className={`fa fa-star ${value <= (tempRating || rating) ? 'checked' : ''}`}
                                          onClick={() => handleStarClick(value)}
                                          onMouseEnter={() => handleMouseEnter(value)}
                                          onMouseLeave={handleMouseLeave}
                                          style={{ cursor: 'pointer', marginRight: '5px' }}
                                      ></span>
                                  ))}
                              </div>
                              <div className="form-group">
                                  <textarea
                                      className="form-control"
                                      value={comment}
                                      onChange={(e) => setComment(e.target.value)}
                                      placeholder="Nhập nhận xét của bạn..."
                                      style={{ minHeight: '100px', resize: 'vertical' }}
                                  />
                              </div>
                              <div className="form-group text-right">
                                  <button type="submit" className="btn btn-primary">Gửi đánh giá</button>
                              </div>
                            </form>
                            )}


                            <div className="product__details__last__option">                       
                                <ul>
                                    <li><span>Mã sản phẩm:</span> {product._id}</li>
                                    <li><span>Danh mục:</span> {product.category}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="product__details__tab">
                            <ul className="nav nav-tabs" role="tablist">
                                <li className="nav-item">
                                    <a className="nav-link active" data-toggle="tab" href="#tabs-5"
                                    role="tab">Chi tiết sản phẩm</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" data-toggle="tab" href="#tabs-6" role="tab">Đánh giá sản phẩm ({product?.reviews?.length})</a>
                                </li>
                            </ul>
                            <div className="tab-content">
                                <div className="tab-pane active" id="tabs-5" role="tabpanel">
                                    <div className="product__details__tab__content">
                                        <div className="product__details__tab__content__item">
                                            <h5>Thông tin sản phẩm</h5>
                                            <p>{product.description}</p>                                            
                                        </div>
                                    </div>
                                </div>
                                <div className="tab-pane" id="tabs-6" role="tabpanel">
                                    <div className="product__details__tab__content">
                                    {product.reviews && product.reviews.length > 0 && (
                                      <ListReviews reviews={product.reviews} />
                                    )}
                                    </div>
                                </div>        
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section className="related spad">
        <div className="container">
            <div className="row">
                <div className="col-lg-12">
                    <h3 className="related-title">Sản phẩm liên quan</h3>
                </div>
            </div>
            <div className="row">             
            { relatedProduct.map(product => (
                  <Product key={product._id} product={product} isShopping={false} isRelatedProduct={true} />
            ))}
            </div>
        </div>
    </section>

        </Fragment>
      )}
    </Fragment>
  );
};

export default ProductDetails;
