import axios from 'axios';

export const restAPI = axios.create({
  baseURL: `/apisquid/`
});
