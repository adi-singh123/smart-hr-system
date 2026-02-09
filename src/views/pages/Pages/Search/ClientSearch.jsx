import React, { useState, useEffect } from "react";

const mockClients = [
  {
    id: 1,
    name: "Acme Corp",
    industry: "Retail",
    email: "info@acmecorp.com",
  },
  {
    id: 2,
    name: "Beta Solutions",
    industry: "Technology",
    email: "contact@betasolutions.io",
  },
  {
    id: 3,
    name: "Gamma Group",
    industry: "Finance",
    email: "hello@gammagroup.net",
  },
];

const ClientSearch = ({ searchTerm }) => {
  const [filteredClients, setFilteredClients] = useState(mockClients);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredClients(mockClients);
    } else {
      const lower = searchTerm.toLowerCase();
      const filtered = mockClients.filter(
        (client) =>
          client.name.toLowerCase().includes(lower) ||
          client.industry.toLowerCase().includes(lower) ||
          client.email.toLowerCase().includes(lower)
      );
      setFilteredClients(filtered);
    }
  }, [searchTerm]);

  return (
    <div className="tab-pane show active">
      <div className="row">
        {filteredClients.map((client) => (
          <div className="col-md-6 col-xl-4" key={client.id}>
            <div className="card">
              <div className="card-body">
                <h4 className="client-title">{client.name}</h4>
                <p className="text-muted mb-2">
                  <strong>Industry:</strong> {client.industry}
                </p>
                <p className="text-muted">
                  <strong>Email:</strong> {client.email}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientSearch;
