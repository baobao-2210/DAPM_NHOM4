import axiosClient from './axiosClient';

export const notificationApi = {
  // Lấy thông báo theo ID Tài khoản
  getByUserId: (userId) => axiosClient.get(`/ThongBao/tai-khoan/${userId}`),
  
  // Đánh dấu 1 thông báo là đã đọc
  markAsRead: (id) => axiosClient.put(`/ThongBao/${id}/read`),
  
  // Đánh dấu tất cả thông báo của 1 tài khoản là đã đọc
  markAllAsRead: (userId) => axiosClient.put(`/ThongBao/read-all/${userId}`),
};
