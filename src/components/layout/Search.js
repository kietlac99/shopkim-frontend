import React, { useState } from "react";
import $ from 'jquery'

const Search = ({ history, isAtSideBar }) => {
  const [keyword, setKeyword] = useState("");

  const searchHandler = (e) => {
    e.preventDefault();

    if (keyword.trim()) {
      history.push(`/search/${keyword}`);
      $('.search-model').fadeOut(400, function () {
        $('#search-input').val('');
    });
    } else { 
      // Nếu không, thì thay đổi URL hiện tại để load tới page đó luôn
      history.push('/search');
    }
  };

  return (
    !isAtSideBar ? (
    <form className="search-model-form" onSubmit={searchHandler}>
      <div className="input-group">
        <input
          type="text"
          id="search_field"
          className="form-control"
          placeholder="Nhập từ khóa ..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <div className="input-group-append">
          <button id="search_btn" className="btn">
            <i className="fa fa-search" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </form>
    ) : (
      <form onSubmit={searchHandler}>
          <input type="text" placeholder="Tìm kiếm..." value={keyword}
          onChange={(e) => setKeyword(e.target.value)}/>
          <button type="submit"><span className="icon_search"></span></button>
      </form>
    )
  );
};

export default Search;
