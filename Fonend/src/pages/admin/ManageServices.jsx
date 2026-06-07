import { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import toast from 'react-hot-toast';
import Modal from '../../components/Modal';
import Loading from '../../components/Loading';
import PageHeader from '../../components/ui/PageHeader';
import SearchBox from '../../components/ui/SearchBox';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import { Layers, Plus, Edit3, Trash2 } from 'lucide-react';

const EMPTY_FORM = { name: '', description: '', price: '', category: '', icon: '🔧' };
const ICONS = ['🔧', '🚛', '🔋', '🛞', '⛽', '🔑', '🚗', '🛠️', '⚡'];

const getServiceImage = (name) => {
  if (!name) return '/images/services/service_sua_xe_tai_cho.png';
  const n = name.toLowerCase();
  if (n.includes('kích bình') && n.includes('xe máy')) return '/images/services/service_kich_binh_xe_may.png';
  if (n.includes('kích bình') && n.includes('ô tô')) return '/images/services/service_kich_binh_oto.png';
  if (n.includes('kích bình')) return '/images/services/service_kich_binh_oto.png';
  if (n.includes('vá lốp')) return '/images/services/service_va_lop_xe_may.png';
  if (n.includes('kéo xe') && n.includes('ô tô')) return '/images/services/service_keo_xe_oto.png';
  if (n.includes('kéo xe') && n.includes('tải')) return '/images/services/service_keo_xe_tai.png';
  if (n.includes('kéo xe')) return '/images/services/service_keo_xe_oto.png';
  if (n.includes('thay khóa') || n.includes('mở khóa')) return '/images/services/service_mo_khoa_oto.png';
  if (n.includes('tiếp nhiên liệu')) return '/images/services/service_tiep_nhien_lieu.png';
  if (n.includes('thay lốp')) return '/images/services/service_thay_lop_oto.png';
  if (n.includes('sửa xe') || n.includes('cơ khí')) return '/images/services/service_sua_xe_tai_cho.png';
  return '/images/services/service_sua_xe_tai_cho.png'; // default
};

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetch = () => {
    adminApi.getServices()
      .then(res => setServices(res.data?.data || res.data || []))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  };
  useEffect(fetch, []);

  const filtered = services.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.category?.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => { setForm(EMPTY_FORM); setSelected(null); setModal('create'); };
  const openEdit = (s) => { setSelected(s); setForm({ name: s.name || '', description: s.description || '', price: s.price || '', category: s.category || '', icon: s.icon || '🔧' }); setModal('edit'); };
  const closeModal = () => { setModal(null); setSelected(null); };
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name) { toast.error('Nhập tên dịch vụ'); return; }
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price) || 0 };
      if (modal === 'create') {
        await adminApi.createService(payload);
        toast.success('Thêm dịch vụ thành công!');
      } else {
        await adminApi.updateService(selected._id, payload);
        toast.success('Cập nhật dịch vụ thành công!');
      }
      closeModal(); fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Thao tác thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Xóa dịch vụ này?')) return;
    try {
      await adminApi.deleteService(id);
      toast.success('Đã xóa dịch vụ');
      fetch();
    } catch { toast.error('Xóa thất bại'); }
  };

  return (
    <div>
      <PageHeader
        title="Quản lý dịch vụ"
        description={`${services.length} dịch vụ đang cung cấp`}
        actions={
          <Button variant="primary" size="md" icon={Plus} onClick={openCreate}>
            Thêm dịch vụ
          </Button>
        }
      />

      {/* Search */}
      <div className="mb-8">
        <SearchBox
          value={search}
          onChange={setSearch}
          placeholder="Tìm theo tên hoặc danh mục..."
        />
      </div>

      {loading ? <Loading fullscreen={false} /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.length === 0 ? (
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <Card variant="default">
                <EmptyState
                  icon={Layers}
                  title="Không có dịch vụ nào"
                  description="Thử tìm kiếm với từ khóa khác hoặc thêm dịch vụ mới"
                  actionLabel="Thêm dịch vụ"
                  onAction={openCreate}
                />
              </Card>
            </div>
          ) : filtered.map(s => (
            <div key={s._id} className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col group overflow-hidden relative">
              {/* Image Cover */}
              <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                <img 
                  src={getServiceImage(s.name)} 
                  alt={s.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = 'https://placehold.co/400x300/1D4ED8/FFFFFF/png?text=RescueCar';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/30 to-transparent transition-opacity duration-300" />
                
                {s.category && (
                  <span className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-md text-[#1D4ED8] text-[10px] font-extrabold uppercase tracking-wider rounded-full shadow-lg">
                    {s.category}
                  </span>
                )}
                
                {/* Admin Actions */}
                <div className="absolute top-4 left-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button onClick={() => openEdit(s)} className="w-8 h-8 bg-white/90 text-[#1D4ED8] rounded-full flex items-center justify-center hover:bg-[#1D4ED8] hover:text-white transition-colors shadow-md backdrop-blur-md">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(s._id)} className="w-8 h-8 bg-white/90 text-[#EF4444] rounded-full flex items-center justify-center hover:bg-[#EF4444] hover:text-white transition-colors shadow-md backdrop-blur-md">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="absolute bottom-4 left-5 right-5">
                  <h3 className="text-xl font-bold text-white drop-shadow-md leading-tight">{s.name}</h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-grow">
                <p className="text-[#64748B] text-sm leading-relaxed mb-4 flex-grow line-clamp-2">
                  {s.description}
                </p>
                <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                  <span className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider">Mức giá</span>
                  <p className="text-[#FBBF24] font-black text-lg">
                    {s.price ? s.price.toLocaleString('vi-VN') + 'đ' : 'Liên hệ'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={!!modal} onClose={closeModal} title={modal === 'create' ? 'Thêm dịch vụ' : 'Chỉnh sửa dịch vụ'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-2">Icon dịch vụ</label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map(icon => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setForm(p => ({ ...p, icon }))}
                  className={`w-11 h-11 text-xl rounded-xl flex items-center justify-center transition-all ${
                    form.icon === icon
                      ? 'bg-[#EFF6FF] border-2 border-[#1D4ED8]'
                      : 'bg-white border-2 border-[#E2E8F0] hover:border-[#1D4ED8]/50'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
          <Input
            label="Tên dịch vụ"
            required
            type="text"
            value={form.name}
            onChange={set('name')}
            placeholder="Kéo xe, Thay lốp..."
          />
          <Textarea
            label="Mô tả"
            rows={3}
            value={form.description}
            onChange={set('description')}
            placeholder="Mô tả chi tiết dịch vụ..."
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Giá (VNĐ)"
              type="number"
              value={form.price}
              onChange={set('price')}
              placeholder="250000"
            />
            <Input
              label="Danh mục"
              type="text"
              value={form.category}
              onChange={set('category')}
              placeholder="Khẩn cấp, Cơ khí..."
            />
          </div>
          <div className="flex gap-3 pt-4 border-t border-[#E2E8F0]">
            <Button type="submit" variant="primary" fullWidth loading={saving}>
              {modal === 'create' ? 'Thêm dịch vụ' : 'Lưu thay đổi'}
            </Button>
            <Button type="button" variant="outline" onClick={closeModal}>
              Hủy
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageServices;
