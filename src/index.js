import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { Provider } from 'react-redux';
import store from './store';

import { positions, transitions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { CLIENT_ID } from './config';

const options = {
  timeout: 5000,
  position: positions.BOTTOM_CENTER,
  transition: transitions.SCALE,
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store} >
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <AlertProvider template={AlertTemplate} {...options}>
        <App />
      </AlertProvider>
    </GoogleOAuthProvider>
  </Provider>
);
