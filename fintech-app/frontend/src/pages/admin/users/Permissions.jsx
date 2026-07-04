import Wrapper from "@/pages/layouts/Wrapper";
import React, { useState } from "react";

function Permissions() {
  const [showModal, setShowModal] = useState(false);
  return (
    <Wrapper page="Permission">
      <div className="content-wrapper">
        {/* Table */}
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
                <div className="align-items-center col-md-auto ms-auto justify-content-md-between justify-content-center d-flex">
                  <div>
                    <input
                      type="search"
                      className="form-control form-control-sm"
                      placeholder="Search Permissions"
                    />
                  </div>
                  <div className="flex-wrap w-auto ms-4">
                    <button
                      className="btn add-new btn-primary"
                      type="button"
                      onClick={() => setShowModal(true)}
                      data-bs-toggle="modal"
                      data-bs-target="#addPermissionModal"
                    >
                      <span>
                        <i className="icon-base ri ri-add-line icon-sm me-0 me-sm-1"></i>
                        <span className="d-none d-sm-inline-block">
                          Add Permission
                        </span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="justify-content-between dt-layout-table">
                <div className="d-md-flex justify-content-between align-items-center dt-layout-full table-responsive">
                  <table className="table dataTable">
                    <thead>
                      <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Assigned To</th>
                        <th>Created Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan="5" className="dt-empty text-center w-100">
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

        {/* MODAL */}
        <div
          className="modal fade"
          id="addPermissionModal"
          tabIndex="-1"
          aria-hidden="true"
          style={{ display: showModal ? "block" : "none" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-simple">
            <div className="modal-content p-4 p-md-12">
              <div className="modal-body p-md-0">
                <button
                  type="button"
                  className="btn-close btn-pinned"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => setShowModal(false)}
                ></button>
                <div className="text-center mb-6">
                  <h3 className="mb-2 pb-1">Add New Permission</h3>
                  <p>Permissions you may use and assign to your users.</p>
                </div>
                <form
                  id="addPermissionForm"
                  className="row fv-plugins-bootstrap5 fv-plugins-framework"
                  noValidate
                >
                  <div className="col-12 form-control-validation mb-4 fv-plugins-icon-container">
                    <div className="form-floating form-floating-outline">
                      <input
                        type="text"
                        id="modalPermissionName"
                        name="modalPermissionName"
                        className="form-control"
                        placeholder="Permission Name"
                        autoFocus
                      />
                      <label htmlFor="modalPermissionName">
                        Permission Name
                      </label>
                    </div>
                    <div className="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"></div>
                  </div>
                  <div className="col-12 mb-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="corePermission"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="corePermission"
                      >
                        Set as core permission
                      </label>
                    </div>
                  </div>
                  <div className="col-12 text-center demo-vertical-spacing">
                    <button
                      type="submit"
                      className="btn btn-primary me-sm-4 me-1 waves-effect waves-light"
                    >
                      Create Permission
                    </button>
                    <button
                      type="reset"
                      className="btn btn-outline-secondary waves-effect"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      onClick={() => setShowModal(false)}
                    >
                      Discard
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* MODAL */}
      </div>
    </Wrapper>
  );
}

export default Permissions;
