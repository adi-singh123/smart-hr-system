import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Label, // Label imported for axis labels
} from "recharts";

const barchartdata = [
  { y: "2006", "Total Income": 100, "Total Outcome": 90 },
  { y: "2007", "Total Income": 75, "Total Outcome": 65 },
  { y: "2008", "Total Income": 50, "Total Outcome": 40 },
  { y: "2009", "Total Income": 75, "Total Outcome": 65 },
  { y: "2010", "Total Income": 50, "Total Outcome": 40 },
  { y: "2011", "Total Income": 75, "Total Outcome": 65 },
  { y: "2012", "Total Income": 100, "Total Outcome": 90 },
];

const linechartdata = [
  { y: "2006", "Total Sales": 50, "Total Revenue": 90 },
  { y: "2007", "Total Sales": 75, "Total Revenue": 65 },
  { y: "2008", "Total Sales": 50, "Total Revenue": 40 },
  { y: "2009", "Total Sales": 75, "Total Revenue": 65 },
  { y: "2010", "Total Sales": 50, "Total Revenue": 40 },
  { y: "2011", "Total Sales": 75, "Total Revenue": 65 },
  { y: "2012", "Total Sales": 100, "Total Revenue": 50 },
];

const Charts = () => {
  return (
    <div>
      <div className="row">
        <div className="col-md-12">
          <div className="row">
            {/* Bar Chart */}
            <div className="col-md-6 text-center">
              <div className="card">
                <div className="card-body">
                  <h3 className="card-title">Total Revenue</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={barchartdata}
                      margin={{ top: 0, right: 5, left: 0, bottom: 30 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="y">
                        <Label value="Year"
                        fontSize={16} 
                        offset={-5} position="insideBottom" />
                      </XAxis>
                      <YAxis>
                        <Label
                          value="Amount"
                          angle={-90}
                          position="insideLeft"
                        />
                      </YAxis>
                      <Tooltip />
                      <Legend
                        verticalAlign="top"
                        align="center"
                        wrapperStyle={{ marginTop: 0 }}
                      />
                      <Bar dataKey="Total Income" fill="#34c38f" />
                      <Bar dataKey="Total Outcome" fill="#f46a6a" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Line Chart */}
            <div className="col-md-6 text-center">
              <div className="card">
                <div className="card-body">
                  <h3 className="card-title">Sales Overview</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={linechartdata}
                      margin={{ top: 0, right: 5, left: 0, bottom: 30 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="y">
                        <Label value="Year"
                        fontSize={16}
                         offset={-5} position="insideBottom" />
                      </XAxis>
                      <YAxis>
                        <Label
                          value="Amount"
                          angle={-90}
                          position="insideLeft"
                        />
                      </YAxis>
                      <Tooltip />
                      <Legend
                        verticalAlign="top"
                        align="center"
                        wrapperStyle={{ marginTop: 0 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="Total Sales"
                        stroke="#34c38f"
                        strokeWidth={3}
                        dot={{ r: 3 }}
                        activeDot={{ r: 7 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="Total Revenue"
                        stroke="#556ee6"
                        strokeWidth={3}
                        dot={{ r: 3 }}
                        activeDot={{ r: 7 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;
