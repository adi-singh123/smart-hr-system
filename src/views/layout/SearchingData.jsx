/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import PerformanceIndicator from "../../views/pages/Performance/Performance/PerformanceIndicator";
import PerformanceReview from "../../views/pages/Performance/Performance/PerformanceReview";
import PerformanceAppraisal from "../../views/pages/Performance/Performance/PerformanceAppraisal";
import GoalTracking from "../../views/pages/Performance/Goals/GoalTracking";
import GoalType from "../../views/pages/Performance/Goals/GoalType";
import Trainers from "../../views/pages/Performance/Training/Trainers";
import Training from "../../views/pages/Performance/Training/Training";
import TrainingType from "../../views/pages/Performance/Training/TrainingType";

// import EmployeeProfile from "../../views/pages/Pages/profile/employeeprofile";
import AdminDashboard from "../../views/pages/MainPages/Dashboard/AdminDashboard/adminDashboard";
import EmployeeDashboard from "../../views/pages/MainPages/Dashboard/EmployeeDashboard";

import Calendar from "../../views/pages/MainPages/Apps/calendar";
import Contacts from "../../views/pages/MainPages/Apps/contacts";

import FileManager from "../../views/pages/MainPages/Apps/FileManager";
import Compose from "../../views/pages/MainPages/Apps/Email/compose";
import Estimates from "../../views/pages/HR/Sales/Estimates";
import CreateEstimate from "../../views/pages/HR/Sales/Estimates/createEstimate";
import EditEstimate from "../../views/pages/HR/Sales/Estimates/EditEstimate";
import Invoices from "../../views/pages/HR/Sales/Invoices/Index";
import CreateInvoice from "../../views/pages/HR/Sales/Invoices/createInvoice";
import EditInvoice from "../../views/pages/HR/Sales/Invoices/editInvoice";
import InvoiceView from "../../views/pages/HR/Sales/Invoices/invoiceView";
import Payments from "../../views/pages/HR/Sales/payments";
import Promotion from "../../views/pages/Performance/Promotion";
import Resignation from "../../views/pages/Performance/Resignation";
import Termination from "../../views/pages/Performance/Termination";
import AllEmpoyee from "../../views/pages/Employees/AllEmpoyee";
import Holidays from "../../views/pages/Employees/Holidays";
import AdminLeave from "../../views/pages/Employees/AdminLeave";
import EmployeeLeave from "../../views/pages/Employees/EmployeeLeave";
import LeaveSettings from "../../views/pages/Employees/LeaveSetting";
import AttendenceAdmin from "../../views/pages/Employees/Attendenceadmin";
import AttendanceEmployee from "../../views/pages/Employees/AttendenceEmployee";
import Department from "../../views/pages/Employees/Department";
import Designation from "../../views/pages/Employees/Designation";
import TimeSheet from "../../views/pages/Employees/TimeSheet";
import ShiftScheduling from "../../views/pages/Employees/ShiftandSchedule";
import ShiftList from "../../views/pages/Employees/ShiftList";
import OverTime from "../../views/pages/Employees/OverTime";
import Clients from "../../views/pages/Employees/Clients";
import Project from "../../views/pages/Employees/Projects/Project";
import ClientList from "../../views/pages/Employees/ClientList";
import Tasks from "../../views/pages/Employees/Projects/Tasks";
import TaskBoard from "../../views/pages/Employees/Projects/TaskBoard";
import Leads from "../../views/pages/Employees/Leads";
import Ticket from "../../views/pages/Employees/Ticket";
import ClientProfile from "../../views/pages/Profile/ClientProfile";
import Profile from "../../views/pages/Profile/Profile";
import Subscribtions from "../../views/pages/Subscribtions/Subscribtions";
import SubscribedCompany from "../../views/pages/Subscribtions/SubscribedCompany";
import SubscribtionsCompany from "../../views/pages/Subscribtions/SubscribtionsCompany";
import Search from "../../views/pages/Pages/Search/Search";
import Faq from "../../views/pages/Pages/Faq";
import Terms from "../../views/pages/Pages/Terms";
import PrivacyPolicy from "../../views/pages/Pages/PrivacyPolicy";
import BlankPage from "../../views/pages/Pages/BlankPage";
import KnowledgeBase from "../../views/pages/Administration/Knowledgebase/KnowledgeBase";
import KnowledgeBaseView from "../../views/pages/Administration/Knowledgebase/KnowledgeBaseView";
import EmployeeList from "../../views/pages/Employees/EmployeeList";
import Expenses from "../../views/pages/HR/Sales/Expenses";
import Activities from "../../views/pages/Administration/Activities";
import ProvidentFund from "../../views/pages/HR/Sales/ProvidentFund";
import Taxes from "../../views/pages/HR/Sales/Taxes";
import Categories from "../../views/pages/HR/Accounting/Categories";
import SubCategory from "../../views/pages/HR/Accounting/Categories/subCategory";
import Budgets from "../../views/pages/HR/Accounting/Budgets.jsx";
import BudgetExpenses from "../../views/pages/HR/Accounting/BudgetExpenses";
import BudgetRevenues from "../../views/pages/HR/Accounting/BudgetRevenue";
import EmployeeSalary from "../../views/pages/HR/Payroll/EmployeeSalary.jsx";
import PaySlip from "../../views/pages/HR/Payroll/Payslip";
import PayrollItems from "../../views/pages/HR/Payroll/PayrollItems.jsx";
import Policies from "../../views/pages/HR/Policies";
import ExpenseReport from "../../views/pages/HR/Reports/ExpenseReport";
import InvoiceReport from "../../views/pages/HR/Reports/InvoiceReport";
import PaymentReport from "../../views/pages/HR/Reports/PaymentReport";
import ProjectReport from "../../views/pages/HR/Reports/ProjectReport";
import TaskReport from "../../views/pages/HR/Reports/TaskReport";
import UserReport from "../../views/pages/HR/Reports/UserReport";
import EmployeeReport from "../../views/pages/HR/Reports/EmployeeReports";
import PaySlipReports from "../../views/pages/HR/Reports/PaySlipReports";
import AttendanceReport from "../../views/pages/HR/Reports/AttendanceReport";
import LeaveReport from "../../views/pages/HR/Reports/LeaveReport";
import DailyReports from "../../views/pages/HR/Reports/DailyReports";
import ProjectList from "../../views/pages/Employees/Projects/ProjectList";
import ProjectView from "../../views/pages/Employees/Projects/ProjectView";
import ContactList from "../../views/pages/Crm/ContactList.jsx";
import ContactGrid from "../../views/pages/Crm/ContactGrid.jsx";
import DealsDashboard from "../../views/pages/MainPages/Dashboard/DealsDashboard/index.jsx";
import LeadsDashboard from "../../views/pages/MainPages/Dashboard/LeadsDashboard/index.jsx";
import TicketDetails from "../../views/pages/Employees/TicketDetails.jsx";
import Companies from "../../views/pages/Crm/companies.jsx";
import ContactDetails from "../../views/pages/Crm/ContactDetails.jsx";
import LeadsList from "../../views/pages/Crm/LeadsList.jsx";
import LeadsKanban from "../../views/pages/Crm/LeadsKanban.jsx";
import LeadsDetails from "../../views/pages/Crm/LeadsDetails.jsx";
import PipeLine from "../../views/pages/Crm/PipeLine.jsx";
import CompaniesGrid from "../../views/pages/Crm/CompaniesGrid.jsx";
import CompanyDetails from "../../views/pages/Crm/CompanyDetails.jsx";
import Deals from "../../views/pages/Crm/Deals.jsx";
import DealsKanban from "../../views/pages/Crm/DealsKanban.jsx";
import Analytics from "../../views/pages/Crm/Analytics.jsx";
import DealsDetails from "../../views/pages/Crm/DealsDetails.jsx";

