import axios from "axios";
import React, { useEffect, useState } from "react";
import { base_url } from "../../../../../base_urls";

const Reports = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get(base_url + "/api/dashreports.json")
      .then((res) => setUsers(res.data));
  }, []);

  // Helper to clean and convert currency/number strings
  const parseValue = (val) => {
    if (typeof val === "number") return val;
    if (!val) return 0;
    return parseFloat(val.toString().replace(/[^0-9.-]+/g, ""));
  };

  // Helper to calculate percentage change
  const calculateChangePercentage = (current, previous) => {
    if (previous === 0 || isNaN(current) || isNaN(previous)) return "N/A";
    const diff = ((current - previous) / previous) * 100;
    return `${diff >= 0 ? "+" : ""}${diff.toFixed(1)}%`;
  };

  return (
    <div>
      <div className="row">
        <div className="col-md-12">
          <div className="card-group m-b-30">
            {Array.isArray(users) && users.length > 0 ? (
              users.map((item, index) => {
                const current = parseValue(item.value);
                const previous = parseValue(item.previousValue);
                const change = calculateChangePercentage(current, previous);

                return (
                  <div className="card" key={index}>
                    <div className="card-body">
                      <div className="d-flex justify-content-between mb-3">
                        <div>
                          <span className="d-block">{item.title}</span>
                        </div>
                        <div>
                          <span
                            className={`text-${
                              change.includes("+") ? "success" : "danger"
                            }`}
                          >
                            {change}
                          </span>
                        </div>
                      </div>
                      <h3 className="mb-3">{item.value}</h3>
                      <div className="progress mb-2" style={{ height: "5px" }}>
                        <div
                          className="progress-bar bg-primary"
                          role="progressbar"
                          style={{ width: "70%" }}
                          aria-valuenow={40}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                      <p className="mb-0">
                        {item.changeDescription}
                        <span className="text-muted"> {item.previousValue}</span>
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
