import axiosClient from './axiosClient';

export const customerApi = {
  // Auth
  login: (data) => axiosClient.post('/auth/login', data),
  register: (data) => axiosClient.post('/auth/register-customer', data),

  // Services
  getServices: () => axiosClient.get('/DichVu'),

  // Profile
  getProfile: () => axiosClient.get('/customer/profile'),
  updateProfile: (data) => axiosClient.put('/customer/profile', data),

  // Vehicles
  getVehicles: () => axiosClient.get('/customer/vehicles'),
  createVehicle: (data) => axiosClient.post('/customer/vehicles', data),
  updateVehicle: (id, data) => axiosClient.put(`/customer/vehicles/${id}`, data),
  deleteVehicle: (id) => axiosClient.delete(`/customer/vehicles/${id}`),

  // Rescue Requests
  getRequests: () => axiosClient.get('/customer/rescue-requests'),
  getRequestDetail: (id) => axiosClient.get(`/customer/rescue-requests/${id}`),
  createRequest: (data) => axiosClient.post('/customer/rescue-requests', data),
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosClient.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Actions (Thanh toán, Đánh giá, Khiếu nại)
  payRequest: (id, data) => axiosClient.post(`/customer/rescue-requests/${id}/pay`, data),
  reviewRequest: (id, data) => axiosClient.post(`/customer/rescue-requests/${id}/review`, data),
  submitComplaint: (data) => axiosClient.post('/customer/complaints', data),
  getComplaints: () => axiosClient.get('/customer/complaints'),
};
