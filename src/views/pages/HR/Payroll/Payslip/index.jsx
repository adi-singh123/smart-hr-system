import React from "react";
import Breadcrumbs from "../../../../../components/Breadcrumbs";
import { Applogo } from "../../../../../Routes/ImagePath";

const PaySlip = () => {
  // Employee Data
  const employee = {
    name: "John Doe",
    position: "Web Designer",
    employeeId: "FT-0009",
    joiningDate: "1 Jan 2023",
    payslipId: "#49029",
    month: "February, 2024"
  };

  // Company Data
  const company = {
    name: "Dreamguy's Technologies",
    address: ["3864 Quiet Valley Lane", "Sherman Oaks, CA, 91403"],
    logo: Applogo
  };

  // Earnings Data
  const earnings = {
    basicSalary: 6500,
    hra: 55,
    conveyance: 55,
    otherAllowance: 55,
    get total() {
      return this.basicSalary + this.hra + this.conveyance + this.otherAllowance;
    }
  };

  // Deductions Data
  const deductions = {
    tds: 0,
    providentFund: 0,
    esi: 0,
    loan: 300,
    get total() {
      return this.tds + this.providentFund + this.esi + this.loan;
    }
  };

  // Net Salary Calculation
  const netSalary = earnings.total - deductions.total;

  // Proper Number to Words Converter
  const numberToWords = (num) => {
    const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];

    function convertLessThanOneThousand(num) {
      if (num === 0) return '';
      if (num < 10) return ones[num];
      if (num < 20) return teens[num - 10];
      if (num < 100) {
        return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + ones[num % 10] : '');
      }
      return ones[Math.floor(num / 100)] + ' hundred' + (num % 100 !== 0 ? ' and ' + convertLessThanOneThousand(num % 100) : '');
    }

    if (num === 0) return 'zero';
    let result = '';
    const scales = ['', 'thousand', 'million', 'billion', 'trillion'];
    let scaleIndex = 0;

    while (num > 0) {
      const chunk = num % 1000;
      if (chunk !== 0) {
        let chunkStr = convertLessThanOneThousand(chunk);
        if (scaleIndex > 0) {
          chunkStr += ' ' + scales[scaleIndex];
        }
        result = chunkStr + ' ' + result;
      }
      num = Math.floor(num / 1000);
      scaleIndex++;
    }

    return result.trim() + ' only';
  };

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <Breadcrumbs
          maintitle="Payslip"
          title="Dashboard"
          subtitle="Payslip"
          modal="#add_categories"
          name="Add Salary"
        />

        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                <h4 className="payslip-title">
                  Payslip for the month of {employee.month.split(",")[0]} {employee.month.split(",")[1]}
                </h4>
                <div className="row">
                  <div className="col-sm-6 m-b-20">
                    <img src={company.logo} className="inv-logo" alt="Logo" />
                    <ul className="list-unstyled mb-0">
                      <li>{company.name}</li>
                      {company.address.map((line, index) => (
                        <li key={index}>{line}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="col-sm-6 m-b-20">
                    <div className="invoice-details">
                      <h3 className="text-uppercase">Payslip {employee.payslipId}</h3>
                      <ul className="list-unstyled">
                        <li>
                          Salary Month: <span>{employee.month}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12 m-b-20">
                    <ul className="list-unstyled">
                      <li>
                        <h5 className="mb-0">
                          <strong>{employee.name}</strong>
                        </h5>
                      </li>
                      <li>
                        <span>{employee.position}</span>
                      </li>
                      <li>Employee ID: {employee.employeeId}</li>
                      <li>Joining Date: {employee.joiningDate}</li>
                    </ul>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-6">
                    <div>
                      <h4 className="m-b-10">
                        <strong>Earnings</strong>
                      </h4>
                      <table className="table table-bordered">
                        <tbody>
                          <tr>
                            <td>
                              <strong>Basic Salary</strong>{" "}
                              <span className="float-end">${earnings.basicSalary.toLocaleString()}</span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <strong>House Rent Allowance (H.R.A.)</strong>{" "}
                              <span className="float-end">${earnings.hra.toLocaleString()}</span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <strong>Conveyance</strong>{" "}
                              <span className="float-end">${earnings.conveyance.toLocaleString()}</span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <strong>Other Allowance</strong>{" "}
                              <span className="float-end">${earnings.otherAllowance.toLocaleString()}</span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <strong>Total Earnings</strong>{" "}
                              <span className="float-end">
                                <strong>${earnings.total.toLocaleString()}</strong>
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div>
                      <h4 className="m-b-10">
                        <strong>Deductions</strong>
                      </h4>
                      <table className="table table-bordered">
                        <tbody>
                          <tr>
                            <td>
                              <strong>Tax Deducted at Source (T.D.S.)</strong>{" "}
                              <span className="float-end">${deductions.tds.toLocaleString()}</span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <strong>Provident Fund</strong>{" "}
                              <span className="float-end">${deductions.providentFund.toLocaleString()}</span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <strong>ESI</strong>{" "}
                              <span className="float-end">${deductions.esi.toLocaleString()}</span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <strong>Loan</strong>{" "}
                              <span className="float-end">${deductions.loan.toLocaleString()}</span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <strong>Total Deductions</strong>{" "}
                              <span className="float-end">
                                <strong>${deductions.total.toLocaleString()}</strong>
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="col-sm-12">
                    <p>
                      <strong>Net Salary: ${netSalary.toLocaleString()}</strong> ({numberToWords(netSalary)})
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaySlip;