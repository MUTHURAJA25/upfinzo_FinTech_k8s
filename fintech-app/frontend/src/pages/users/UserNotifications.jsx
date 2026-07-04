import React, { useState } from "react";
import Wrapper from "../layouts/Wrapper";

function UserNotifications() {
  const [notifications, setNotifications] = useState({
    email: {
      transaction: true,
      kyc: true,
      payout: true,
      preference: true,
    },
    application: {
      transaction: true,
      kyc: true,
      payout: true,
      preference: true,
    },
  });

  const handleCheckboxChange = (type, category) => {
    setNotifications((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [category]: !prev[type][category],
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <Wrapper page="User notification settings">
      <div className="card">
        {/* Notifications */}
        <div className="card-body">
          <h5 className="mb-0">Notification Settings</h5>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th className="text-nowrap fw-medium">Type</th>
                <th className="text-nowrap fw-medium text-center">Transaction</th>
                <th className="text-nowrap fw-medium text-center">KYC</th>
                <th className="text-nowrap fw-medium text-center">Payout / Pay-in</th>
                <th className="text-nowrap fw-medium text-center">Preference Settings</th>
              </tr>
            </thead>
            <tbody>
              {/* Email Row */}
              <tr>
                <td className="text-nowrap text-heading">Email</td>
                {Object.keys(notifications.email).map((key) => (
                  <td key={key}>
                    <div className="form-check mb-0 d-flex justify-content-center">
                      <input className="form-check-input" type="checkbox" checked={notifications.email[key]} onChange={() => handleCheckboxChange("email", key)}/>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Application Row */}
              <tr>
                <td className="text-nowrap text-heading">Application</td>
                {Object.keys(notifications.application).map((key) => (
                  <td key={key}>
                    <div className="form-check mb-0 d-flex justify-content-center">
                      <input className="form-check-input" type="checkbox" checked={notifications.application[key]} onChange={() => handleCheckboxChange("application", key)}
                      />
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="mt-6">
                <button type="submit" className="btn btn-primary me-3">
                  Save changes
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary">
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
        {/* /Notifications */}
      </div>
    </Wrapper>
  );
}

export default UserNotifications;
