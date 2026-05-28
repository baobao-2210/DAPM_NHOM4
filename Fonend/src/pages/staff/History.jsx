import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLichCuuHo, useStaffData } from '../../hooks/useStaffQueries';

const STATUS = {
  HoanThanh: { label: 'Hoàn thành', cls: 'bg-green-100 text-green-700' },
  DangXuLy:  { label: 'Đang xử lý', cls: 'bg-blue-100  text-blue-700'  },
  DaHuy:     { label: 'Đã hủy',     cls: 'bg-red-100   text-red-700'   },
  TiepNhan:  { label: 'Chờ nhận',   cls: 'bg-orange-100 text-orange-700'},
};

const fmt = (n) => n != null ? n.toLocaleString('vi-VN') + ' đ' : '—';
const fmtD = (d) => d ? new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';

export default function History() {
  const navigate = useNavigate();
  const now = new Date();
  const [thang, setThang] = useState(now.getMonth() + 1);
  const [nam, setNam] = useState(now.getFullYear());
  const [filter, setFilter] = useState('all');

  const { staffId } = useStaffData();
  const { data, isLoading } = useLichCuuHo(staffId, thang, nam);

  const list = data?.lichCuuHo ?? [];
  const thongKe = data?.thongKe;
  const filtered = filter === 'all' ? list : list.filter(x => x.trangThaiHienTai === filter);

  const prevMonth = () => {
    if (thang === 1) { setThang(12); setNam(y => y - 1); }
    else setThang(t => t - 1);
  };
  const nextMonth = () => {
    if (nam > now.getFullYear() || (nam === now.getFullYear() && thang >= now.getMonth() + 1)) return;
    if (thang === 12) { setThang(1); setNam(y => y + 1); }
    else setThang(t => t + 1);
  };
  const isCurrent = thang === now.getMonth() + 1 && nam === now.getFullYear();

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Lịch sử cứu hộ</h1>
        <p className="text-gray-500 text-sm mt-1">Theo dõi các nhiệm vụ đã thực hiện theo tháng</p>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5">
          <button onClick={prevMonth} className="text-gray-400 hover:text-gray-600 transition-colors">«</button>
          <span className="text-sm font-semibold text-gray-800 w-28 text-center">
            Tháng {thang}/{nam} {isCurrent && <span className="ml-1 text-xs text-blue-600">(hiện tại)</span>}
          </span>
          <button onClick={nextMonth} disabled={isCurrent} className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-30">»</button>
        </div>

        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {[
            { key: 'all', label: 'Tất cả' },
            { key: 'HoanThanh', label: 'Hoàn thành' },
            { key: 'DaHuy', label: 'Đã hủy' },
          ].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${filter === f.key ? 'bg-white text-[#1e3a8a] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {thongKe && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Tổng đơn', value: thongKe.tongDon, color: 'text-gray-800', border: 'border-gray-200', bg: '' },
            { label: 'Hoàn thành', value: thongKe.donHoanThanh, color: 'text-green-700', border: 'border-green-200', bg: 'bg-green-50' },
            { label: 'Đang xử lý', value: thongKe.donDangXuLy, color: 'text-blue-700', border: 'border-blue-200', bg: 'bg-blue-50' },
            { label: 'Thu nhập tháng', value: thongKe.tongThuNhap.toLocaleString('vi-VN') + 'đ', color: 'text-[#1e3a8a]', border: 'border-blue-200', bg: 'bg-blue-50' },
          ].map(s => (
            <div key={s.label} className={`rounded-xl border p-4 ${s.bg || 'bg-white'} ${s.border}`}>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">Đang tải dữ liệu...</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">Không có dữ liệu</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['Mã đơn', 'Khách hàng', 'Dịch vụ', 'Địa điểm', 'Ngày tạo', 'Ngày HT', 'Chi phí', 'Trạng thái', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(item => {
                const s = STATUS[item.trangThaiHienTai] ?? { label: item.trangThaiHienTai, cls: 'bg-gray-100 text-gray-600' };
                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3.5"><span className="text-sm font-semibold text-blue-600">#{item.id}</span></td>
                    <td className="px-4 py-3.5"><p className="text-sm font-medium text-gray-800">{item.tenKhachHang}</p></td>
                    <td className="px-4 py-3.5"><p className="text-sm text-gray-700 font-medium">{item.tenDichVu}</p></td>
                    <td className="px-4 py-3.5 max-w-[160px]"><p className="text-sm text-gray-600 truncate">{item.noiSuCo}</p></td>
                    <td className="px-4 py-3.5 text-sm text-gray-500 whitespace-nowrap">{fmtD(item.ngayTao)}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-500 whitespace-nowrap">{fmtD(item.ngayHoanThanh)}</td>
                    <td className="px-4 py-3.5 text-sm font-semibold text-gray-800 whitespace-nowrap">{item.trangThaiHienTai === 'HoanThanh' ? fmt(item.chiPhiThucTe) : '—'}</td>
                    <td className="px-4 py-3.5"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.cls}`}>{s.label}</span></td>
                    <td className="px-4 py-3.5"><button onClick={() => navigate(`/partner/yeucau/${item.id}`)} className="text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline">Chi tiết</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}