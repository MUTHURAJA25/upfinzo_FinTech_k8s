import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import ForgotPassword from "@/pages/auth/ForgetPassword";
import ProtectedRoute from "./ProtectedRoute";
import UserProfile from "@/pages/users/UserProfile";
import Dashboard from "@/pages/dashboard/Dashboard";
import Kyc from "@/pages/kyc/Kyc";
import UserNotifications from "@/pages/users/UserNotifications";
import Permissions from "@/pages/admin/users/Permissions";
import Roles from "@/pages/admin/users/Roles";
import ProfileEdit from "@/pages/users/ProfileEdit";
import List from "@/pages/admin/users/List";
import ChangePassword from "@/pages/users/ChangePassword";
import PayoutConfiguration from "@/pages/merchant/payout-configuration";
import MerchantDashboard from "@/pages/merchant/merchant-dashboard";
import MerchantAnalytics from "@/pages/merchant/merchant-analytics";
import PaymentLink from "@/pages/pay-in/payment-link";
import RefundRequests from "@/pages/pay-in/refund-request";
import TransactionSummary from "@/pages/pay-in/transaction-summary";

import ResetPassword from "@/pages/auth/ResetPassword";
import GenerateInputsExamples from "@/pages/docs/GenerateInputsExamples";


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/user-profile/:userId" element={<UserProfile />} />
        <Route path="/roles" element={<Roles />} />
        <Route path="/profile-edit/:userId" element={<ProfileEdit />} />
        <Route path="/list" element={<List />} />
        <Route path="/permission" element={<Permissions />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/kyc" element={<Kyc />} />
        <Route path="/user/settings/notification" element={<UserNotifications />} />

        {/* Merchant Modules */}
        <Route path="/payout-configuration" element={<PayoutConfiguration />} />
        <Route path="/merchant-dashboard" element={<MerchantDashboard />} />
        <Route path="/merchant-analytics" element={<MerchantAnalytics />} />

        {/* Pay-In Modules */}
        <Route path="/payment-link" element={<PaymentLink />} />
        <Route path="/transaction-summary" element={<TransactionSummary />} />
        <Route path="/refund-request" element={<RefundRequests />} />

        <Route path="/docs/forms/generate-inputs" element={<GenerateInputsExamples />} />
      </Route>
    </Routes>
  );
}
