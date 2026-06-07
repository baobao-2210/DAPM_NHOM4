import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import toast from 'react-hot-toast';
import Modal from '../../components/Modal';
import Input from '../../components/ui/Input';
import Loading from '../../components/Loading';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Select from '../../components/ui/Select';
import { Map, Plus, ChevronRight, ChevronDown, Pencil, Trash2 } from 'lucide-react';

const ManageAreas = () => {
  const [areas, setAreas] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState([]);
  const [modal, setModal] = useState(null);
  const [selectedCity, setSelectedCity] = useState(1);
  const [form, setForm] = useState({ name: '', code: '' });
  const [selectedArea, setSelectedArea] = useState(null);

  const fetchAreas = () => {
    Promise.all([adminApi.getCities(), adminApi.getAreas()])
      .then(([citiesRes, areasRes]) => {
        const citiesData = citiesRes.data?.data || [];
        setCities(citiesData);
        
        const data = areasRes.data?.data || [];
        
        // Initialize grouped with all cities
        const grouped = {};
        citiesData.forEach(c => {
          grouped[c.id] = { id: c.id, name: c.name, children: [] };
        });
        
        // Add areas to their respective cities
        data.forEach(curr => {
          if (grouped[curr.cityId]) {
            grouped[curr.cityId].children.push(curr);
          } else {
            grouped[curr.cityId] = { id: curr.cityId, name: curr.city, children: [curr] };
          }
        });
        
        const sortedAreas = Object.values(grouped);
        
        setAreas(sortedAreas);
        if (expandedNodes.length === 0 && sortedAreas.length > 0) {
          setExpandedNodes([sortedAreas[0].id]);
        }
      })
      .catch((err) => {
        console.error("fetchAreas error:", err);
        toast.error('Lỗi tải danh sách khu vực');
      })
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

  const openCreateCity = () => {
    setForm({ name: '', code: '' });
    setModal('createCity');
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
      if (modal === 'createCity') {
        await adminApi.createCity({ name: form.name });
        toast.success('Thêm tỉnh thành thành công');
      } else if (modal === 'create') {
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
          <div className="flex gap-2">
            <Button variant="outline" onClick={openCreateCity}>Thêm Tỉnh/Thành</Button>
            <Button icon={Plus} onClick={() => openCreate(cities.length > 0 ? cities[0].id : 1)}>Thêm khu vực mới</Button>
          </div>
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

      <Modal isOpen={!!modal} onClose={() => setModal(null)} title={modal === 'createCity' ? 'Thêm Tỉnh/Thành phố' : modal === 'create' ? 'Thêm khu vực (Phường/Xã)' : 'Sửa khu vực'}>
        <form onSubmit={handleSave} className="space-y-4">
          {modal !== 'createCity' && (
            <div className="space-y-1">
              <label className="text-sm font-semibold text-[#0F172A]">Tỉnh / Thành phố</label>
              <Select 
                value={selectedCity} 
                onChange={e => setSelectedCity(Number(e.target.value))}
                disabled={modal === 'edit'}
                options={cities.map(city => ({ value: city.id, label: city.name }))}
              />
            </div>
          )}
          {modal !== 'createCity' && (
            <Input label="Mã khu vực" value={form.code} onChange={e => setForm({...form, code: e.target.value})} placeholder="VD: PX-01" />
          )}
          <Input label={modal === 'createCity' ? 'Tên Tỉnh/Thành phố' : 'Tên khu vực (Phường/Xã)'} required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder={modal === 'createCity' ? "VD: Cần Thơ" : "VD: Phường Bến Nghé"} />
          <div className="flex gap-3 pt-4">
            <Button type="submit" variant="primary" fullWidth>Lưu</Button>
            <Button type="button" variant="outline" onClick={() => setModal(null)}>Hủy</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

// ErrorBoundary

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught error:", error, info);
    this.setState({ info });
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 text-red-500">
          <h1 className="text-2xl font-bold mb-4">React Crashed!</h1>
          <p className="font-bold">Error:</p>
          <pre className="bg-red-50 p-4 rounded overflow-auto">{this.state.error?.toString()}</pre>
          <p className="font-bold mt-4">Component Stack:</p>
          <pre className="bg-red-50 p-4 rounded overflow-auto">{this.state.info?.componentStack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const ManageAreasWrapper = () => (
  <ErrorBoundary>
    <ManageAreas />
  </ErrorBoundary>
);

export default ManageAreasWrapper;
