// File: src/api/staffApi.js
import axiosClient from './axiosClient';

// ─── API functions ─────────────────────────────────────────────────────────────
export const staffApi = {

  // Lấy idNhanVien từ idTaiKhoan (gọi sau khi login)
  getStaffByTaiKhoan: (idTaiKhoan) =>
    axiosClient.get(`/NhanVien/by-taikhoan/${idTaiKhoan}`),

  // UC-21: Đơn chờ phù hợp với nhân viên
  getPending: (staffId) =>
    axiosClient.get('/YeuCau/pending', { params: { staffId } }),

  // Đơn đang xử lý (active task)
  getActive: (staffId) =>
    axiosClient.get(`/YeuCau/active-task/${staffId}`),

  // Chi tiết yêu cầu
  getDetail: (id, staffId) =>
    axiosClient.get(`/YeuCau/${id}/detail`, { params: { staffId } }),

  // UC-21+22: Nhận đơn
  accept: (id, idNhanVien) =>
    axiosClient.post(`/YeuCau/${id}/accept`, { idNhanVien }),

  // UC-23: Cập nhật sub-status
  updateStatus: (id, idNhanVien, trangThai, ghiChu) =>
    axiosClient.put(`/YeuCau/${id}/status`, { idNhanVien, trangThai, ghiChu }),

  // UC-24: Hoàn thành
  complete: (id, idNhanVien, chiPhiThucTe, ghiChu) =>
    axiosClient.post(`/YeuCau/${id}/complete`, { idNhanVien, chiPhiThucTe, ghiChu }),

  // UC-25: Tin nhắn
  getMessages: (requestId, idTaiKhoan) =>
    axiosClient.get(`/Chat/${requestId}`, { params: { idTaiKhoan } }),

  sendMessage: (requestId, idTaiKhoanGui, message, fileUrl) =>
    axiosClient.post(`/Chat/${requestId}/send`, { idTaiKhoanGui, message, fileUrl }),

  // UC-26: Lịch cứu hộ
  getHistory: (staffId, thang, nam) =>
    axiosClient.get(`/NhanVien/${staffId}/history`, { params: { thang, nam } }),

  // UC-27: Profile
  getProfile: (staffId) =>
    axiosClient.get(`/NhanVien/${staffId}/profile`),

  updateProfile: (staffId, data) =>
    axiosClient.put(`/NhanVien/${staffId}/profile`, data),

  // UC-28: Dịch vụ
  getServices: (staffId) =>
    axiosClient.get(`/NhanVien/${staffId}/services`),

  updateServices: (staffId, services) =>
    axiosClient.put(`/NhanVien/${staffId}/services`, { services }),
};