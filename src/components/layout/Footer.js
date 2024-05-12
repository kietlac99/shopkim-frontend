import React, { Fragment } from "react";

const Footer = () => {
  return (
    <Fragment>
      <footer className="footer footer__copyright__text">
            <div className="row">
                <div className="col-lg-12 text-center">
                  <p>Copyright ©
                      <script>
                          document.write(new Date().getFullYear());
                      </script>Shop Kim - 2024,
                      All rights reserved
                  </p>                  
                </div>
            </div>
    </footer>
    </Fragment>
  );
};

export default Footer;
