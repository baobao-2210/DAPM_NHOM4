import { useState, useEffect } from 'react';
import { customerApi } from '../../api/customerApi';
import toast from 'react-hot-toast';
import Modal from '../../components/Modal';
import { Car, Plus, Edit3, Trash2 } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import EmptyState from '../../components/ui/EmptyState';
import Skeleton from '../../components/ui/Skeleton';

const EMPTY_FORM = { brand: '', model: '', year: '', licensePlate: '', color: '', type: 'Sedan' };
const VEHICLE_TYPES = ['Sedan', 'SUV', 'Truck', 'Motorcycle', 'Van', 'Minibus', 'Other'];
const carEmojis = { Sedan: '🚗', SUV: '🚙', Truck: '🚛', Motorcycle: '🏍️', Van: '🚐', Minibus: '🚌', Other: '🚘' };

const MyVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetch = () => {
    customerApi.getVehicles()
      .then(res => setVehicles(res.data?.data || res.data || []))
      .catch(() => setVehicles([]))
      .finally(() => setLoading(false));
  };
  useEffect(fetch, []);

  const openCreate = () => { setForm(EMPTY_FORM); setModal('create'); };
  const openEdit = (v) => { setSelected(v); setForm({ brand: v.brand, model: v.model, year: v.year, licensePlate: v.licensePlate, color: v.color || '', type: v.type || 'Sedan' }); setModal('edit'); };
  const closeModal = () => { setModal(null); setSelected(null); };
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.brand || !form.model || !form.licensePlate) { toast.error('Điền đầy đủ thông tin xe'); return; }
    setSaving(true);
    try {
      if (modal === 'create') {
        await customerApi.createVehicle(form);
        toast.success('Thêm xe thành công!');
      } else {
        await customerApi.updateVehicle(selected._id, form);
        toast.success('Cập nhật xe thành công!');
      }
      closeModal();
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Thao tác thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn chắc chắn muốn xóa xe này?')) return;
    try {
      await customerApi.deleteVehicle(id);
      toast.success('Đã xóa xe');
      fetch();
    } catch {
      toast.error('Xóa thất bại');
    }
  };

  return (
    <div>
      <PageHeader
        title="Quản lý xe"
        description="Quản lý danh sách xe đã đăng ký"
        actions={
          <Button variant="primary" size="lg" icon={Plus} onClick={openCreate}>
            Thêm xe
          </Button>
        }
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => <Skeleton key={i} variant="card" />)}
        </div>
      ) : vehicles.length === 0 ? (
        <Card>
          <EmptyState
            icon={Car}
            title="Bạn chưa đăng ký xe nào"
            description="Thêm xe để tạo yêu cầu cứu hộ nhanh hơn"
            actionLabel="Thêm xe đầu tiên"
            onAction={openCreate}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map(v => (
            <Card key={v._id} variant="interactive">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] flex items-center justify-center text-2xl">
                  {carEmojis[v.type] || '🚗'}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" icon={Edit3} onClick={() => openEdit(v)} />
                  <Button variant="ghost" size="sm" icon={Trash2} onClick={() => handleDelete(v._id)} className="hover:text-[#EF4444] hover:bg-[#FEF2F2]" />
                </div>
              </div>

              <h3 className="text-base font-bold text-[#0F172A] mb-3">{v.brand} {v.model}</h3>

              <div className="space-y-2.5 pt-3 border-t border-[#E2E8F0]">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#64748B]">Biển số</span>
                  <Badge variant="primary" size="sm">{v.licensePlate}</Badge>
                </div>
                {v.year && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#64748B]">Năm SX</span>
                    <span className="text-[#0F172A] font-semibold">{v.year}</span>
                  </div>
                )}
                {v.color && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#64748B]">Màu</span>
                    <span className="text-[#0F172A] font-semibold">{v.color}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#64748B]">Loại</span>
                  <Badge variant="default" size="sm">{v.type}</Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={!!modal} onClose={closeModal} title={modal === 'create' ? 'Thêm xe mới' : 'Chỉnh sửa xe'}>
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <Input
              label="Hãng xe"
              required
              type="text"
              value={form.brand}
              onChange={set('brand')}
              placeholder="Toyota, Honda..."
            />
            <Input
              label="Dòng xe"
              required
              type="text"
              value={form.model}
              onChange={set('model')}
              placeholder="Camry, Civic..."
            />
          </div>
          <Input
            label="Biển số xe"
            required
            type="text"
            value={form.licensePlate}
            onChange={set('licensePlate')}
            placeholder="51A-12345"
          />
          <div className="grid grid-cols-2 gap-5">
            <Input
              label="Năm sản xuất"
              type="number"
              value={form.year}
              onChange={set('year')}
              placeholder="2020"
              min="1990"
              max="2026"
            />
            <Input
              label="Màu xe"
              type="text"
              value={form.color}
              onChange={set('color')}
              placeholder="Trắng, Đen..."
            />
          </div>
          <Select
            label="Loại xe"
            value={form.type}
            onChange={set('type')}
            placeholder=""
            options={VEHICLE_TYPES.map(t => ({ value: t, label: t }))}
          />
          <div className="flex gap-3 pt-4 border-t border-[#E2E8F0]">
            <Button type="submit" variant="primary" size="lg" fullWidth loading={saving}>
              {modal === 'create' ? 'Thêm xe' : 'Lưu thay đổi'}
            </Button>
            <Button type="button" variant="outline" size="lg" onClick={closeModal}>
              Hủy
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MyVehicles;
