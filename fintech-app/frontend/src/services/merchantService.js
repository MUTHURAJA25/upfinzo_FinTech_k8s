import axios from "axios";

const base = import.meta.env.VITE_API_BASE;
const envVersion = import.meta.env.VITE_API_VERSION;

// Build Authorization header safely
const authHeader = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ------------------------------
// Merchant Payout Configuration APIs
// ------------------------------

// Fetch payout configuration by merchant ID
export const getMerchantPayoutConfig = (merchantId) => {
  return axios.get(
    `${base}/${envVersion}/admin/merchant-payout/${merchantId}`,
    authHeader()
  );
};

// Create or Update merchant payout configuration
export const saveMerchantPayoutConfig = (payload) => {
  return axios.post(
    `${base}/${envVersion}/admin/merchant-payout`,
    payload,
    authHeader()
  );
};
