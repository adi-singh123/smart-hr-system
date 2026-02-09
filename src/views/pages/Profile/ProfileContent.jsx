/** @format */

import { Table } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addBank, fetchBank } from "../../../Redux/services/Profile";
import { getName } from "../../../Redux/services/User";
import { useParams } from "react-router-dom";
import {
  Avatar_01,
  Avatar_02,
  Avatar_05,
  Avatar_09,
  Avatar_10,
  Avatar_11,
  Avatar_12,
  Avatar_13,
  Avatar_16,
  eye,
  laptop,
} from "../../../Routes/ImagePath";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { fetchAssets } from "../../../Redux/services/Assets";
import { get_employee_data } from "../../../Redux/services/Employee";
import { customAlert } from "../../../utils/Alert";
import axios from "axios";
import { fetchProjects } from "../../../Redux/services/Project";

export const ProjectDetails = ({ showProjects, showBank, showAssets }) => {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const [nameMap, setNameMap] = useState({});
  const allProjects = useSelector((state) => state.project.allProjects);
  const filteredProjects = allProjects.filter((project) => {
    // Project members array
    let teamMembers = [];
    try {
      teamMembers =
        typeof project.projectMembers === "string"
          ? JSON.parse(project.projectMembers)
          : project.projectMembers;
      teamMembers = Array.isArray(teamMembers) ? teamMembers.flat() : [];
    } catch (e) {
      teamMembers = [];
    }

    // Check if UserId is in teamMembers
    return teamMembers.includes(userId);
  });
  const isLoad = useSelector((state) => state.project.isLoading);

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchAssets());
  }, [dispatch]);

  // Function to load user name by ID and cache it
  const loadName = async (UserId) => {
    // Avoid calling API if name is already loaded
    if (!nameMap.hasOwnProperty(UserId)) {
      try {
        const res = await dispatch(getName(UserId)).unwrap();
        setNameMap((prev) => {
          // Only add if not already present
          if (!prev.hasOwnProperty(UserId)) {
            return { ...prev, [UserId]: res };
          }
          return prev;
        });
      } catch (error) {
        setNameMap((prev) => {
          if (!prev.hasOwnProperty(UserId)) {
            return { ...prev, [UserId]: "Unknown" };
          }
          return prev;
        });
      }
    }
  };
  useEffect(() => {
    allProjects.forEach((project) => {
      if (project.project_leader_id) loadName(project.project_leader_id);

      let teamMembers = [];
      try {
        const parsed =
          typeof project.projectMembers === "string"
            ? JSON.parse(project.projectMembers)
            : project.projectMembers;
        teamMembers = Array.isArray(parsed) ? parsed.flat() : [];
      } catch (e) {
        console.error("Invalid projectMembers format:", project.projectMembers);
        teamMembers = [];
      }

      teamMembers.forEach((id) => loadName(id));
    });
  }, [allProjects]);

  const salerytype = [
    { value: 1, label: "Weekly  Type" },
    { value: 2, label: "Hourly Type" },
    { value: 3, label: "Daily Type" },
    { value: 4, label: "Monthly Type" },
  ];
  const bank = [
    { value: 1, label: "Bank transfer" },
    { value: 2, label: "Check" },
    { value: 3, label: "Cash" },
  ];
  const pf = [
    { value: 1, label: "Yes" },
    { value: 2, label: "No" },
  ];
  const esi = [
    { value: 1, label: "Yes" },
    { value: 2, label: "No" },
  ];
  const rate = [
    { value: 1, label: "1%" },
    { value: 2, label: "2%" },
    { value: 3, label: "3%" },
    { value: 4, label: "4%" },
    { value: 5, label: "5%" },
    { value: 6, label: "6%" },
    { value: 7, label: "7%" },
    { value: 8, label: "8%" },
    { value: 9, label: "9%" },
    { value: 10, label: "10%" },
  ];
  const [isLoading, setIsLoading] = useState(true);
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#ff9b44" : "#fff",
      color: state.isFocused ? "#fff" : "#000",
      "&:hover": {
        backgroundColor: "#ff9b44",
      },
    }),
  };
  const assetdata = useSelector((state) => state.Assets?.assets || []);

  const {
    handleSubmit: handleSubmitAsset,
    control: controlAsset,
    register: registerAsset,
    setValue,
    formState: { errors: assetErrors },
    reset,
  } = useForm();

  const getUserIdFromURL = () => {
    const pathSegments = window.location.pathname.split("/");
    return pathSegments[pathSegments.length - 1]; // Get last part of the URL
  };
  const [editingAssetId, setEditingAssetId] = useState(null);
  const UserId = getUserIdFromURL();
  console.log(UserId);

  const [staffOptions, setStaffOptions] = useState([]);
  console.log(assetdata);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Dispatch action to get employee data
        const data = await dispatch(get_employee_data());
        console.log(data);
        // Assuming that your action returns a promise and the data is in 'data.payload'
        if (data && data?.payload?.data?.users) {
          // Format the employee data to be in { value, label } format
          const staffOptionsData = data.payload.data.users.map((employee) => ({
            value: employee.id, // Assuming `id` is the unique identifier for the employee
            label: `${employee.first_name} ${employee.last_name}`, // Combine first_name and second_name
          }));

          // Store formatted data in local state
          setStaffOptions(staffOptionsData);
        }
      } catch (err) {
        console.error(err); // Log the error for debugging purposes
      }
    };

    fetchData(); // Call fetchData to initiate the data fetching
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    setValue: valueSet,
    control,
    reset: resetValue,
    watch,
    formState: { errors },
  } = useForm();
  const watchPFRate = watch("employeePFRate");
  const watchPFAdditionalRate = watch("pfAdditionalRate");
  const watchESIRate = watch("employeeESIRate");
  const watchESIAdditionalRate = watch("esiAdditionalRate");

  // State for total rate calculation
  const [totalPFRate, setTotalPFRate] = useState("N/A");
  const [totalESIRate, setTotalESIRate] = useState("N/A");

  // Calculate Total PF Rate dynamically
  useEffect(() => {
    const pfRate = parseFloat(watchPFRate?.value || 0);
    const additionalPF = parseFloat(watchPFAdditionalRate?.value || 0);

    const calculatedTotalPF = pfRate + additionalPF;
    setTotalPFRate(`${calculatedTotalPF.toFixed(2)}`);
  }, [watchPFRate, watchPFAdditionalRate]);

  // Calculate Total ESI Rate dynamically
  useEffect(() => {
    const esiRate = parseFloat(watchESIRate?.value || 0);
    const additionalESI = parseFloat(watchESIAdditionalRate?.value || 0);

    const calculatedTotalESI = esiRate + additionalESI;
    setTotalESIRate(`${calculatedTotalESI.toFixed(2)}`);
  }, [watchESIRate, watchESIAdditionalRate]);
  const [showForm, setShowForm] = useState(false); // Form visibility state

  const UserIdd = getUserIdFromURL();

  useEffect(() => {
    async function fetchData() {
      // Clear previous form data so old data doesn't show
      resetValue({
        salaryType: "",
        salaryAmount: "",
        paymentType: "",
        pfNumber: "",
        employeePFRate: "",
        pfAdditionalRate: "",
        totalPFRate: "",
        esiNumber: "",
        employeeESIRate: "",
        esiAdditionalRate: "",
        totalESIRate: "",
      });
      // Fetch new bank data if UserId is available
      if (UserIdd) {
        await dispatch(fetchBank(UserIdd));
      }
    }
    fetchData();
  }, [dispatch, UserIdd, resetValue]);

  const bankData = useSelector(
    (data) => data?.employee?.bankandstatutory?.data
  );

  console.log("fetchingbankdata", bankData);
  useEffect(() => {
    if (bankData && Object.keys(bankData).length > 0) {
      // Salary Details
      valueSet(
        "salaryType",
        salaryTypes.find((item) => item.value === bankData.salaryType) || {
          value: bankData.salaryType,
          label: bankData.salaryType,
        }
      );
      valueSet("salaryAmount", bankData.salaryAmount);
      valueSet(
        "paymentType",
        paymentTypes.find((item) => item.value === bankData.paymentType) || {
          value: bankData.paymentType,
          label: bankData.paymentType,
        }
      );

      // PF Information
      valueSet("pfNumber", bankData.pfNumber);
      valueSet(
        "employeePFRate",
        pfRates.find(
          (item) => item.value === String(bankData.employeePFRate)
        ) || {
          value: bankData.employeePFRate,
          label: `${bankData.employeePFRate}%`,
        }
      );
      valueSet(
        "pfAdditionalRate",
        additionalRates.find(
          (item) => item.value === String(bankData.additionalPfRate)
        ) || {
          value: bankData.additionalPfRate,
          label: `${bankData.additionalPfRate}%`,
        }
      );
      valueSet("totalPFRate", `${bankData.totalPFRate}%`);

      // ESI Information
      valueSet("esiNumber", bankData.esiNumber);
      valueSet(
        "employeeESIRate",
        esiRates.find(
          (item) => item.value === String(bankData.employeeESIRate)
        ) || {
          value: bankData.employeeESIRate,
          label: `${bankData.employeeESIRate}%`,
        }
      );
      valueSet(
        "esiAdditionalRate",
        additionalRates.find(
          (item) => item.value === String(bankData.additionalEsiRate)
        ) || {
          value: bankData.additionalEsiRate,
          label: `${bankData.additionalEsiRate}%`,
        }
      );
      valueSet("totalESIRate", `${bankData.totalESIRate}%`);
    } else {
      // Reset fields if no data exists
      resetValue({
        salaryType: "",
        salaryAmount: "",
        paymentType: "",
        pfNumber: "",
        employeePFRate: "",
        pfAdditionalRate: "",
        totalPFRate: "",
        esiNumber: "",
        employeeESIRate: "",
        esiAdditionalRate: "",
        totalESIRate: "",
      });
    }
  }, [bankData, valueSet, reset]);

  const addingasset = () => {
    reset();
    setEditingAssetId(null);
    handleOpenForm();
  };
  const handleOpenForm = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);
  const onSubmit = (data) => {
    console.log("Submitted Data:", data);
  };
  const [userNames, setUserNames] = useState({});
  const fetchUserName = async (UserId) => {
    if (!UserId || userNames[UserId]) return; // Skip if already fetched

    try {
      const response = await dispatch(getName(UserId)).unwrap();
      setUserNames((prev) => ({ ...prev, [UserId]: response })); // Store full name
    } catch (error) {
      console.error("Error fetching user name:", error);
    }
  };

  // Fetch assignee names on assetdata change
  useEffect(() => {
    if (assetdata) {
      assetdata.forEach((asset) => {
        if (asset.assignee) fetchUserName(asset.assignee);
      });
    }
  }, [assetdata]);

  const salaryTypes = [
    { value: "monthly", label: "Monthly Salary" },
    { value: "hourly", label: "Hourly Wage" },
    { value: "weekly", label: "Weekly Salary" },
    { value: "biweekly", label: "Biweekly Salary" },
    { value: "daily", label: "Daily Wage" },
    { value: "commission", label: "Commission-Based" },
    { value: "contract", label: "Contract-Based" },
  ];

  const paymentTypes = [
    { value: "bank_transfer", label: "Bank Transfer (NEFT/RTGS)" },
    { value: "cheque", label: "Cheque Payment" },
    { value: "cash", label: "Cash Payment" },
    { value: "upi", label: "UPI Payment" },
    { value: "crypto", label: "Cryptocurrency (BTC/ETH)" }, // Rare but possible
    { value: "paypal", label: "PayPal Transfer" },
  ];

  const pfRates = [
    { value: "12", label: "12% - Standard EPF Rate" },
    { value: "10", label: "10% - For Organizations with <20 Employees" },
    { value: "8", label: "8% - Reduced Contribution (Special Cases)" },
    { value: "14", label: "14% - Employer Superannuation Rate" },
  ];

  const esiRates = [
    { value: "3.25", label: "3.25% - Employer ESI Contribution" },
    { value: "0.75", label: "0.75% - Employee ESI Contribution" },
    { value: "4.00", label: "4.00% - Total ESI Contribution" },
    { value: "1.00", label: "1.00% - Small Business ESI Rate" },
  ];

  const additionalRates = [
    { value: "2", label: "2% Additional Contribution" },
    { value: "3", label: "3% Additional Contribution" },
    { value: "5", label: "5% Additional Contribution" },
    { value: "7", label: "7% - High Bonus Rate" },
    { value: "10", label: "10% - Special Allowance Rate" },
    { value: "15", label: "15% - Senior Employee Contribution" },
  ];

  const submitbank = (data) => {
    const getUserIdFromURL = () => {
      const pathSegments = window.location.pathname.split("/");
      return pathSegments[pathSegments.length - 1];
    };

    const UserId = getUserIdFromURL();
    console.log(data);
    const formattedData = {
      UserId,
      salaryDetails: {
        salaryType: data.salaryType?.value || null,
        salaryAmount: data.salaryAmount || null,
        paymentType: data.paymentType?.value || null,
      },
      pfInfo: {
        pfNumber: data.pfNumber || null,
        employeePFRate: data.employeePFRate?.value || null,
        additionalpfRate: data.pfAdditionalRate?.value || null,
        totalRate: totalPFRate,
      },
      esiInfo: {
        esiNumber: data.esiNumber || null,
        employeeESIRate: data.employeeESIRate?.value || null,
        additionalEsiRate: data.esiAdditionalRate?.value || null,
        totalRate: totalESIRate,
      },
    };
    dispatch(addBank(formattedData));

    console.log("Formatted Submission Data:", formattedData);
  };
  return (
    <>
      <div className="tab-content ">
        {/* Projects Tab */}
        {showProjects && (
          <div id="emp_projects">
            <div className="row">
              {isLoad ? (
                <p>Loading projects...</p>
              ) : filteredProjects.length === 0 ? (
                <p>No projects found for this employee.</p>
              ) : (
                filteredProjects.map((project) => {
                  const teamMembers =
                    typeof project.projectMembers === "string"
                      ? JSON.parse(project.projectMembers)
                      : project.projectMembers;

                  return (
                    <div
                      className="col-lg-4 col-sm-6 col-md-4 col-xl-3 d-flex"
                      key={project.id}
                    >
                      <div className="card w-100 shadow-sm">
                        <div className="card-body">
                          <h4 className="project-title mt-2 mb-2">
                            <Link
                              to={`/project-view/${project.id}`}
                              className="text-dark font-4xl"
                            >
                              {project.projectName}
                            </Link>
                          </h4>
                          <p
                            className="text-dark mt-2 font-sm"
                            dangerouslySetInnerHTML={{
                              __html: project.description,
                            }}
                          />
                          <div className="pro-deadline mb-2">
                            <div className="text-dark fw-semibold">
                              Deadline:
                            </div>
                            <div className="text-muted">
                              {new Date(project.endDate).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="project-members mb-2">
                            <div className="text-dark fw-semibold">
                              Project Leader:
                            </div>
                            <div className="text-muted small">
                              {nameMap[project.project_leader_id] ||
                                "Loading..."}
                            </div>
                          </div>
                          <div className="project-members mb-2">
                            <div className="text-dark fw-semibold">
                              Team Members:
                            </div>
                            <div className="text-muted small">
                              {teamMembers
                                .flat()
                                .map((memberId) => nameMap[memberId])
                                .filter((name) => !!name && name !== "Unknown")
                                .join(", ") || "Loading..."}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
        {showAssets && (
          <div id="emp_assets">
            <div className="row">
              {assetdata && assetdata.length > 0 ? (
                (() => {
                  const filteredAssets = assetdata.filter(
                    (asset) =>
                      asset.assigneeUser && asset.assigneeUser.id === userId
                  );

                  if (filteredAssets.length === 0) {
                    return <p>No assets found for this employee.</p>;
                  }

                  return filteredAssets.map((asset) => (
                    <div
                      className="col-lg-4 col-sm-6 col-md-4 col-xl-3 d-flex"
                      key={asset.id}
                    >
                      <div className="card w-100 shadow-sm">
                        <div className="card-body">
                          <h4 className="asset-title mt-2 mb-2">
                            {asset.name}
                          </h4>
                          <p className="text-muted mb-2">
                            <strong className="text-dark fw-semibold">
                              Asset ID:
                            </strong>{" "}
                            {asset.asset_id ||
                              `AST-${String(asset.id).padStart(3, "0")}`}
                          </p>
                          <p className="text-muted mb-2">
                            <strong className="text-dark fw-semibold">
                              Assigned Date:
                            </strong>{" "}
                            {new Date(asset.assigned_date).toLocaleDateString()}
                          </p>
                          <p className="text-muted mb-2">
                            <strong className="text-dark fw-semibold">
                              Assignee:
                            </strong>{" "}
                            {asset.assigneeUser
                              ? `${asset.assigneeUser.first_name} ${asset.assigneeUser.last_name}`
                              : "Loading..."}
                          </p>
                        </div>
                      </div>
                    </div>
                  ));
                })()
              ) : (
                <p>No assets found for this employee.</p>
              )}
            </div>
          </div>
        )}
        {/* /Bank Tab */}
        {showBank && (
          <div className="tab-pane fade" id="bank_statutory">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title"> Basic Salary Information</h3>
                <form onSubmit={handleSubmit(submitbank)}>
                  <div className="row">
                    {/* Salary Type - Required */}
                    <div className="col-sm-4">
                      <label>
                        Salary basis <span className="text-danger">*</span>
                      </label>
                      <Controller
                        name="salaryType"
                        control={control}
                        rules={{ required: "Salary type is required" }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={salaryTypes}
                            styles={customStyles}
                            placeholder="Select Salary Type"
                          />
                        )}
                      />
                      {errors.salaryType && (
                        <p className="text-danger">
                          {errors.salaryType.message}
                        </p>
                      )}
                    </div>

                    {/* Salary Amount - Required */}
                    <div className="col-sm-4">
                      <label>
                        Salary amount <span className="text-danger">*</span>{" "}
                        <small className="text-muted">per month</small>
                      </label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">$</span>
                        </div>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Enter salary amount"
                          {...register("salaryAmount", {
                            required: "Salary amount is required",
                          })}
                        />
                      </div>
                      {errors.salaryAmount && (
                        <p className="text-danger">
                          {errors.salaryAmount.message}
                        </p>
                      )}
                    </div>

                    {/* Payment Type - Required */}
                    <div className="col-sm-4">
                      <label>
                        Payment type <span className="text-danger">*</span>
                      </label>
                      <Controller
                        name="paymentType"
                        control={control}
                        rules={{ required: "Payment type is required" }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={paymentTypes}
                            styles={customStyles}
                            placeholder="Select Payment Type"
                          />
                        )}
                      />
                      {errors.paymentType && (
                        <p className="text-danger">
                          {errors.paymentType.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <hr />
                  <h3 className="card-title">PF Information</h3>
                  <div className="row">
                    {/* PF No. - Required */}
                    <div className="col-sm-4">
                      <label>
                        PF No. <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter PF Number"
                        {...register("pfNumber", {
                          required: "PF Number is required",
                        })}
                      />
                      {errors.pfNumber && (
                        <p className="text-danger">{errors.pfNumber.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="row">
                    {/* Employee PF Rate - Optional */}
                    <div className="col-sm-4">
                      <label>Employee PF rate</label>
                      <Controller
                        name="employeePFRate"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={pfRates}
                            placeholder="Select PF Rate"
                            styles={customStyles}
                          />
                        )}
                      />
                    </div>

                    {/* PF Additional Rate - Optional */}
                    <div className="col-sm-4">
                      <label>PF Additional rate</label>
                      <Controller
                        name="pfAdditionalRate"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={additionalRates}
                            placeholder="Select PF Additional Rate"
                            styles={customStyles}
                          />
                        )}
                      />
                    </div>

                    {/* Total PF Rate - Read-Only */}
                    <div className="col-sm-4">
                      <label>Total PF rate</label>
                      <input
                        type="text"
                        className="form-control"
                        value={totalPFRate}
                        readOnly
                      />
                    </div>
                  </div>

                  <hr />
                  <h3 className="card-title">ESI Information</h3>
                  <div className="row">
                    {/* ESI No. - Required */}
                    <div className="col-sm-4">
                      <label>
                        ESI No. <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter ESI Number"
                        {...register("esiNumber", {
                          required: "ESI Number is required",
                        })}
                      />
                      {errors.esiNumber && (
                        <p className="text-danger">
                          {errors.esiNumber.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="row">
                    {/* Employee ESI Rate - Optional */}
                    <div className="col-sm-4">
                      <label>Employee ESI rate</label>
                      <Controller
                        name="employeeESIRate"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={esiRates}
                            placeholder="Select ESI Rate"
                            styles={customStyles}
                          />
                        )}
                      />
                    </div>

                    {/* ESI Additional Rate - Optional */}
                    <div className="col-sm-4">
                      <label>ESI Additional rate</label>
                      <Controller
                        name="esiAdditionalRate"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={additionalRates}
                            placeholder="Select ESI Additional Rate"
                            styles={customStyles}
                          />
                        )}
                      />
                    </div>

                    {/* Total ESI Rate - Read-Only */}
                    <div className="col-sm-4">
                      <label>Total ESI rate</label>
                      <input
                        type="text"
                        className="form-control"
                        value={totalESIRate}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="submit-section">
                    <button
                      className="btn btn-primary submit-btn"
                      type="submit"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export const ListItem = ({ title, text }) => (
  <li>
    <div className="title">{title}</div>
    <div className="text">{text}</div>
  </li>
);
