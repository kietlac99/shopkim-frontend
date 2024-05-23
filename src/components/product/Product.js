import React from "react";
import { Link } from "react-router-dom";

const Product = ({ product, isShopping, isRelatedProduct = false }) => {

  const formattedPrice = product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  const imageUrl = product.images[0].url;
  console.log(imageUrl);

  const rating = product.ratings; // Điểm đánh giá của sản phẩm (ví dụ: 4.75 hoặc 4.5)

  // Tính số sao dựa trên điểm đánh giá
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<i className="fa fa-star" key={i}></i>);
    } else if (rating < i && rating > i - 1) {
      stars.push(<i className="fa fa-star-half-o" key={i}></i>);
    } else {
      stars.push(<i className="fa fa-star-o" key={i}></i>);
    }
  }
  const productItem = (
    <div className="product__item">
      <Link to={`/product/${product._id}`}>
        <div className="product__item__pic" style={{ backgroundImage: `url('${imageUrl}')` }}>
            <ul className="product__hover">
                <li><Link to={`/product/${product._id}`}><img src="img/icon/search.png" alt=""/></Link></li>
            </ul>
        </div>
      </Link>
        <div className="product__item__text">
            <h6>{product.name}</h6>
            <Link to={`/product/${product._id}`} className="add-cart">{product.numOfReviews} Đánh giá</Link>
            <div className="rating">
              {stars}
            </div>
            <h5>{formattedPrice}</h5>
        </div>
    </div>
  );

  return ( 
    isRelatedProduct ? (
      <div className="col-lg-3 col-md-6 col-sm-6 col-sm-6">
        {productItem}
      </div>
    ) : !isShopping ? (
        <div className="col-lg-3 col-md-6 col-sm-6 col-md-6 col-sm-6 mix new-arrivals">
        {productItem}
      </div>   
    ): (
      <div className="col-lg-4 col-md-6 col-sm-6">
        {productItem}
      </div>
    )
  );
};

export default Product;
