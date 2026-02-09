import React, { useState } from "react";

const ProfessionalExcellence = () => {
  // Data moved to top
  const initialData = [
    {
      id: 1,
      keyResult: "Production",
      indicators: ["Quality", "TAT (turn around time)"],
      weightage: 30,
      selfPercentage: "",
      roPercentage: ""
    },
    {
      id: 2,
      keyResult: "Process Improvement",
      indicators: ["PMS, New Ideas"],
      weightage: 10,
      selfPercentage: "",
      roPercentage: ""
    },
    {
      id: 3,
      keyResult: "Team Management",
      indicators: ["Team Productivity, dynamics, attendance, attrition"],
      weightage: 5,
      selfPercentage: "",
      roPercentage: ""
    },
    {
      id: 4,
      keyResult: "Knowledge Sharing",
      indicators: ["Sharing the knowledge for team productivity"],
      weightage: 5,
      selfPercentage: "",
      roPercentage: ""
    },
    {
      id: 5,
      keyResult: "Reporting and Communication",
      indicators: ["Emails/Calls/Reports and Other Communication"],
      weightage: 5,
      selfPercentage: "",
      roPercentage: ""
    }
  ];

  const [data, setData] = useState(initialData);
  const [total, setTotal] = useState({
    weightage: 85,
    selfPoints: 0,
    roPoints: 0
  });

  const calculatePoints = (weightage, percentage) => {
    if (!percentage) return 0;
    return (weightage * parseFloat(percentage)) / 100;
  };

  const handlePercentageChange = (id, type, value) => {
    // Validate input (0-100)
    if (value === "" || (parseFloat(value) >= 0 && parseFloat(value) <= 100)) {
      const updatedData = data.map(item => {
        if (item.id === id) {
          return { ...item, [type]: value };
        }
        return item;
      });

      setData(updatedData);

      // Calculate totals
      const newTotal = updatedData.reduce(
        (acc, item) => {
          return {
            weightage: acc.weightage,
            selfPoints: acc.selfPoints + calculatePoints(item.weightage, item.selfPercentage),
            roPoints: acc.roPoints + calculatePoints(item.weightage, item.roPercentage)
          };
        },
        { weightage: 85, selfPoints: 0, roPoints: 0 }
      );

      setTotal(newTotal);
    }
  };

  return (
    <section className="review-section professional-excellence">
      <div className="review-header text-center">
        <h3 className="review-title">Professional Excellence</h3>
        <p className="text-muted">Please Fill Details</p>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="table-responsive">
            <table className="table table-bordered review-table mb-0">
              <thead>
                <tr>
                  <th className="width-pixel">#</th>
                  <th>Key Result Area</th>
                  <th>Key Performance Indicators</th>
                  <th>Weightage</th>
                  <th>Percentage achieved <br />( self Score )</th>
                  <th>Points Scored <br />( self )</th>
                  <th>Percentage achieved <br />( RO's Score )</th>
                  <th>Points Scored <br />( RO )</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <React.Fragment key={row.id}>
                    {row.indicators.map((indicator, index) => (
                      <tr key={`${row.id}-${index}`}>
                        {index === 0 && <td rowSpan={row.indicators.length}>{row.id}</td>}
                        {index === 0 && <td rowSpan={row.indicators.length}>{row.keyResult}</td>}
                        <td>{indicator}</td>
                        {index === 0 && (
                          <>
                            <td rowSpan={row.indicators.length}>
                              <input
                                type="text"
                                className="form-control"
                                readOnly
                                value={row.weightage}
                              />
                            </td>
                            <td rowSpan={row.indicators.length}>
                              <input
                                type="number"
                                className="form-control"
                                min="0"
                                max="100"
                                placeholder="0-100%"
                                value={row.selfPercentage}
                                onChange={(e) => 
                                  handlePercentageChange(row.id, 'selfPercentage', e.target.value)
                                }
                              />
                            </td>
                            <td rowSpan={row.indicators.length}>
                              <input
                                type="text"
                                className="form-control"
                                readOnly
                                value={calculatePoints(row.weightage, row.selfPercentage).toFixed(2)}
                              />
                            </td>
                            <td rowSpan={row.indicators.length}>
                              <input
                                type="number"
                                className="form-control"
                                min="0"
                                max="100"
                                placeholder="0-100%"
                                value={row.roPercentage}
                                onChange={(e) => 
                                  handlePercentageChange(row.id, 'roPercentage', e.target.value)
                                }
                              />
                            </td>
                            <td rowSpan={row.indicators.length}>
                              <input
                                type="text"
                                className="form-control"
                                readOnly
                                value={calculatePoints(row.weightage, row.roPercentage).toFixed(2)}
                              />
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
                <tr>
                  <td colSpan={3} className="text-center">Total</td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      readOnly
                      value={total.weightage}
                    />
                  </td>
                  <td colSpan={1}></td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      readOnly
                      value={total.selfPoints.toFixed(2)}
                    />
                  </td>
                  <td colSpan={1}></td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      readOnly
                      value={total.roPoints.toFixed(2)}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfessionalExcellence;