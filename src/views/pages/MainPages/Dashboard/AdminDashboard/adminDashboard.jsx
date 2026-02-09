/** @format */

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Charts from "./charts";
import Reports from "./Reports";
import PaymentTable from "./paymentTable";
import RecentTable from "./recentTable";
import Breadcrumbs from "../../../../../components/Breadcrumbs";
import { getAllUsers } from "../../../../../Redux/services/User";
import { fetchTasks } from "../../../../../Redux/services/Task";
import { fetchProjects } from "../../../../../Redux/services/Project";
import { fetchClients } from "../../../../../Redux/services/Client";
const AdminDashboard = () => {
  const dispatch = useDispatch();
  const [counts, setCounts] = useState({
    users: 0,
    projects: 0,
    tasks: 0,
    clients: 0,
  });

  // Redux state selectors
  const usersData = useSelector((state) => state.user.users);
  const projectsData = useSelector((state) => state.project?.allProjects);

  const tasksData = useSelector((state) => state.task.tasks);
  const clientsData = useSelector((state) => state.client.clients);

  useEffect(() => {
    // Dispatch Redux actions to fetch data
    dispatch(getAllUsers());
    dispatch(fetchProjects());
    dispatch(fetchTasks());
    dispatch(fetchClients());
  }, [dispatch]);

  useEffect(() => {
    // Update counts whenever Redux state changes
    setCounts({
      users: usersData?.length || 0,
      projects: projectsData?.length || 0,
      tasks: tasksData?.length || 0,
      clients: clientsData?.length || 0,
    });
  }, [usersData, projectsData, tasksData, clientsData]);

  const dashboardItems = [
    { label: "Users", number: counts.users, icon: "fa fa-users" },
    { label: "Projects", number: counts.projects, icon: "fa fa-briefcase" },
    { label: "Tasks", number: counts.tasks, icon: "fa fa-tasks" },
    { label: "Clients", number: counts.clients, icon: "fa fa-handshake" },
  ];

  return (
    <div className="main-wrapper">
      <div className="page-wrapper">
        <div className="content container-fluid">
          <Breadcrumbs maintitle="Welcome Admin!" title="Dashboard" />

          <div className="row">
            {dashboardItems.map((item, index) => (
              <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3" key={index}>
                <div className="card dash-widget">
                  <div className="card-body">
                    <span className={`dash-widget-icon ${item.icon}`} />
                    <div className="dash-widget-info">
                      <h3>{item.number}</h3>
                      <span>{item.label}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Charts />
          <Reports />

          <div className="row">
            {/* <PaymentTable />
            <RecentTable /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
