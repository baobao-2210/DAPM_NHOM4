import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import axiosClient from '../../api/axiosClient';
import toast from 'react-hot-toast';

// Icon service theo danh mục
const SERVICE_ICONS = {
  'Thay lốp': '🛞',
  'Kích bình': '🔋',
  'Bơm lốp': '💨',
  'Kéo xe': '🚛',
  'Sửa chữa': '🔧',
  'default': '⚙️',
};

const getIcon = (name) => {
  for (const key of Object.keys(SERVICE_ICONS)) {
    if (name.toLowerCase().includes(key.toLowerCase())) return SERVICE_ICONS[key];
  }
  return SERVICE_ICONS['default'];
};

export default function StaffServices() {
  const { user } = useAuth();
  
  // States lưu dữ liệu từ API
  const [staffInfo, setStaffInfo] = useState(null);
  const [tatCaDichVu, setTatCaDichVu] = useState([]);
  const [daDangKy, setDaDangKy] = useState([]);
  const [loading, setLoading] = useState(true);

  // States quản lý thao tác trên UI
  const [selected, setSelected] = useState([]);
  const [isDirty, setIsDirty] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 1. Fetch dữ liệu bằng useEffect thuần
  useEffect(() => {
    const fetchData = async () => {
      try {
        const idTaiKhoan = user?._id || user?.id;
        if (!idTaiKhoan) return;

        // Lấy IdNhanVien
        const nvRes = await axiosClient.get(`/NhanVien/by-taikhoan/${idTaiKhoan}`);
        const sId = nvRes.data.idNhanVien;
        setStaffInfo(nvRes.data);

        // Lấy danh sách Dịch vụ
        const srvRes = await axiosClient.get(`/NhanVien/${sId}/services`);
        const allServices = srvRes.data.tatCaDichVu || [];
        const registered = srvRes.data.daDangKy || [];

        setTatCaDichVu(allServices);
        setDaDangKy(registered);
        setSelected(registered); // Gán mặc định vào danh sách đang chọn
      } catch (error) {
        console.error("Lỗi tải dữ liệu dịch vụ", error);
        toast.error("Không thể tải danh sách dịch vụ");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // 2. Các hàm xử lý
  const toggle = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    setIsDirty(true);
    setSaved(false);
  };

  const handleCancel = () => {
    setSelected(daDangKy);
    setIsDirty(false);
    setSaved(false);
  };

  const handleSave = async () => {
    if (selected.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 dịch vụ');
      return;
    }

    setIsSaving(true);
    try {
      // Gọi API Update Dịch vụ của C#
      await axiosClient.put(`/NhanVien/${staffInfo.idNhanVien}/services`, {
        services: selected
      });

      setDaDangKy(selected); // Đồng bộ lại dữ liệu gốc
      setIsDirty(false);
      setSaved(true);
      toast.success("Đã lưu cấu hình dịch vụ thành công!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Lưu thất bại");
    } finally {
      setIsSaving(false);
    }
  };

  // 3. Phân nhóm danh mục
  const byCategory = tatCaDichVu.reduce((acc, dv) => {
    const cat = dv.tenDanhMuc ?? 'Khác';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(dv);
    return acc;
  }, {});

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <nav className="text-xs text-gray-400 mb-1">Quản lý &rsaquo; Hồ sơ cá nhân &rsaquo; <span className="text-gray-600 ml-1">Cập nhật dịch vụ</span></nav>
          <h1 className="text-2xl font-bold text-gray-900">Cập nhật dịch vụ cung cấp</h1>
          <p className="text-gray-500 text-sm mt-1">Quản lý các loại hình dịch vụ cứu hộ bạn có thể thực hiện.</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-green-600 text-xs font-medium flex items-center gap-1"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5"><path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>Đã lưu</span>}
          <button onClick={handleCancel} disabled={!isDirty} className="px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40">Hủy bỏ</button>
          <button onClick={handleSave} disabled={!isDirty || selected.length === 0 || isSaving} className="px-5 py-2 bg-[#1e3a8a] hover:bg-blue-800 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-40 flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            {isSaving ? 'Đang lưu...' : 'Lưu cấu hình'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center"><svg viewBox="0 0 12 10" fill="none" className="w-3 h-3"><path d="M1 5l3 3.5L11 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
              <h2 className="font-bold text-gray-800">Dịch vụ đang cung cấp</h2>
            </div>
            {selected.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">Chưa chọn dịch vụ nào. Chọn bên dưới để thêm vào danh sách.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {tatCaDichVu.filter(dv => selected.includes(dv.id)).map(dv => (
                  <div key={dv.id} className="flex items-center gap-3 p-3 rounded-lg border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors">
                    <div className="w-9 h-9 bg-blue-200/50 rounded-lg flex items-center justify-center text-lg shrink-0">{getIcon(dv.name)}</div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-blue-800 truncate">{dv.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5"><div className="w-1.5 h-1.5 bg-green-500 rounded-full" /><p className="text-xs text-green-600 font-medium">Đang kích hoạt</p></div>
                    </div>
                    <button onClick={() => toggle(dv.id)} className="text-blue-300 hover:text-red-500 transition-colors shrink-0 p-1">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {Object.entries(byCategory).map(([cat, items]) => (
            <div key={cat} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3.5 bg-gray-50 border-b border-gray-100"><h3 className="font-semibold text-gray-700 text-sm">{cat}</h3></div>
              <div className="p-4 grid grid-cols-2 gap-3">
                {items.map(dv => {
                  const isOn = selected.includes(dv.id);
                  return (
                    <div key={dv.id} onClick={() => toggle(dv.id)} className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all select-none ${isOn ? 'border-blue-600 bg-blue-50 shadow-sm' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                      <div className={`absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isOn ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`}>
                        {isOn && <svg viewBox="0 0 12 10" fill="none" className="w-2.5 h-2.5"><path d="M1 5l3 3.5L11 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl mb-3 ${isOn ? 'bg-blue-100' : 'bg-gray-100'}`}>{getIcon(dv.name)}</div>
                      <p className={`text-sm font-bold mb-0.5 pr-6 ${isOn ? 'text-blue-800' : 'text-gray-800'}`}>{dv.name}</p>
                      {dv.moTa && <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{dv.moTa}</p>}
                      <div className="mt-3 pt-2.5 border-t border-gray-100">
                        <p className="text-xs text-gray-400">GIÁ CƠ BẢN</p>
                        <p className={`text-sm font-bold ${isOn ? 'text-blue-600' : 'text-gray-700'}`}>{dv.giaCoBan.toLocaleString('vi-VN')}đ</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="bg-gray-800 rounded-xl p-5 text-white">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Tóm tắt khả năng</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Tổng dịch vụ:</span>
                <span className="font-bold text-white">{selected.length.toString().padStart(2, '0')} / {tatCaDichVu.length.toString().padStart(2, '0')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Trạng thái sẵn sàng:</span>
                <span className={`font-bold ${staffInfo?.trangThaiNhanViec ? 'text-green-400' : 'text-red-400'}`}>
                  {selected.length > 0 ? `${Math.round((selected.length / tatCaDichVu.length) * 100)}%` : '0%'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}