import React, { useState } from "react";

const faqData = [
  {
    question: "How do I reset my password?",
    answer:
      "To reset your password, go to the Login page, click on 'Forgot Password', and follow the email instructions.",
  },
  {
    question: "How can I update my profile information?",
    answer:
      "Navigate to the 'My Profile' section from the dashboard. You can edit your name, email, and contact information there.",
  },
  {
    question: "Where can I find company policy documents?",
    answer:
      "Company policy documents are available in the 'Documents' section under the 'HR' tab.",
  },
  {
    question: "Can I request time off through the portal?",
    answer:
      "Yes, you can request time off by going to the 'Leave' section and submitting a new leave request.",
  },
  {
    question: "What should I do if I encounter a system error?",
    answer:
      "Please contact the IT support team via the Helpdesk module or email support@yourcompany.com.",
  },
];

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const toggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const filteredFaqs = faqData.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="content container-fluid">
      <div className="row">
        <div className="col-xl-12">
          <div className="card faq-card">
            <div className="card-header d-flex flex-column flex-md-row justify-content-between align-items-center">
              <h4 className="card-title mb-2 mb-md-0">Frequently Asked Questions</h4>
              <input
                type="text"
                className="form-control w-100 w-md-50"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="card-body">
              <div className="faq-list">
                {filteredFaqs.length > 0 ? (
                  filteredFaqs.map((item, index) => (
                    <div className="faq-item mb-3" key={index}>
                      <button
                        className="btn btn-link d-block text-start w-100"
                        onClick={() => toggle(index)}
                        aria-expanded={activeIndex === index}
                      >
                        <strong>{item.question}</strong>
                      </button>
                      {activeIndex === index && (
                        <div className="mt-2">
                          <p className="text-muted">{item.answer}</p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-muted text-center">No FAQs found matching your search.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;
