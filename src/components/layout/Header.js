import React, { Fragment } from "react";
import { Route, Link, useLocation} from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';
import { logoutAction } from '../../actions/userActions';

import AdminHeader from "./AdminHeader";

import "../../App.css";

import Search from "./Search";

const Header = () => {
  const alert = useAlert();
  const dispatch = useDispatch();

  const { user, loading, isAuthenticated } = useSelector(state => state.auth);
  const { cartItems } = useSelector(state => state.cart);

  const logoutHandler = () => {
    dispatch(logoutAction());
    alert.success('Logged out successfully.')
  }
  const location = useLocation();
  const handleClick = () => {
    if (location.pathname === '/search') {
        window.location.reload();
    }
    };

    const isAdminPage = location.pathname.includes('/dashboard') || location.pathname.includes('/admin');

  return (
    <Fragment>
    <div id="preloder">
        <div className="loader"></div>
    </div>

    {!loading && isAuthenticated && user.role === 'admin' && isAdminPage ? (
          <AdminHeader />
        ) : (
          <Fragment>
            <div className="offcanvas-menu-overlay"></div>
    <div className="offcanvas-menu-wrapper">
        <div className="offcanvas__option">
          {user ? (
            <div className="offcanvas__links">
               <figure className="avatar avatar-nav">
                  <img src={user.avatar && user.avatar.url} 
                  alt={user && user.name}
                  className="rounded-circle"
                  />
                </figure>
                <span>{user && user.name}<i className="arrow_carrot-down"></i></span>
                <ul>
                    {user && user.role === 'admin' && (
                        <li><Link to="/dashboard">Thống Kê</Link></li>
                    )}
                    <li>Đơn Hàng</li>
                    <li><Link to="/me">Thông Tin Cá Nhân</Link></li>
                    <li><Link to="/" onClick=
                      {logoutHandler}>
                        Đăng Xuất
                      </Link></li>
                </ul>
            </div>
          ): !loading && <div className="offcanvas__top__hover">
                            <Link to='/login'>Đăng nhập</Link>
                        </div>}             
        </div>
        <div className="offcanvas__nav__option">
        <Link to="#" className="search-switch"><img src="img/icon/search.png" alt=""/></Link>
        <Link to="/cart"><img src="img/icon/cart.png" alt=""/> <span>{cartItems.length}</span></Link>
        </div>
        <div id="mobile-menu-wrap"></div>
        <div className="offcanvas__text">
            <p>Chào mừng đến với Shop Kim, trang bán hàng thời trang đẳng cấp</p>
        </div>
    </div>

    <header className="header">
        <div className="header__top">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6 col-md-7">
                        <div className="header__top__left">
                            <p>Chào mừng đến với Shop Kim, trang bán hàng thời trang đẳng cấp</p>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-5">
                        <div className="header__top__right">
                            
                            {user ? (
                              <div className="header__top__hover">
                                <figure className="avatar avatar-nav">
                                  <img src={user.avatar && user.avatar.url} 
                                  alt={user && user.name}
                                  className="rounded-circle"
                                  />
                                </figure>
                                <span>{user && user.name}<i className="arrow_carrot-down"></i></span>
                                <ul>
                                {user && user.role === 'admin' && (
                                    <Link to="/dashboard"><li>Thống Kê</li></Link>
                                )}
                                    <Link to="/orders/me"><li>Đơn Hàng</li></Link>
                                    <Link to="/me"><li style={{ whiteSpace: "nowrap" }}>Thông Tin Cá Nhân</li></Link>
                                    <Link to="/" onClick=
                                      {logoutHandler}>
                                        <li>Đăng Xuất</li>                                    
                                    </Link>
                                </ul>
                              </div>
                            ) : !loading && <div className="header__top__links">
                                                <Link to='/login'>Đăng nhập</Link>
                                            </div>}
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="container">
            <div className="row">
                <div className="col-lg-3 col-md-3">
                    <div className="header__logo">
                        <Link to="/"><img src="images/shopkim-logo-2.png" alt=""/></Link>
                    </div>
                </div>
                <div className="col-lg-6 col-md-6">
                    <nav className="header__menu mobile-menu">
                        <ul>
                            <li className="active"><Link to="/">Trang Chủ</Link></li>
                            <li><Link to="/search" onClick={handleClick}>Mua sắm</Link></li>
                            <li><Link to="/search/đầm">Đầm</Link></li>
                            <li><Link to="/search/quần tây">Quần Tây</Link></li>
                            <li><Link to="/search/áo vest">Áo Vest</Link></li>
                        </ul>
                    </nav>
                </div>
                <div className="col-lg-3 col-md-3">
                    <div className="header__nav__option">
                        <Link to="#" className="search-switch"><img src="img/icon/search.png" alt=""/></Link>
                        <Link to="/cart"><img src="img/icon/cart.png" alt=""/> <span>{cartItems.length}</span></Link>
                    </div>
                </div>
            </div>
            <div className="canvas__open"><i className="fa fa-bars"></i></div>
        </div>
    </header>

    <div className="search-model">
        <div className="h-100 d-flex align-items-center justify-content-center">
            <div className="search-close-switch">+</div>
            <Route render={({ history }) => <Search history={history} isAtSideBar={false}/>} />
        </div>
    </div>
          </Fragment>
        )}

    
    </Fragment>
  );
};

export default Header;
