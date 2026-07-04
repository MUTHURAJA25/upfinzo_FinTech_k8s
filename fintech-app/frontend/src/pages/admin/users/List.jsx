import React, { useEffect, useState } from "react";
import Wrapper from "@/pages/layouts/Wrapper";
import { deleteUser, getAllUsers, getUserById } from "@/services/adminService";
import { Link, useNavigate } from "react-router-dom";
import { notify } from "@/components/notifications";

function List() {
  const [showModal, setShowModal] = useState(false);
  const [allUsers, setAllusers] = useState(null);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!localStorage.getItem("token")) {
          notify.error("Please log in first!");
          return;
        }
        const { data } = await getAllUsers();
        setAllusers(data?.data ?? []);
      } catch (error) {
        notify.error("Session Expired! Please log in again.");
      }
    };
    fetchData();
  }, []);

  const EditProfile = async (userId) => {
    try {
      const { data } = await getUserById(userId);
      setProfile(data?.data);
      navigate(`/profile-edit/${userId}`);
    } catch (error) { }
  }


  const removeUserFromList = (userId) => {
    setAllusers((prev) => prev?.filter((u) => u._id !== userId) ?? []);
  };

  const userDelete = (id) => {
    if (!id) {
      
      notify.error("User ID not found! Please log in again.");
      return;
    }

    notify.confirm(
      "Are you sure you want to delete?",
      async () => {
        try {
          await deleteUser(id);
          removeUserFromList(id);
          notify.success("User deleted successfully!");
        } catch (err) {
          notify.error(err.response?.data?.message || "Error deleting user");
        }
      },
      () => {
        notify.info("Action cancelled.");
      }
    );
  };


  const userDetailsFunc = async (userId) => {
    try {
      const { data } = await getUserById(userId);
      setProfile(data?.data);
      navigate(`/user-profile/${userId}`);
    } catch (error) { }
  }

  return (
    <Wrapper page="Users list">
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
                        <th className="text-center">No.</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Assigned To</th>
                        <th>Created Date</th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allUsers?.map((user, index) => (
                        <tr key={user?._id || index}>
                          <td className="text-center"> {index + 1} </td>
                          <td> {user?.first_name} </td>
                          <td> {user?.email} </td>
                          <td> {user?.phone || "N/A"} </td>
                          <td>
                            {user?.createdAt
                              ? new Date(user?.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )
                              : "Not available"}
                          </td>

                          <td className="text-center">
                            <div className="dropdown">
                              <button
                                type="button"
                                className="btn p-0 dropdown-toggle hide-arrow"
                                data-bs-toggle="dropdown"
                              >
                                <i className="icon-base ri ri-more-2-line icon-18px"></i>
                              </button>
                              <div className="dropdown-menu">

                                <button onClick={() => EditProfile(user?._id)} className="dropdown-item">
                                  <i className="icon-base ri ri-pencil-line icon-18px me-2"></i>{" "}
                                  Edit
                                </button>
                                <button onClick={() => userDelete(user?._id)} className="dropdown-item">
                                  <i className="icon-base ri ri-delete-bin-6-line icon-18px me-2"></i>{" "}
                                  Delete
                                </button>

                                <button onClick={() => userDetailsFunc(user?._id)} className="dropdown-item">
                                  <i className="icon-base ri ri-eye-line icon-18px me-2"></i>{" "}
                                  View
                                </button>

                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {/* NO USERS */}
                      {allUsers && allUsers.length === 0 && (
                        <tr>
                          <td
                            colSpan="6"
                            className="px-6 py-12 text-center text-gray-500"
                          >
                            {" "}
                            No users found.{" "}
                          </td>
                        </tr>
                      )}
                      {/* NO USERS */}
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
                      onClick={() => setShowModal(false)}>
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

export default List;
