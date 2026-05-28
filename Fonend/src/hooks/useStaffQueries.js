// src/hooks/useStaffQueries.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { staffApi } from '../api/staffApi'; // Đã xóa type SubStatus
import { useAuth } from '../auth/AuthContext'; // Lưu ý: Nếu ở bước trước bạn để AuthContext ở thư mục 'src/auth/AuthContext.jsx' thì nhớ sửa lại đường dẫn này thành '../auth/AuthContext' nhé.

// ─── Lấy idNhanVien từ idTaiKhoan trong JWT ──────────────────────────────────
export const useStaffId = () => {
  const { user } = useAuth();
  const idTaiKhoan = user ? parseInt(user.id) : 0;

  return useQuery({
    queryKey: ['staffId', idTaiKhoan],
    queryFn: () => staffApi.getStaffByTaiKhoan(idTaiKhoan),
    enabled: !!idTaiKhoan && !isNaN(idTaiKhoan),
    staleTime: Infinity, // idNhanVien không đổi trong session
  });
};

// ─── Hook tổng hợp dùng trong các trang staff ────────────────────────────────
export const useStaffData = () => {
  const queryClient = useQueryClient();
  const { data: staffInfo } = useStaffId();
  const staffId = staffInfo?.idNhanVien ?? 0;

  // ── UC-21: Đơn chờ ───────────────────────────────────────────────────────
  const pendingQuery = useQuery({
    queryKey: ['pendingList', staffId],
    queryFn: () => staffApi.getPending(staffId),
    enabled: staffId > 0,
    refetchInterval: 10_000, // Quét 10s/lần — đơn mới có thể vào
  });

  // ── Đơn đang xử lý ──────────────────────────────────────────────────────
  const activeTaskQuery = useQuery({
    queryKey: ['activeTask', staffId],
    queryFn: () => staffApi.getActive(staffId),
    enabled: staffId > 0,
    refetchInterval: 15_000,
  });

  // ── UC-26: Lịch sử ──────────────────────────────────────────────────────
  const historyQuery = useQuery({
    queryKey: ['staffHistory', staffId],
    queryFn: () => staffApi.getHistory(staffId),
    enabled: staffId > 0,
  });

  // ── UC-27: Profile ──────────────────────────────────────────────────────
  const profileQuery = useQuery({
    queryKey: ['staffProfile', staffId],
    queryFn: () => staffApi.getProfile(staffId),
    enabled: staffId > 0,
  });

  // ── UC-28: Dịch vụ ──────────────────────────────────────────────────────
  const servicesQuery = useQuery({
    queryKey: ['staffServices', staffId],
    queryFn: () => staffApi.getServices(staffId),
    enabled: staffId > 0,
  });

  // ── Mutations ────────────────────────────────────────────────────────────
  const actions = {
    // UC-21+22: Nhận đơn
    accept: useMutation({
      mutationFn: (id) => staffApi.accept(id, staffId),
      onSuccess: () => {
        toast.success('✅ Nhận nhiệm vụ thành công!');
        queryClient.invalidateQueries({ queryKey: ['pendingList', staffId] });
        queryClient.invalidateQueries({ queryKey: ['activeTask', staffId] });
      },
      onError: (err) =>
        toast.error('❌ ' + (err?.response?.data?.message ?? 'Lỗi khi nhận nhiệm vụ!')),
    }),

    // UC-23: Cập nhật sub-status
    updateStatus: useMutation({
      mutationFn: ({ id, trangThai, ghiChu }) =>
        staffApi.updateStatus(id, staffId, trangThai, ghiChu),
      onSuccess: (_, { id }) => {
        toast.success('✅ Cập nhật trạng thái thành công!');
        queryClient.invalidateQueries({ queryKey: ['activeTask', staffId] });
        queryClient.invalidateQueries({ queryKey: ['yeuCauDetail', id] });
      },
      onError: (err) =>
        toast.error('❌ ' + (err?.response?.data?.message ?? 'Cập nhật trạng thái thất bại!')),
    }),

    // UC-24: Hoàn thành
    complete: useMutation({
      mutationFn: ({ id, chiPhiThucTe, ghiChu }) =>
        staffApi.complete(id, staffId, chiPhiThucTe, ghiChu),
      onSuccess: () => {
        toast.success('✅ Đã lưu hóa đơn và hoàn thành nhiệm vụ!');
        queryClient.invalidateQueries({ queryKey: ['activeTask', staffId] });
        queryClient.invalidateQueries({ queryKey: ['staffHistory', staffId] });
      },
      onError: (err) =>
        toast.error('❌ ' + (err?.response?.data?.message ?? 'Lỗi khi hoàn thành!')),
    }),

    // UC-27: Cập nhật profile
    updateProfile: useMutation({
      mutationFn: (data) => staffApi.updateProfile(staffId, data),
      onSuccess: () => {
        toast.success('✅ Cập nhật thông tin thành công!');
        queryClient.invalidateQueries({ queryKey: ['staffProfile', staffId] });
      },
      onError: (err) =>
        toast.error('❌ ' + (err?.response?.data?.message ?? 'Cập nhật thất bại!')),
    }),

    // UC-28: Cập nhật dịch vụ
    updateServices: useMutation({
      mutationFn: (services) => staffApi.updateServices(staffId, services),
      onSuccess: (res) => {
        toast.success('✅ Đã cập nhật dịch vụ cung cấp!');
        if (res.canhBao) toast(res.canhBao, { icon: '⚠️' });
        queryClient.invalidateQueries({ queryKey: ['staffServices', staffId] });
        queryClient.invalidateQueries({ queryKey: ['staffProfile', staffId] });
      },
      onError: (err) =>
        toast.error('❌ ' + (err?.response?.data?.message ?? 'Cập nhật dịch vụ thất bại!')),
    }),
  };

  return {
    staffId,
    staffInfo,
    pendingQuery,
    activeTaskQuery,
    historyQuery,
    profileQuery,
    servicesQuery,
    actions,
  };
};

// ─── Hook riêng chi tiết yêu cầu ─────────────────────────────────────────────
export const useYeuCauDetail = (id, staffId) =>
  useQuery({
    queryKey: ['yeuCauDetail', id],
    queryFn: () => staffApi.getDetail(id, staffId),
    enabled: id > 0 && staffId > 0,
  });

// ─── Hook riêng tin nhắn ─────────────────────────────────────────────────────
export const useTinNhan = (requestId, idTaiKhoan) =>
  useQuery({
    queryKey: ['tinNhan', requestId],
    queryFn: () => staffApi.getMessages(requestId, idTaiKhoan),
    enabled: requestId > 0 && idTaiKhoan > 0,
    refetchInterval: 5_000, // Polling 5s
  });

// ─── Hook lịch cứu hộ với tháng/năm tuỳ chọn ────────────────────────────────
export const useLichCuuHo = (staffId, thang, nam) =>
  useQuery({
    queryKey: ['staffHistory', staffId, thang, nam],
    queryFn: () => staffApi.getHistory(staffId, thang, nam),
    enabled: staffId > 0,
  });