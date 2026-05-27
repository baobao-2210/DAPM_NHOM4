import axiosClient from './axiosClient';

export const adminApi = {
  // Dashboard
  getDashboardStats: () => axiosClient.get('/admin/dashboard'),

  // Services
  getServices: () => axiosClient.get('/admin/services'),
  createService: (data) => axiosClient.post('/admin/services', data),
  updateService: (id, data) => axiosClient.put(`/admin/services/${id}`, data),
  deleteService: (id) => axiosClient.delete(`/admin/services/${id}`),

  // Customers
  getCustomers: () => axiosClient.get('/admin/customers'),
  createCustomer: (data) => axiosClient.post('/admin/customers', data),
  updateCustomer: (id, data) => axiosClient.put(`/admin/customers/${id}`, data),
  deleteCustomer: (id) => axiosClient.delete(`/admin/customers/${id}`),

  // Staff
  getStaff: () => axiosClient.get('/admin/staff'),
  createStaff: (data) => axiosClient.post('/admin/staff', data),
  updateStaff: (id, data) => axiosClient.put(`/admin/staff/${id}`, data),
  deleteStaff: (id) => axiosClient.delete(`/admin/staff/${id}`),

  // Areas
  getAreas: () => axiosClient.get('/admin/areas'),
  createArea: (data) => axiosClient.post('/admin/areas', data),
  updateArea: (id, data) => axiosClient.put(`/admin/areas/${id}`, data),
  deleteArea: (id) => axiosClient.delete(`/admin/areas/${id}`),

  // Requests
  getRequests: () => axiosClient.get('/admin/rescue-requests'),
  assignRequest: (id, data) => axiosClient.put(`/admin/rescue-requests/${id}/assign`, data),
};
