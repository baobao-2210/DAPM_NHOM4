import axiosClient from './axiosClient';

export const staffApi = {
  // UC-21 & UC-22: Lấy đơn chờ và Nhận đơn
  getPending: () => axiosClient.get('/YeuCau/pending'),
  getActive: (staffId: string) => axiosClient.get(`/YeuCau/active-task/${staffId}`),
  accept: (id: string | number, staffId: string) => axiosClient.post(`/YeuCau/${id}/accept`, `"${staffId}"`),
  
  // UC-23: Cập nhật trạng thái (Đang đến, Đang xử lý)
  updateStatus: (id: string | number, status: string) => axiosClient.put(`/YeuCau/${id}/status`, `"${status}"`),
  
  // UC-24: Hoàn thành cứu hộ
  complete: (id: string | number, finalCost: number) => axiosClient.post(`/YeuCau/${id}/complete`, finalCost),

  // UC-25: Nhắn tin khách hàng (Chat)
  getMessages: (requestId: string) => axiosClient.get(`/Chat/${requestId}`),
  sendMessage: (requestId: string, message: string) => axiosClient.post(`/Chat/${requestId}/send`, { message }),

  // UC-26: Xem lịch sử cứu hộ
  getHistory: (staffId: string) => axiosClient.get(`/NhanVien/${staffId}/history`),

  // UC-27 & UC-28: Lấy và Cập nhật Hồ sơ cá nhân & Dịch vụ
  getProfile: (staffId: string) => axiosClient.get(`/NhanVien/${staffId}/profile`),
  updateProfile: (staffId: string, profileData: any) => axiosClient.put(`/NhanVien/${staffId}/profile`, profileData),
  updateServices: (staffId: string, services: any) => axiosClient.put(`/NhanVien/${staffId}/services`, services),
};