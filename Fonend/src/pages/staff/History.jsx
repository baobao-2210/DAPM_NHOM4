import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import axiosClient from '../../api/axiosClient';
import Loading from '../../components/Loading';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import { ClipboardList, Calendar, Search, Filter } from 'lucide-react';

const History = () => {
  const { user } = useAuth();
  const [staffId, setStaffId] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const idTaiKhoan = user?._id || user?.id;
    if (idTaiKhoan) {
      axiosClient.get(`/NhanVien/by-taikhoan/${idTaiKhoan}`)
        .then(res => setStaffId(res.data.idNhanVien))
        .catch(err => console.error(err));
    }
  }, [user]);

  const loadHistory = async () => {
    if (!staffId) return;
    setLoading(true);
    try {
      const res = await axiosClient.get(`/NhanVien/${staffId}/history?thang=${month}&nam=${year}`);
      setHistoryData(res.data.lichCuuHo || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staffId, month, year]);

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  const getStatusBadge = (status) => {
    if (status === 'HoanThanh') return <Badge variant="success">Hoàn thành</Badge>;
    if (status === 'DaHuy') return <Badge variant="danger">Đã hủy</Badge>;
    return <Badge variant="warning">{status}</Badge>;
  };

  // Lọc local cho search
  const filteredData = historyData.filter(item => 
    item.tenKhachHang?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.id?.toString().includes(searchTerm)
  );

  return (
    <div className="font-['Inter']">
      <PageHeader
        title="Lịch sử cứu hộ"
        description="Tra cứu các đơn cứu hộ đã hoàn thành hoặc đã hủy trong tháng."
      />

      <Card className="border border-slate-200 shadow-sm rounded-[16px] overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 w-full md:w-auto relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3" />
            <input 
              type="text" 
              placeholder="Tìm theo Tên KH hoặc Mã đơn..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-xl outline-none focus:border-blue-500 w-full md:w-64 text-sm"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-xl px-3 py-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              <select 
                value={month} 
                onChange={e => setMonth(e.target.value)}
                className="outline-none bg-transparent text-sm font-semibold text-slate-700"
              >
                {[...Array(12)].map((_, i) => (
                  <option key={i+1} value={i+1}>Tháng {i+1}</option>
                ))}
              </select>
            </div>
            
            <div className="bg-white border border-slate-300 rounded-xl px-3 py-2">
              <select 
                value={year} 
                onChange={e => setYear(e.target.value)}
                className="outline-none bg-transparent text-sm font-semibold text-slate-700"
              >
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-12"><Loading fullscreen={false} /></div>
        ) : filteredData.length === 0 ? (
          <EmptyState icon={ClipboardList} title="Không có dữ liệu" description="Không tìm thấy lịch sử cứu hộ nào trong khoảng thời gian này." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Mã đơn</th>
                  <th className="px-6 py-4">Khách hàng</th>
                  <th className="px-6 py-4">Dịch vụ</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4">Ngày cập nhật</th>
                  <th className="px-6 py-4 text-right">Chi phí</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800">#{row.id}</td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">{row.tenKhachHang}</p>
                      <p className="text-xs text-slate-500">{row.soDienThoai}</p>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">{row.tenDichVu}</td>
                    <td className="px-6 py-4">{getStatusBadge(row.trangThaiHienTai)}</td>
                    <td className="px-6 py-4 text-slate-600">
                      {row.ngayHoanThanh ? new Date(row.ngayHoanThanh).toLocaleDateString('vi-VN') : new Date(row.ngayTao).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800 text-right">
                      {row.chiPhiThucTe ? formatMoney(row.chiPhiThucTe) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default History;
