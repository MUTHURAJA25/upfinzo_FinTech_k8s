import api from "./api";

export const login = (data) => {
  return api.post(`/auth/signin`, data);
};
export const signup = (data) => {
  return api.post(`/auth/signup`, data);
};
export const forgotPassword = (data) => {
  return api.post(`/auth/forgot-password`, data);
};
export const resetPassword = (data) => {
  return api.post(`/auth/reset-password`, data);
};
