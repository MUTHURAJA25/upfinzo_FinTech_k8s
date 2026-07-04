import api from "./api";

export const getUserById = (id, config = {}) => {
  return api.get(`/admin/users/${id}`, config);
};

export const getAllUsers = (config = {}) => {
  return api.get(`/admin/users`, config);
};

export const deleteUser = (id, config) => {
  return api.delete(`/admin/users/${id}`, config);
};

export const updateUserProfile = (id, config) => {
  return api.put(`/admin/users/${id}`, config);
};
