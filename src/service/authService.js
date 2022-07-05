import { restAPI } from '../config/api';

export const loginSquid = async (account, password) => {
  const response = await restAPI.post('/user/login', { account, password });
  return response;
};

export const logoutSquid = async (payload) => {
  const response = await restAPI.post('/user/logout', payload);
  return response;
};

export const createAccount = async (payload) => {
  const response = await restAPI.post('/user', payload);
  return response;
};
export const updateMe = async (payload) => {
  const response = await restAPI.patch(`/user/me`, payload);
  return response;
};
export const updateAccount = async (payload, id) => {
  const response = await restAPI.patch(`/user/${id}`, payload);
  return response;
};

export const updatePassword = async (payload, id) => {
  const response = await restAPI.patch(`/user/${id}/updateMyPassword`, payload);
  return response;
};

export const getDetailAccount = async (id) => {
  const response = await restAPI.get(`/user/${id}`);
  return response;
};

export const createRule = async (payload) => {
  const response = await restAPI.post('/rule', payload);
  return response;
};

export const getDetailRule = async (id) => {
  const response = await restAPI.get(`/rule/${id}`);
  return response;
};

export const updateRule = async (payload, id) => {
  const response = await restAPI.patch(`/rule/${id}`, payload);
  return response;
};
