import axiosClient from './axiosClient';

// ======================= MOCK DATA =======================
const USE_MOCK = true; // Đặt thành false để gọi API thật

let mockPending = [
  { id: '101', loaiSuCo: 'Thay lốp dự phòng', tenKhachHang: 'Nguyễn Văn A', diaChi: '123 Lê Lợi, Quận 1, TP.HCM', soDienThoai: '0901234567' },
  { id: '102', loaiSuCo: 'Kích bình ắc quy', tenKhachHang: 'Trần Thị B', diaChi: '456 Nguyễn Huệ, Quận 1, TP.HCM', soDienThoai: '0909876543' }
];

let mockActive: any = null;

let mockHistory = [
  { id: 'h1', tenKhachHang: 'Lê Văn C', diaChi: 'Ngã tư Hàng Xanh, Bình Thạnh', chiPhiThucTe: 450000 },
  { id: 'h2', tenKhachHang: 'Phạm Thị D', diaChi: 'Khu công nghệ cao, Quận 9', chiPhiThucTe: 800000 }
];

let mockProfile = {
  tenNhanVien: 'Trần Hữu Nam',
  soDienThoai: '0987654321',
  email: 'nam.tran@rescuevn.com',
  services: [
    { id: '1', name: 'Kéo xe', active: true },
    { id: '2', name: 'Kích bình', active: false },
    { id: '3', name: 'Thay lốp', active: true }
  ]
};

// Hàm delay để mô phỏng thời gian chờ mạng (loading state)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
// =========================================================

export const staffApi = {
  // UC-21 & UC-22: Lấy đơn chờ và Nhận đơn
  getPending: async () => {
    if (USE_MOCK) { await delay(500); return mockPending; }
    return axiosClient.get('/YeuCau/pending').then(res => res.data);
  },
  
  getActive: async (staffId: string) => {
    if (USE_MOCK) { await delay(500); return mockActive; }
    return axiosClient.get(`/YeuCau/active-task/${staffId}`).then(res => res.data);
  },
  
  accept: async (id: string | number, staffId: string) => {
    if (USE_MOCK) {
      await delay(800);
      const task = mockPending.find(t => t.id == id);
      if (task) {
        mockActive = { ...task, trangThaiHienTai: 'accepted' };
        mockPending = mockPending.filter(t => t.id != id);
      }
      return mockActive;
    }
    return axiosClient.post(`/YeuCau/${id}/accept`, `"${staffId}"`).then(res => res.data);
  },

  // UC-23: Cập nhật trạng thái (Đang đến, Đang xử lý)
  updateStatus: async (id: string | number, status: string) => {
    if (USE_MOCK) {
      await delay(800);
      if (mockActive) mockActive.trangThaiHienTai = status;
      return mockActive;
    }
    return axiosClient.put(`/YeuCau/${id}/status`, `"${status}"`).then(res => res.data);
  },

  // UC-24: Hoàn thành cứu hộ
  complete: async (id: string | number, finalCost: number) => {
    if (USE_MOCK) {
      await delay(1000);
      if (mockActive) {
        mockHistory = [{ id: mockActive.id, tenKhachHang: mockActive.tenKhachHang, diaChi: mockActive.diaChi, chiPhiThucTe: finalCost }, ...mockHistory];
        mockActive = null;
      }
      return { success: true };
    }
    return axiosClient.post(`/YeuCau/${id}/complete`, finalCost).then(res => res.data);
  },

  // UC-25: Nhắn tin khách hàng (Chat)
  getMessages: async (requestId: string) => {
    if (USE_MOCK) return [];
    return axiosClient.get(`/Chat/${requestId}`).then(res => res.data);
  },
  
  sendMessage: async (requestId: string, message: string) => {
    if (USE_MOCK) return { success: true };
    return axiosClient.post(`/Chat/${requestId}/send`, { message }).then(res => res.data);
  },

  // UC-26: Xem lịch sử cứu hộ
  getHistory: async (staffId: string) => {
    if (USE_MOCK) { await delay(500); return mockHistory; }
    return axiosClient.get(`/NhanVien/${staffId}/history`).then(res => res.data);
  },

  // UC-27 & UC-28: Lấy và Cập nhật Hồ sơ cá nhân & Dịch vụ
  getProfile: async (staffId: string) => {
    if (USE_MOCK) { await delay(500); return mockProfile; }
    return axiosClient.get(`/NhanVien/${staffId}/profile`).then(res => res.data);
  },
  
  updateProfile: async (staffId: string, profileData: any) => {
    if (USE_MOCK) {
      await delay(800);
      mockProfile = { ...mockProfile, ...profileData };
      return mockProfile;
    }
    return axiosClient.put(`/NhanVien/${staffId}/profile`, profileData).then(res => res.data);
  },
  
  updateServices: async (staffId: string, services: any) => {
    if (USE_MOCK) {
      await delay(500);
      mockProfile.services = services;
      return mockProfile;
    }
    return axiosClient.put(`/NhanVien/${staffId}/services`, services).then(res => res.data);
  },
};