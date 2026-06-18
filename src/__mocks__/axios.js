// src/__mocks__/axios.js
// Mock manuel d'axios - partagé entre tous les fichiers de test

const mockGet = jest.fn();
const mockDelete = jest.fn();
const mockPost = jest.fn();

const axiosInstance = {
  get: mockGet,
  delete: mockDelete,
  post: mockPost,
};

const axios = {
  create: () => axiosInstance,
  __mockGet: mockGet,
  __mockDelete: mockDelete,
  __mockPost: mockPost,
  __instance: axiosInstance,
};

module.exports = axios;
module.exports.default = axios;
module.exports.__esModule = true;
