/** @format */

import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";

import AppContainer from "../Appcontainer";
import Login from "../../views/pages/Authentication/Login";
import Register from "../../views/pages/Authentication/Register";
import Otp from "../../views/pages/Authentication/Otp";
import Error404 from "../../views/pages/Error/Error404";
import Error500 from "../../views/pages/Error/Error500";
import JobList from "../../views/pages/Authentication/JobList";
import JobView from "../../views/pages/Authentication/JobView";
import ChangePassword from "../../views/pages/Authentication/ChangePassword";
import ForgotPassword from "../../views/pages/Authentication/ForgotPassword";
import LockScreen from "../../views/pages/Authentication/LockScreen";
import EmailView from "../../views/pages/MainPages/Apps/Email/emailView";
import EditInvoice from "../../views/pages/HR/Sales/Invoices/editInvoice";
import ViewInvoice from "../../views/pages/HR/Sales/Invoices/invoiceView";
import ViewPerformance from "../../views/pages/Performance/Performance/PerformanceReview";
import { Navigate } from "react-router-dom/dist";
import ComingSoon from "../../views/pages/Pages/ComingSoon";
import UnderManitenance from "../../views/pages/Pages/UnderManitenance";
import JobForm from "../../views/pages/Administration/Jobs/JobForm/index";
import InternshipApplicationForm from "../../views/pages/Administration/Jobs/Intership/index.jsx";
const AppRouter = () => {
  return (
    <div>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/error-404" element={<Error404 />} />
        <Route path="/error-500" element={<Error500 />} />
        <Route path="/coming-soon" element={<ComingSoon />} />
        <Route path="/under-maintenance" element={<UnderManitenance />} />
        <Route path="/email/:id" element={<EmailView />} />

        <Route path="/job-list" element={<JobList />} />
        <Route path="/job-view" element={<JobView />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/lock-screen" element={<LockScreen />} />
        <Route path="/*" element={<AppContainer />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/edit-invoice/:id" element={<EditInvoice />} />
        <Route path="/invoice-view/:id" element={<ViewInvoice />} />
        <Route path="/performance-view/:id" element={<ViewPerformance />} />
        <Route path="/job-form" element={<JobForm />} />
        <Route path="/internship" element={<InternshipApplicationForm/>} />
      </Routes>
    </div>
  );
};

export default AppRouter;