import ProfileTab from "../../views/pages/Profile/ProfileTab.jsx";
export const routingObjects = [
    {
      id: 2,
      path: "admin-dashboard",
      element: <AdminDashboard />,
    },
    {
      id: 9,
      path: "performance-indicator",
      element: <PerformanceIndicator />,
    },
    {
      id: 10,
      path: "performance",
      element: <PerformanceReview />,
    },
    {
      id: 11,
      path: "performance-appraisal",
      element: <PerformanceAppraisal />,
    },
    {
      id: 12,
      path: "goal-tracking",
      element: <GoalTracking />,
    },
    {
      id: 13,
      path: "goal-type",
      element: <GoalType />,
    },
    {
      id: 14,
      path: "trainers",
      element: <Trainers />,
    },
    {
      id: 15,
      path: "training",
      element: <Training />,
    },
    {
      id: 16,
      path: "training-type",
      element: <TrainingType />,
    },
    {
      id: 17,
      path: "employee-dashboard",
      element: <EmployeeDashboard />,
    },
    {
      id: 18,
      path: "activities",
      element: <Activities />,
    },
    {
      id: 20,
      path: "profile",
      element: <ProfileTab />,
    },
    {
      id: 21,
      path: "events",
      element: <Calendar />,
    },
    {
      id: 22,
      path: "contacts",
      element: <Contacts />,
    },

    {
      id: 23,
      path: "file-manager",
      element: <FileManager />,
    },
    {
      id: 24,
      path: "estimates",
      element: <Estimates />,
    },
    {
      id: 25,
      path: "create-estimate",
      element: <CreateEstimate />,
    },
    {
      id: 26,
      path: "edit-estimate",
      element: <EditEstimate />,
    },
    {
      id: 27,
      path: "invoices",
      element: <Invoices />,
    },
    {
      id: 28,
      path: "create-invoice",
      element: <CreateInvoice />,
    },
    {
      id: 29,
      path: "edit-invoice",
      element: <EditInvoice />,
    },
    {
      id: 30,
      path: "invoice-view",
      element: <InvoiceView />,
    },
    {
      id: 31,
      path: "payments",
      element: <Payments />,
    },
    {
      id: 32,
      path: "promotion",
      element: <Promotion />,
    },
    {
      id: 33,
      path: "resignation",
      element: <Resignation />,
    },
    {
      id: 34,
      path: "termination",
      element: <Termination />,
    },
    {
      id: 34,
      path: "employees",
      element: <AllEmpoyee />,
    },
    {
      id: 35,
      path: "holidays",
      element: <Holidays />,
    },
    {
      id: 36,
      path: "adminleaves",
      element: <AdminLeave />,
    },
    {
      id: 37,
      path: "leaves-employee",
      element: <EmployeeLeave />,
    },
    {
      id: 38,
      path: "leave-settings",
      element: <LeaveSettings />,
    },
    {
      id: 39,
      path: "adminattendance",
      element: <AttendenceAdmin />,
    },
    {
      id: 40,
      path: "attendance-employee",
      element: <AttendanceEmployee />,
    },
    {
      id: 41,
      path: "departments",
      element: <Department />,
    },
    {
      id: 42,
      path: "designations",
      element: <Designation />,
    },
    {
      id: 43,
      path: "timesheet",
      element: <TimeSheet />,
    },
    {
      id: 43,
      path: "shift-scheduling",
      element: <ShiftScheduling />,
    },
    {
      id: 44,
      path: "shift-list",
      element: <ShiftList />,
    },
    {
      id: 45,
      path: "overtime",
      element: <OverTime />,
    },
    {
      id: 46,
      path: "clients",
      element: <Clients />,
    },
    {
      id: 47,
      path: "projects",
      element: <Project />,
    },
    {
      id: 48,
      path: "clients-list",
      element: <ClientList />,
    },
    {
      id: 49,
      path: "task-board",
      element: <TaskBoard />,
    },
    {
      id: 50,
      path: "leads",
      element: <Leads />,
    },
    {
      id: 51,
      path: "tickets",
      element: <Ticket />,
    },
    {
      id: 52,
      path: "client-profile",
      element: <ClientProfile />,
    },
    {
      id: 53,
      path: "profile/:userId",
      element: <Profile />,
    },
    {
      id: 54,
      path: "subscriptions",
      element: <Subscribtions />,
    },
    {
      id: 55,
      path: "subscribed-companies",
      element: <SubscribedCompany />,
    },
    {
      id: 56,
      path: "subscriptions-company",
      element: <SubscribtionsCompany />,
    },
    {
      id: 57,
      path: "search",
      element: <Search />,
    },
    {
      id: 58,
      path: "faq",
      element: <Faq />,
    },
    {
      id: 59,
      path: "terms",
      element: <Terms />,
    },
    {
      id: 60,
      path: "terms",
      element: <Terms />,
    },
    {
      id: 61,
      path: "privacy-policy",
      element: <PrivacyPolicy />,
    },
    {
      id: 62,
      path: "blank-page",
      element: <BlankPage />,
    },
    {
      id: 63,
      path: "knowledgebase",
      element: <KnowledgeBase />,
    },
    {
      id: 64,
      path: "knowledgebase-view",
      element: <KnowledgeBaseView />,
    },
    {
      id: 64,
      path: "employees-list",
      element: <EmployeeList />,
    },
    {
      id: 65,
      path: "expenses",
      element: <Expenses />,
    },
    {
      id: 66,
      path: "provident-fund",
      element: <ProvidentFund />,
    },
    {
      id: 67,
      path: "taxes",
      element: <Taxes />,
    },
    {
      id: 68,
      path: "categories",
      element: <Categories />,
    },
    {
      id: 69,
      path: "sub-category",
      element: <SubCategory />,
    },
    {
      id: 70,
      path: "budgets",
      element: <Budgets />,
    },
    {
      id: 71,
      path: "budget-expenses",
      element: <BudgetExpenses />,
    },
    {
      id: 72,
      path: "budget-revenues",
      element: <BudgetRevenues />,
    },
    {
      id: 73,
      path: "salary-view",
      element: <PaySlip />,
    },
    {
      id: 74,
      path: "payroll-items",
      element: <PayrollItems />,
    },
    {
      id: 75,
      path: "policies",
      element: <Policies />,
    },
    {
      id: 76,
      path: "salary",
      element: <EmployeeSalary />,
    },
    {
      id: 77,
      path: "expense-reports",
      element: <ExpenseReport />,
    },
    {
      id: 78,
      path: "invoice-reports",
      element: <InvoiceReport />,
    },

    {
      id: 79,
      path: "payments-reports",
      element: <PaymentReport />,
    },
    {
      id: 80,
      path: "project-reports",
      element: <ProjectReport />,
    },
    {
      id: 81,
      path: "task-reports",
      element: <TaskReport />,
    },
    {
      id: 82,
      path: "user-reports",
      element: <UserReport />,
    },
    {
      id: 83,
      path: "employee-reports",
      element: <EmployeeReport />,
    },
    {
      id: 84,
      path: "payslip-reports",
      element: <PaySlipReports />,
    },
    {
      id: 85,
      path: "attendance-reports",
      element: <AttendanceReport />,
    },
    {
      id: 86,
      path: "attendance-reports",
      element: <AttendanceReport />,
    },

    {
      id: 87,
      path: "leave-reports",
      element: <LeaveReport />,
    },
    {
      id: 88,
      path: "daily-reports",
      element: <DailyReports />,
    },
    {
      id: 89,
      path: "project-list",
      element: <ProjectList />,
    },
    {
      id: 90,
      path: "project-view",
      element: <ProjectView />,
    },

    {
      id: 120,
      path: "contact-list",
      element: <ContactList />,
    },
    {
      id: 121,
      path: "contact-grid",
      element: <ContactGrid />,
    },
    {
      id: 122,
      path: "deals-dashboard",
      element: <DealsDashboard />,
    },
    {
      id: 123,
      path: "leads-dashboard",
      element: <LeadsDashboard />,
    },
    {
      id: 124,
      path: "ticket-details",
      element: <TicketDetails />,
    },
    {
      id: 125,
      path: "companies",
      element: <Companies />,
    },
    {
      id: 126,
      path: "contact-details",
      element: <ContactDetails />,
    },
    {
      id: 126,
      path: "leads-list",
      element: <LeadsList />,
    },
    {
      id: 127,
      path: "leads-kanban",
      element: <LeadsKanban />,
    },
    {
      id: 128,
      path: "leads-details",
      element: <LeadsDetails />,
    },
    {
      id: 128,
      path: "pipeline",
      element: <PipeLine />,
    },
    {
      id: 129,
      path: "Companies-grid",
      element: <CompaniesGrid />,
    },
    {
      id: 130,
      path: "company-details",
      element: <CompanyDetails />,
    },
    {
      id: 131,
      path: "deals",
      element: <Deals />,
    },
    {
      id: 132,
      path: "deals-kanban",
      element: <DealsKanban />,
    },
    {
      id: 130,
      path: "analytics",
      element: <Analytics />,
    },
    {
      id: 131,
      path: "deals-details",
      element: <DealsDetails />,
    },
    {
      id:132,
      path:"tasks",
      element : <Tasks/>
    }
  ];

  