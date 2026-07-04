import React, { useEffect, useState } from "react";
import "@/assets/styles/profile.css";
import Wrapper from "../layouts/Wrapper";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getUserById } from "@/services/adminService";
import { notify } from "@/components/notifications";

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const joinedDate = profile?.createdAt ? new Date(profile?.createdAt) : null;
  const [error, setError] = useState("");
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userId) {
          notify.error("User ID missing from URL!");
          return;
        }
        const response = await getUserById(userId);
        setProfile(response?.data?.data);
      } catch (error) {
        setError("Failed to load user profile");
        notify.error("Session expired! Please log in again.");
      }
    };

    fetchData();
  }, [userId]);

  const EditProfile = async (userId) => {
    try {
      const { data } = await getUserById(userId);
      setProfile(data?.data);
      navigate(`/profile-edit/${userId}`);
    } catch (error) { }
  }

  return (
    <Wrapper page="Users / Profile">
      {/* Header */}
      <div className="row">
        <div className="col-12">
          <div className="card mb-6">
            <div className="user-profile-header-banner">
              <img src={new URL('@/assets/images/illustration/profile-banner.png', import.meta.url).href} alt="Banner" className="rounded-top" />
            </div>
            <div className="user-profile-header d-flex flex-column flex-sm-row text-sm-start text-center mb-5">
              <div className="flex-shrink-0 mt-n2 mx-sm-0 mx-auto">
                <img src={new URL('@/assets/images/illustration/profile-avatar.jpg', import.meta.url).href} alt="User" className="d-block h-auto ms-0 ms-sm-5 rounded-4 user-profile-img"
                />
              </div>
              <div className="flex-grow-1 mt-4 mt-sm-12">
                <div className="d-flex align-items-md-end align-items-sm-start align-items-center justify-content-md-between justify-content-start mx-5 flex-md-row flex-column gap-6">
                  <div className="user-profile-info">
                    <h4 className="mb-2">{profile?.first_name}</h4>
                    <ul className="list-inline mb-0 d-flex align-items-center flex-wrap justify-content-sm-start justify-content-center gap-4">
                      <li className="list-inline-item">
                        <i className="icon-base ri ri-palette-line me-2 icon-24px"></i>
                        <span className="fw-medium">UX Designer</span>
                      </li>
                      <li className="list-inline-item">
                        <i className="icon-base ri ri-map-pin-line me-2 icon-24px"></i>
                        <span className="fw-medium">Vatican City</span>
                      </li>
                      <li className="list-inline-item">
                        <i className="icon-base ri ri-calendar-line me-2 icon-24px"></i>
                        <span className="fw-medium">Joined {joinedDate?.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
                      </li>
                    </ul>
                  </div>
                  <button className="btn btn-primary">
                    <i className="icon-base ri ri-user-follow-line icon-16px me-2"></i>
                    Connected
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Header */}

      <button className="btn btn-primary mb-4" onClick={() => EditProfile(userId)}>
        <i className="icon-base ri ri-user-3-line icon-sm me-2"></i>
        Edit
      </button>

      {/* User Profile Content */}
      <div className="row">
        {/* Left Column */}
        <div className="col-xl-4 col-lg-5 col-md-5">
          {/* About User */}
          <div className="card mb-6">
            <div className="card-body">
              <small className="card-text text-uppercase text-body-secondary small">
                About
              </small>
              <ul className="list-unstyled my-3 py-1">
                <li className="d-flex align-items-center mb-4">
                  <i className="icon-base ri ri-user-3-line icon-24px"></i>
                  <span className="fw-medium mx-2">Full Name:</span> {profile?.first_name}
                </li>
                <li className="d-flex align-items-center mb-4">
                  <i className="icon-base ri ri-check-line icon-24px"></i>
                  <span className="fw-medium mx-2">Status:</span> Active
                </li>
                <li className="d-flex align-items-center mb-4">
                  <i className="icon-base ri ri-star-smile-line icon-24px"></i>
                  <span className="fw-medium mx-2">Role:</span> Developer
                </li>
                <li className="d-flex align-items-center mb-4">
                  <i className="icon-base ri ri-flag-2-line icon-24px"></i>
                  <span className="fw-medium mx-2">Country:</span> USA
                </li>
                <li className="d-flex align-items-center mb-2">
                  <i className="icon-base ri ri-translate-2 icon-24px"></i>
                  <span className="fw-medium mx-2">Languages:</span> English
                </li>
              </ul>

              {/* Contacts */}
              <small className="card-text text-uppercase text-body-secondary small">
                Contacts
              </small>
              <ul className="list-unstyled my-3 py-1">
                <li className="d-flex align-items-center mb-4">
                  <i className="icon-base ri ri-phone-line icon-24px"></i>
                  <span className="fw-medium mx-2">Contact:</span> (123)
                  456-7890
                </li>
                <li className="d-flex align-items-center mb-4">
                  <i className="icon-base ri ri-wechat-line icon-24px"></i>
                  <span className="fw-medium mx-2">Skype:</span> john.doe
                </li>
                <li className="d-flex align-items-center mb-2">
                  <i className="icon-base ri ri-mail-open-line icon-24px"></i>
                  <span className="fw-medium mx-2">Email:</span>{" "}
                  {profile?.email}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-xl-8 col-lg-7 col-md-7">
          {/* Activity Timeline */}
          <div className="card card-action mb-6">
            <div className="card-header align-items-center">
              <h5 className="card-action-title mb-0">
                <i className="icon-base ri ri-bar-chart-2-line icon-24px text-body me-4"></i>
                Activity Timeline
              </h5>
            </div>
            <div className="card-body pt-5">
              <ul className="timeline card-timeline mb-0">
                <li className="timeline-item timeline-item-transparent">
                  <span className="timeline-point timeline-point-primary"></span>
                  <div className="timeline-event">
                    <div className="timeline-header mb-3">
                      <h6 className="mb-0">12 Invoices have been paid</h6>
                      <small className="text-body-secondary">12 min ago</small>
                    </div>
                    <p className="mb-2">
                      Invoices have been paid to the company
                    </p>
                    <div className="d-flex align-items-center">
                      <div className="badge bg-lighter rounded-3">
                        <img src={new URL('@/assets/images/illustration/pdf.png', import.meta.url).href} alt="img" width="20" className="me-2" />
                        <span className="h6 mb-0 text-body">invoices.pdf</span>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* User Profile Content */}
    </Wrapper>
  );


};

export default UserProfile;
