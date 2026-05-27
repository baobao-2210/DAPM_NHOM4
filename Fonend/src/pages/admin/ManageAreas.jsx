import { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import toast from 'react-hot-toast';
import Modal from '../../components/Modal';
import Input from '../../components/ui/Input';
import Loading from '../../components/Loading';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { Map, Plus, ChevronRight, ChevronDown, Pencil, Trash2 } from 'lucide-react';

const ManageAreas = () => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState([]);
  const [modal, setModal] = useState(null);
  const [selectedCity, setSelectedCity] = useState(1);
  const [form, setForm] = useState({ name: '', code: '' });
  const [selectedArea, setSelectedArea] = useState(null);

  const fetchAreas = () => {
    adminApi.getAreas()
      .then(res => {
        const data = res.data?.data || [];
        // Group by city
        const grouped = data.reduce((acc, curr) => {
          const cityId = curr.cityId;
          if (!acc[cityId]) {
            acc[cityId] = { id: cityId, name: curr.city, children: [] };
          }
          acc[cityId].children.push(curr);
          return acc;
        }, {});
        setAreas(Object.values(grouped));
        if (expandedNodes.length === 0 && Object.keys(grouped).length > 0) {
          setExpandedNodes([Object.values(grouped)[0].id]);
        }
      })
      .catch(() => toast.error('Lỗi tải danh sách khu vực'))
      .finally(() => setLoading(false));
  };

  useEffect(fetchAreas, []);

  const toggleNode = (id) => {
    setExpandedNodes(prev => prev.includes(id) ? prev.filter(n => n !== id) : [...prev, id]);
  };

  const openCreate = (cityId) => {
    setSelectedCity(cityId);
    setForm({ name: '', code: '' });
    setSelectedArea(null);
    setModal('create');
  };

  const openEdit = (area) => {
    setSelectedCity(area.cityId);
    setForm({ name: area.name, code: area.code || '' });
    setSelectedArea(area);
    setModal('edit');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name) return toast.error('Vui lòng nhập tên khu vực');
    try {
      if (modal === 'create') {
        await adminApi.createArea({ ...form, cityId: selectedCity });
        toast.success('Thêm khu vực thành công');
      } else {
        await adminApi.updateArea(selectedArea._id, { ...form, cityId: selectedCity });
        toast.success('Cập nhật thành công');
      }
      setModal(null);
      fetchAreas();
    } catch {
      toast.error('Thao tác thất bại');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa khu vực này?')) return;
    try {
      await adminApi.deleteArea(id);
      toast.success('Xóa thành công');
      fetchAreas();
    } catch {
      toast.error('Xóa thất bại');
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title="Quản lý khu vực hoạt động"
        description="Thiết lập các tỉnh thành, quận huyện và phân bổ nhân sự cứu hộ."
        actions={
          <Button icon={Plus} onClick={() => openCreate(1)}>Thêm khu vực mới</Button>
        }
      />

      {loading ? <Loading fullscreen={false} /> : (
        <Card padding={true} className="border-[#E2E8F0]">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#E2E8F0]">
            <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
              <Map className="w-5 h-5 text-[#1D4ED8]" />
            </div>
            <div>
              <h3 className="font-bold text-[#0F172A]">Sơ đồ khu vực</h3>
              <p className="text-xs text-[#64748B]">Click vào tỉnh thành để xem chi tiết quận/huyện/phường/xã</p>
            </div>
          </div>

          <div className="space-y-3">
            {areas.map((province) => {
              const isExpanded = expandedNodes.includes(province.id);
              return (
                <div key={province.id} className="border border-[#E2E8F0] rounded-xl overflow-hidden">
                  <div 
                    className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${
                      isExpanded ? 'bg-[#F8FAFC]' : 'hover:bg-[#F8FAFC]'
                    }`}
                    onClick={() => toggleNode(province.id)}
                  >
                    <div className="flex items-center gap-3">
                      <button className="w-6 h-6 flex items-center justify-center text-[#94A3B8] hover:text-[#1D4ED8] transition-colors">
                        {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                      </button>
                      <span className="font-bold text-[#0F172A] text-base">{province.name}</span>
                      <Badge variant="primary" size="sm">Tỉnh / TP</Badge>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right hidden sm:block">
                        <p className="text-xs text-[#64748B] font-semibold uppercase mb-0.5">Khu vực con</p>
                        <p className="font-bold text-[#1D4ED8]">{province.children.length}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={(e) => { e.stopPropagation(); openCreate(province.id); }} className="p-2 text-[#94A3B8] hover:text-[#1D4ED8] hover:bg-[#EFF6FF] rounded-lg transition-colors" title="Thêm phường/xã">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="bg-white border-t border-[#E2E8F0]">
                      {province.children.map((district, idx) => (
                        <div 
                          key={district._id} 
                          className={`flex items-center justify-between p-4 pl-14 hover:bg-[#F8FAFC] transition-colors ${
                            idx !== province.children.length - 1 ? 'border-b border-[#F1F5F9]' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-[#334155]">{district.name}</span>
                            <Badge variant="outline" size="sm">Phường / Xã</Badge>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => openEdit(district)} className="p-1.5 text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#E2E8F0] rounded-lg transition-colors" title="Sửa">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(district._id)} className="p-1.5 text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#FEF2F2] rounded-lg transition-colors" title="Xóa">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <Modal isOpen={!!modal} onClose={() => setModal(null)} title={modal === 'create' ? 'Thêm khu vực' : 'Sửa khu vực'}>
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Mã khu vực" value={form.code} onChange={e => setForm({...form, code: e.target.value})} placeholder="PX-01" />
          <Input label="Tên khu vực (Phường/Xã)" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Phường Bến Nghé" />
          <div className="flex gap-3 pt-4">
            <Button type="submit" variant="primary" fullWidth>Lưu</Button>
            <Button type="button" variant="outline" onClick={() => setModal(null)}>Hủy</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageAreas;
