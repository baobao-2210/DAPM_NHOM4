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
import { Wrench, Plus, Edit3, Trash2 } from 'lucide-react';

const EMPTY_FORM = { name: '', description: '', price: '', category: '', icon: '🔧' };
const ICONS = ['🔧', '🚛', '🔋', '🛞', '⛽', '🔑', '🚗', '🛠️', '⚡'];

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
                  icon={Wrench}
                  title="Không có dịch vụ nào"
                  description="Thử tìm kiếm với từ khóa khác hoặc thêm dịch vụ mới"
                  actionLabel="Thêm dịch vụ"
                  onAction={openCreate}
                />
              </Card>
            </div>
          ) : filtered.map(s => (
            <Card key={s._id} variant="interactive" className="group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {s.icon || '🔧'}
                </div>
                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" icon={Edit3} onClick={() => openEdit(s)} />
                  <Button variant="ghost" size="sm" icon={Trash2} onClick={() => handleDelete(s._id)} className="hover:text-[#EF4444] hover:bg-[#FEF2F2]" />
                </div>
              </div>
              {s.category && (
                <Badge variant="primary" size="sm" className="mb-2">{s.category}</Badge>
              )}
              <h3 className="text-[#0F172A] font-bold text-base mb-1.5">{s.name}</h3>
              <p className="text-[#64748B] text-sm mb-4 line-clamp-2 leading-relaxed">{s.description}</p>
              <div className="pt-4 border-t border-[#E2E8F0]">
                <p className="text-[#FBBF24] font-bold text-base">
                  {s.price ? s.price.toLocaleString('vi-VN') + 'đ' : 'Liên hệ'}
                </p>
              </div>
            </Card>
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
