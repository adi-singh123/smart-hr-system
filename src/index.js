import React, { useEffect } from "react";
import ReactDOM from 'react-dom/client';
import Approuter from "./Routes/Approuter";
import { Provider } from "react-redux";
import { BrowserRouter, useLocation } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';  
import "@fortawesome/fontawesome-free/css/fontawesome.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./assets/css/line-awesome.min.css";
import "./assets/scss/main.scss";
import "./assets/css/material.css";
//tostify
import { Slide, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { store, persistor } from "./Redux/store";
import { PersistGate } from "redux-persist/integration/react";
const root = ReactDOM.createRoot(document.getElementById('root'));
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};
root.render(
  <>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter basename="">
          <ScrollToTop />
          <Approuter />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Slide}
          />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </>
);
