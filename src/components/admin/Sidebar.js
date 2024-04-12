import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar-wrapper">
        <nav id="sidebar">
            <ul className="list-unstyled components">
                <li>
                    <Link to="/dashboard"><i className="fa fa-tachometer"></i> Thống Kê</Link>
                </li>
        
                <li>
                    <a href="#productSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle"><i
                        className="fa fa-product-hunt"></i> Sản Phẩm</a>
                    <ul className="collapse list-unstyled" id="productSubmenu">
                        <li>
                            <Link to="/admin/products"><i className="fa fa-clipboard"></i> Tất Cả</Link>
                        </li>
        
                        <li>
                            <Link to="/admin/product"><i className="fa fa-plus"></i> Thêm Mới</Link>
                        </li>
                    </ul>
                </li>

                <li>
                    <Link to="/admin/orders"><i className="fa fa-shopping-basket"></i> Đơn Hàng</Link>
                </li>

                <li>
                    <Link to="/admin/users"><i className="fa fa-users"></i> Người Dùng</Link>
                </li>

                <li>
                    <Link to="/admin/reviews"><i className="fa fa-star"></i> Đánh Giá</Link>
                </li>

                <li>
                    <a href="#trashSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle"><i
                        className="fa fa-trash"></i> Thùng Rác</a>
                    <ul className="collapse list-unstyled" id="trashSubmenu">
                        <li>
                            <Link to="/admin/orders/deleted"><i className="fa fa-shopping-basket"></i> Đơn Hàng</Link>
                        </li>
        
                        <li>
                            <Link to="/admin/products/deleted"><i className="fa fa-product-hunt"></i> Sản Phẩm</Link>
                        </li>

                        <li>
                            <Link to="/admin/users/deleted"><i className="fa fa-users"></i> Người Dùng</Link>
                        </li>
                    </ul>
                </li>
            </ul>
        </nav>
    </div>
  )
}

export default Sidebar;
