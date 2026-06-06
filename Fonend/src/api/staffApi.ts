// src/api/staffApi.ts
import axiosClient from './axiosClient';

// ─── Types ────────────────────────────────────────────────────────────────────
export type SubStatus = 'DaNhan' | 'DangDen' | 'DaDen' | 'DangSua';

export interface YeuCauItem {
  id: number;
  trangThaiHienTai: string;
  subStatus?: string;
  moTaSuCo: string;
  noiSuCo: string;
  ngayTao: string;
  ngayHoanThanh?: string;
  lyDoHuy?: string;
  chiPhiDuKien?: number;
  chiPhiThucTe?: number;
  phiDichVu?: number;
  // KH
  tenKhachHang: string;
  soDienThoai: string;
  avatarKhachHang?: string;
  idTaiKhoanKhachHang: number;
  // Xe
  bienSo: string; hangXe: string; dongXe: string; mauXe?: string; tenLoaiXe: string;
  // Dịch vụ
  tenDichVu: string; tenDanhMuc: string; giaCoBan: number;
  // Khu vực
  tenPhuongXa: string; tenTinh: string; kinhDo?: number; viDo?: number;
  // Detail only
  lichSuTrangThai?: LichSuItem[];
  danhGia?: DanhGiaItem;
}

export interface LichSuItem {
  idLichSu: number;
  trangThai: string;
  ghiChu: string;
  thoiGianCapNhat: string;
}

export interface DanhGiaItem {
  soSao: number;
  nhanXet: string;
  thoiGian: string;
}

export interface TinNhanItem {
  id: number;
  noiDung: string;
  loai: string;
  fileUrl?: string;
  thoiGianGui: string;
  idTaiKhoanGui: number;
  tenNguoiGui: string;
  avatarNguoiGui?: string;
  isMyMessage: boolean;
}

export interface LichCuuHoItem {
  id: number;
  trangThaiHienTai: string;
  tenKhachHang: string;
  soDienThoai: string;
  tenDichVu: string;
  noiSuCo: string;
  tenPhuongXa: string;
  tenTinh: string;
  ngayTao: string;
  ngayHoanThanh?: string;
  chiPhiThucTe?: number;
}

export interface ThongKe {
  tongDon: number;
  donHoanThanh: number;
  donDangXuLy: number;
  donDaHuy: number;
  tongThuNhap: number;
}

export interface NhanVienProfile {
  idNhanVien: number;
  idTaiKhoan: number;
  hoTen: string;
  email: string;
  soDienThoai: string;
  ngaySinh?: string;
  avatar?: string;
  trangThaiNhanViec: boolean;
  diemTb: number;
  moTa?: string;
  khuVucPhucVu: { idPhuongXa: number; tenPhuongXa: string; tenTinh: string }[];
  dichVuCungCap: { idDichVu: number; tenDichVu: string; giaCoBan: number; tenDanhMuc: string }[];
  thongKe: { tongDonHoanThanh: number };
}

export interface DichVuOption {
  id: number; name: string; giaCoBan: number; moTa?: string; tenDanhMuc: string;
}

// ─── API functions ─────────────────────────────────────────────────────────────
export const staffApi = {

  // Lấy idNhanVien từ idTaiKhoan (gọi sau khi login)
  getStaffByTaiKhoan: (idTaiKhoan: number) =>
    axiosClient.get<any, { idNhanVien: number; hoTen: string; trangThaiNhanViec: boolean; diemTb: number }>(
      `/NhanVien/by-taikhoan/${idTaiKhoan}`
    ),

  // UC-21: Đơn chờ phù hợp với nhân viên
  getPending: (staffId: number): Promise<YeuCauItem[]> =>
    axiosClient.get('/YeuCau/pending', { params: { staffId } }),

  // Đơn đang xử lý (active task)
  getActive: (staffId: number): Promise<YeuCauItem | null> =>
    axiosClient.get(`/YeuCau/active-task/${staffId}`),

  // Chi tiết yêu cầu
  getDetail: (id: number, staffId: number): Promise<YeuCauItem> =>
    axiosClient.get(`/YeuCau/${id}/detail`, { params: { staffId } }),

  // UC-21+22: Nhận đơn
  accept: (id: number, idNhanVien: number) =>
    axiosClient.post<any, { message: string }>(`/YeuCau/${id}/accept`, { idNhanVien }),

  // UC-23: Cập nhật sub-status
  updateStatus: (id: number, idNhanVien: number, trangThai: SubStatus, ghiChu?: string) =>
    axiosClient.put<any, { message: string; trangThai: string }>(`/YeuCau/${id}/status`, {
      idNhanVien, trangThai, ghiChu
    }),

  // UC-24: Hoàn thành
  complete: (id: number, idNhanVien: number, chiPhiThucTe: number, ghiChu?: string) =>
    axiosClient.post<any, { message: string; chiPhiThucTe: number; ngayHoanThanh: string }>(
      `/YeuCau/${id}/complete`, { idNhanVien, chiPhiThucTe, ghiChu }
    ),

  // UC-25: Tin nhắn
  getMessages: (requestId: number, idTaiKhoan: number): Promise<TinNhanItem[]> =>
    axiosClient.get(`/Chat/${requestId}`, { params: { idTaiKhoan } }),

  sendMessage: (requestId: number, idTaiKhoanGui: number, message: string, fileUrl?: string): Promise<TinNhanItem> =>
    axiosClient.post(`/Chat/${requestId}/send`, { idTaiKhoanGui, message, fileUrl }),

  // UC-26: Lịch cứu hộ
  getHistory: (staffId: number, thang?: number, nam?: number) =>
    axiosClient.get<any, { lichCuuHo: LichCuuHoItem[]; thongKe: ThongKe; thang: number; nam: number }>(
      `/NhanVien/${staffId}/history`, { params: { thang, nam } }
    ),

  // UC-27: Profile
  getProfile: (staffId: number): Promise<NhanVienProfile> =>
    axiosClient.get(`/NhanVien/${staffId}/profile`),

  updateProfile: (staffId: number, data: Partial<{
    hoTen: string; soDienThoai: string; ngaySinh: string;
    avatar: string; moTa: string; trangThaiNhanViec: boolean;
  }>) =>
    axiosClient.put<any, { message: string }>(`/NhanVien/${staffId}/profile`, data),

  // UC-28: Dịch vụ
  getServices: (staffId: number) =>
    axiosClient.get<any, { tatCaDichVu: DichVuOption[]; daDangKy: number[] }>(
      `/NhanVien/${staffId}/services`
    ),

  updateServices: (staffId: number, services: number[]) =>
    axiosClient.put<any, { message: string; canhBao?: string }>(
      `/NhanVien/${staffId}/services`, { services }
    ),

  // Dashboard Metrics
  getDashboardMetrics: (staffId: number) =>
    axiosClient.get(`/NhanVien/${staffId}/dashboard-metrics`).then(res => res.data),
};