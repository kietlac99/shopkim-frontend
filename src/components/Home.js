import React, { Fragment, useEffect, useState } from "react";
import Pagination from 'react-js-pagination';
import "rc-slider/assets/index.css";

import MetaData from "./layout/MetaData";
import Product from "./product/Product";
import Loader from "./layout/Loader";
import { Route, Link } from 'react-router-dom';

import { getProducts as getProductsAction } from "../actions/productActions";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from 'react-redux';

import { formattedVND } from '../utils/formatedNumber';
import Search from "./layout/Search";

const Home = ({ match }) => {

  const alert = useAlert();
  const dispatch = useDispatch();

  const { loading, products, error, productsCount, resPerPage, filteredProuctsCount } = useSelector(state => state.products);

  const keyword = match.params.keyword;

  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([1, 10000000]);
  const [category, setCategory] = useState('');
  const [rating, setRating] = useState(0);

  const categories = [
    "Quần tây", "Đầm", "Áo vest"
  ]

  useEffect(() => {
    if(error) {
      return alert.error(error)
    }
    dispatch(getProductsAction(keyword, currentPage, price, category, rating));
  }, [dispatch, alert, error, keyword, currentPage, price, category, rating]);

  function setCurrentPageNo(pageNumber) {
    setCurrentPage(pageNumber);
  }

  let count = productsCount;
  if(keyword || category) {
    count = filteredProuctsCount;
  }

  const handlePriceSelect = (minPrice, maxPrice) => {
    // Cập nhật state price thành giá trị tương ứng
    setPrice([minPrice, maxPrice]);
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={"Mua hàng thời trang trực tuyến tốt nhất"} />

          <section className="product spad">
        <div className="container">
            <div className="row">
              {keyword || window.location.hash.includes('/search') ?  (
                <Fragment>
                  <div className="col-lg-3">
                    <div className="shop__sidebar">
                        <div className="shop__sidebar__search">
                        <Route render={({ history }) => <Search history={history} isAtSideBar={true}/>} />
                        </div>
                        <div className="shop__sidebar__accordion">
                            <div className="accordion" id="accordionExample">
                                <div className="card">
                                    <div className="card-heading">
                                        <Link href="#" data-toggle="collapse" data-target="#collapseOne">Danh mục</Link>
                                    </div>
                                    <div id="collapseOne" className="collapse show" data-parent="#accordionExample">
                                        <div className="card-body">
                                            <div className="shop__sidebar__categories">
                                                <ul className="nice-scroll">
                                                  {categories.map(category => (
                                                    <li key={category}>
                                                      <Link to="#"  onClick={() => setCategory(category)}>{category}</Link>                                
                                                    </li>
                                                  ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="card">
                                    <div class="card-heading">
                                        <Link to="#" data-toggle="collapse" data-target="#collapseTwo">Xếp hạng</Link>
                                    </div>
                                    <div id="collapseTwo" class="collapse show" data-parent="#accordionExample">
                                        <div class="card-body">
                                            <div class="shop__sidebar__brand">
                                                <ul>
                                                  {[5, 4, 3, 2 , 1].map(star => (
                                                    <li style={{cursor: 'pointer', listStyleType: 'none'}} 
                                                    key={star} 
                                                    onClick={() => setRating(star)}>
                                                      <div className="rating-outer">
                                                        <div className="rating-inner" style={{width: `${star * 20}%`}}>
                                                          
                                                        </div>
                                                      </div>
                                                    </li>
                                                  ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="card">
                                    <div className="card-heading">
                                        <Link to="#" data-toggle="collapse" data-target="#collapseThree">Giá tiền</Link>
                                    </div>
                                    <div id="collapseThree" className="collapse show" data-parent="#accordionExample">
                                        <div className="card-body">
                                            <div className="shop__sidebar__price">
                                                <ul>
                                                  <li><Link to="#" onClick={() => handlePriceSelect(200000, 500000)}>{formattedVND(200000)} - {formattedVND(500000)}</Link></li>
                                                  <li><Link to="#" onClick={() => handlePriceSelect(500000, 1000000)}>{formattedVND(500000)} - {formattedVND(1000000)}</Link></li>
                                                  <li><Link to="#" onClick={() => handlePriceSelect(1000000, 2000000)}>{formattedVND(1000000)} - {formattedVND(2000000)}</Link></li>
                                                  <li><Link to="#" onClick={() => handlePriceSelect(2000000, 5000000)}>{formattedVND(2000000)} - {formattedVND(5000000)}</Link></li>
                                                  <li><Link to="#" onClick={() => handlePriceSelect(5000000, 10000000)}>{formattedVND(5000000)} - {formattedVND(10000000)}</Link></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>                                                                            
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-9">
                    <div className="shop__product__option">
                        <div className="row">
                            <div className="col-lg-6 col-md-6 col-sm-6">
                                <div className="shop__product__option__left">
                                    <p>Danh mục:{category},Từ khóa:{keyword},Đánh giá:{rating} sao</p>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-6">
                                <div className="shop__product__option__right">
                                    <p>Tiền: {formattedVND(price[0])}-{formattedVND(price[1])}</p>                                 
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">                                                                                           
                      { products.map(product => (
                          <Product key={product._id} product={product} isShopping={true} />
                      ))}
                    </div>
                    {resPerPage <= count && (
                      <div className="row">
                          <div className="col-lg-12">
                              <div className="product__pagination">
                                <Pagination
                                  activePage={currentPage}
                                  itemsCountPerPage={resPerPage}
                                  totalItemsCount={productsCount}
                                  onChange={setCurrentPageNo}
                                />
                              </div>
                          </div>
                      </div>
                    )}
                </div>
                </Fragment>
              ) : (
                <Fragment>
                <div className="col-lg-12">
                  <ul className="filter__controls">
                      <li className="active" data-filter="*">Các sản phẩm mới nhất</li>
                  </ul>
                </div>
                  <div className="row product__filter">
                  { products.map(product => (
                        <Product key={product._id} product={product} isShopping={false} />
                  ))}
                </div>
              </Fragment>
            )}       
            </div>        
        </div>
    </section>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;
