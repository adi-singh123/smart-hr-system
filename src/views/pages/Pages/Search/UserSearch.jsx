import React, { useState, useEffect } from "react";

const mockUsers = [
  {
    id: 1,
    name: "Ananya Rao",
    department: "HR",
    email: "ananya.rao@company.com",
  },
  {
    id: 2,
    name: "Ritesh Malhotra",
    department: "Engineering",
    email: "ritesh@company.com",
  },
  {
    id: 3,
    name: "Megha Iyer",
    department: "Marketing",
    email: "megha.iyer@company.com",
  },
];

const UserSearch = ({ searchTerm }) => {
  const [filteredUsers, setFilteredUsers] = useState(mockUsers);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredUsers(mockUsers);
    } else {
      const lower = searchTerm.toLowerCase();
      const filtered = mockUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(lower) ||
          user.department.toLowerCase().includes(lower) ||
          user.email.toLowerCase().includes(lower)
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm]);

  return (
    <div className="tab-pane show active">
      <div className="row">
        {filteredUsers.map((user) => (
          <div className="col-md-6 col-xl-4" key={user.id}>
            <div className="card">
              <div className="card-body">
                <h4 className="user-title">{user.name}</h4>
                <p className="text-muted mb-2">
                  <strong>Department:</strong> {user.department}
                </p>
                <p className="text-muted">
                  <strong>Email:</strong> {user.email}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserSearch;
