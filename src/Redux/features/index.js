/** @format */

import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./user";
import historianReducer from "./Historian";
import commonReducer from "./Common";
import departmentReducer from "./Department";
import designationReducer from "./Designation";
import employeeReducer from "./Employee";
import ImageReducer from "./Image";
import CategoryReducer from "./Category";
import EmployeeLeaveReducer from "./EmployeeLeaves";
import EmployeeAttendaceReducer from "./EmployeeAttendance";
import ClientsReducer from "./Client";
import FilesReducer from "./File";
import ticketReducer from "./Ticket";
import projectReducer from "./Project";
import invoiceReducer from "./invoiceSlice";
import performanceAppraisalReducer from "./PerformanceAppraisalSlice";
import performanceOrganizationReducer from "./PerformanceOrganizationSlice";
import performanceTechnicalReducer from "./PerformanceTechinalSlice";
import AssetsReducer from "./AssetsSlice";
import CalanderReducer from "./CalenderSlice";
import ChatReducer from "./ChatsSlice";
import taskReducer from "./Task";
import notificationsReducer from "./NotificationSlice";

import TerminationReducer from "./TerminationSlice";
import ResignationReducer from "./ResignationSlice";
import PromotionReducer from "./Promotion";
import trainingTypeReducer from "./TrainingTypeSlice";
import trainingReducer from "./TrainingSlice";
import goalTypeReducer from "./GoalTypeSlice";

import JobReducer from "./jobFormSlice";
import profileReducer from "./Profile";
import HolidaySlice from "./HolidaySlice";
import employeeOfMonthReducer from "./EmployeeOfMonthSlice";
import timesheetReducer from "./Timesheet";
import shiftRosterReducer from "./ShiftRosterSlice";
import InternshipReducer from "./InternshipSlice";
const rootReducer = combineReducers({
  auth: userReducer,
  historian: historianReducer,
  common: commonReducer,
  user: userReducer,
  department: departmentReducer,
  designation: designationReducer,
  employee: employeeReducer,
  image: ImageReducer,
  category: CategoryReducer,
  employee_leaves: EmployeeLeaveReducer,
  employee_attendance: EmployeeAttendaceReducer,
  client: ClientsReducer,
  file: FilesReducer,
  ticket: ticketReducer,
  project: projectReducer,
  invoices: invoiceReducer,
  performanceAppraisal: performanceAppraisalReducer,
  performanceOrganization: performanceOrganizationReducer,
  performanceTechnical: performanceTechnicalReducer,
  Assets: AssetsReducer,
  chat: ChatReducer,
  Calendar: CalanderReducer,
  task: taskReducer, // ✅ Add task slice here//
  notifications: notificationsReducer,

  termination: TerminationReducer,
  resignation: ResignationReducer,
  promotion: PromotionReducer,
  trainingType: trainingTypeReducer,
  training: trainingReducer,
  goalType: goalTypeReducer,

  // termination: TerminationReducer,
  // resignation: ResignationReducer,
  job: JobReducer,
  profile: profileReducer,
  holiday: HolidaySlice,
  employeeOfMonth: employeeOfMonthReducer,
  timesheet: timesheetReducer,
  shiftRoster: shiftRosterReducer,
  internship: InternshipReducer,
});

export default rootReducer;
