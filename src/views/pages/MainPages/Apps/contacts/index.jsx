import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import ContactContents from "./contactContents";

// Import your Redux thunks to fetch data
import { get_employee_data } from "../../../../../Redux/services/Employee";
import { fetchClients } from "../../../../../Redux/services/Client";

const Contacts = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [windowDimension, detectHW] = useState({
    winWidth: window.innerWidth,
    winHeight: window.innerHeight,
  });

  const detectSize = () => {
    detectHW({
      winWidth: window.innerWidth,
      winHeight: window.innerHeight,
    });
  };

  useEffect(() => {
    // Dispatch actions to fetch all employees and clients when the component mounts
    dispatch(get_employee_data());
    dispatch(fetchClients());
  }, [dispatch]);

  useEffect(() => {
    window.addEventListener("resize", detectSize);
    return () => {
      window.removeEventListener("resize", detectSize);
    };
  }, [windowDimension]);

  useEffect(() => {
    let firstload = localStorage.getItem("minheight");
    if (firstload === "false") {
      setTimeout(function () {
        window.location.reload(1);
        localStorage.removeItem("minheight");
      }, 1000);
    }
  }, []);

  useEffect(() => {
    const handleCategoryChange = (e) => setSelectedCategory(e.detail);
    window.addEventListener("change-category", handleCategoryChange);
    return () => window.removeEventListener("change-category", handleCategoryChange);
  }, []);

  return (
    <>
      <div className="page-wrapper" style={{ minHeight: windowDimension.winHeight }}>
        <div className="chat-main-row">
          <div className="chat-main-wrapper">
            <div className="col-lg-12 message-view">
              <div className="chat-window">
                <div className="fixed-header">
                  <div className="row align-items-center">
                    <div className="col-6">
                      <h4 className="page-title mb-0">Contacts</h4>
                    </div>
                    <div className="col-6">
                      <div className="navbar justify-content-end">
                        <div className="search-box m-t-0">
                          <div className="input-group input-group-sm">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Search contacts..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <span className="input-group-append">
                              <button className="btn" type="button">
                                <i className="fa fa-search" />
                              </button>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <ContactContents searchTerm={searchTerm} selectedCategory={selectedCategory} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contacts;