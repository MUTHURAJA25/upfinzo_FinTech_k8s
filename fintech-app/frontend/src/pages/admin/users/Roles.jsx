import Wrapper from "@/pages/layouts/Wrapper";
import React, { useState } from "react";

function Roles() {
  const [displayValue, setDisplayValue] = useState("Add");

  const handleUpdate = (e) => {
    setDisplayValue(e);
  };

  return (
    <Wrapper page="Role Management">
      <div className="content-wrapper">
        {/* Content */}
        <div className="flex-grow-1 container-p-y">
          <h4 className="mb-1">Roles List</h4>
          <p className="mb-6">
            A role provides access to predefined menus and features so that
            depending on the assigned role an administrator can have access to
            what a user needs.
          </p>

          {/* Role cards */}
          <div className="row g-6">
            {/* Administrator Card */}
            <div className="col-xl-4 col-lg-6 col-md-6">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <p className="mb-0">Total 4 users</p>
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <div className="role-heading">
                      <h5 className="mb-1">Administrator</h5>
                      <a
                        href="#"
                        data-bs-toggle="modal"
                        data-bs-target="#addRoleModal"
                        onClick={() => handleUpdate("Edit")}
                        className="role-edit-modal"
                      >
                        <p className="mb-0">Edit Role</p>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Add Role Card */}

            {/* Users Table Section */}
            <div className="col-12">
              <h4 className="mt-6 mb-1">Total users with their roles</h4>
              <p className="mb-0">
                Find all of your company’s administrator accounts and their
                associated roles.
              </p>
            </div>

            <div className="card">
              <div className="card-datatable table-responsive">
                <div className="">
                  <div className="row mx-2">
                    <div className="d-md-flex justify-content-between align-items-center dt-layout-start col-md-auto me-auto mt-0 px-5">
                      <div className="mt-4 mb-4 d-flex align-items-center">
                        <label className="me-3">Show</label>
                        <select className="form-select form-select-sm">
                          <option value="10">10</option>
                          <option value="25">25</option>
                          <option value="50">50</option>
                          <option value="100">100</option>
                        </select>
                      </div>
                    </div>
                    <div className="align-items-center  col-md-auto ms-auto justify-content-md-between justify-content-center d-flex">
                      <div className="me-2">
                        <input
                          type="search"
                          className="form-control form-control-sm"
                          placeholder="Search Permissions"
                        />
                      </div>

                      <div>
                        <button
                          data-bs-target="#addRoleModal"
                          data-bs-toggle="modal"
                          className="btn btn-sm btn-primary text-nowrap add-new-role"
                          onClick={() => handleUpdate("Add")}
                        >
                          Add Role
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="justify-content-between dt-layout-table mb-4">
                    <div className="d-md-flex justify-content-between align-items-center dt-layout-full table-responsive">
                      <table className="table dataTable">
                        <thead>
                          <tr>
                            <th></th>
                            <th></th>
                            <th>User</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Plan</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td
                              colSpan="8"
                              className="dt-empty text-center w-100"
                            >
                              Loading...
                            </td>
                          </tr>
                        </tbody>
                        <tfoot></tfoot>
                      </table>
                    </div>
                  </div>
                  <div className="row mx-3 justify-content-between pt-4 pb-4">
                    <div className="d-md-flex justify-content-between align-items-center dt-layout-start col-md-auto me-auto mt-0 px-5">
                      <div className="dt-info" role="status">
                        Showing 0 to 0 of 0 entries
                      </div>
                    </div>
                    <div className="align-items-center dt-layout-end col-md-auto ms-auto justify-content-md-between justify-content-center d-flex">
                      <div className="dt-paging">
                        <nav aria-label="pagination"></nav>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Add Role Modal */}
          <div
            className="modal fade"
            id="addRoleModal"
            tabIndex="-1"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-lg modal-simple modal-dialog-centered modal-add-new-role">
              <div className="modal-content">
                <div className="modal-body p-0">
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                  <div className="text-center mb-6">
                    <h4 className="role-title mb-2 pb-0">
                      {displayValue} New Role
                    </h4>
                    <p>Set role permissions</p>
                  </div>

                  {/* Add Role Form */}
                  <form id="addRoleForm" className="row g-3">
                    <div className="col-12 form-control-validation mb-3">
                      <div className="form-floating form-floating-outline">
                        <input
                          type="text"
                          id="modalRoleName"
                          name="modalRoleName"
                          className="form-control"
                          placeholder="Enter a role name"
                        />
                        <label htmlFor="modalRoleName">Role Name</label>
                      </div>
                    </div>

                    <div className="col-12">
                      <h5 className="mb-6">Role Permissions</h5>
                      <div className="table-responsive">
                        <table className="table table-flush-spacing">
                          <tbody>
                            <tr>
                              <td className="text-nowrap fw-medium">
                                Financial Management
                              </td>
                              <td>
                                <div className="d-flex justify-content-end">
                                  <div className="form-check mb-0 mt-1 me-4 me-lg-12">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      id="financialManagement"
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="financialManagement">
                                      Read
                                    </label>
                                  </div>
                                  <div className="form-check mb-0 mt-1 me-4 me-lg-12">
                                    <input className="form-check-input" type="checkbox" id="financialManagementWrite" />
                                    <label className="form-check-label" htmlFor="financialManagementWrite">
                                      Write
                                    </label>
                                  </div>
                                  <div className="form-check mb-0 mt-1">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      id="financialManagementCreate"
                                    />
                                    <label className="form-check-label" htmlFor="financialManagementCreate">
                                      Create
                                    </label>
                                  </div>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td className="text-nowrap fw-medium">
                                User Management
                              </td>
                              <td>
                                <div className="d-flex justify-content-end">
                                  <div className="form-check mb-0 mt-1 me-4 me-lg-12">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      id="userManagementRead"
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="userManagementRead"
                                    >
                                      Read
                                    </label>
                                  </div>
                                  <div className="form-check mb-0 mt-1 me-4 me-lg-12">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      id="userManagementWrite"
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="userManagementWrite"
                                    >
                                      Write
                                    </label>
                                  </div>
                                  <div className="form-check mb-0 mt-1">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      id="userManagementCreate"
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="userManagementCreate"
                                    >

                                      Create
                                    </label>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="col-12 text-center">
                      <button type="submit" className="btn btn-primary me-3">
                        Submit
                      </button>
                      <button
                        type="reset"
                        className="btn btn-outline-secondary"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                  {/* /Add Role Form */}
                </div>
              </div>
            </div>
          </div>
          {/* /Add Role Modal */}
        </div>
      </div>
    </Wrapper>
  );
}

export default Roles;
