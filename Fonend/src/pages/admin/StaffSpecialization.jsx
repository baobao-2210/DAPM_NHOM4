import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { ChevronLeft, User, Wrench, Save, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const ALL_SPECIALIZATIONS = [
  { id: 's1', name: 'Kéo xe cứu hộ', description: 'Điều khiển xe cẩu, kéo xe ô tô bị hỏng nặng.' },
  { id: 's2', name: 'Kích bình ắc quy', description: 'Xử lý các xe bị chết máy do hết bình điện.' },
  { id: 's3', name: 'Vá lốp lưu động', description: 'Thay thế lốp sơ cua, vá lốp tận nơi.' },
  { id: 's4', name: 'Mở khóa xe', description: 'Hỗ trợ khách hàng để quên chìa khóa trong xe.' },
  { id: 's5', name: 'Tiếp nhiên liệu', description: 'Cung cấp xăng/dầu khẩn cấp cho xe hết giữa đường.' },
];

const StaffSpecialization = () => {
  const { id } = useParams();
  
  // Mock staff data
  const [staffName] = useState('Nguyễn Văn A');
  const [selectedSpecs, setSelectedSpecs] = useState(['s1', 's2']);
  const [isSaving, setIsSaving] = useState(false);

  const toggleSpecialization = (specId) => {
    if (selectedSpecs.includes(specId)) {
      setSelectedSpecs(selectedSpecs.filter(id => id !== specId));
    } else {
      setSelectedSpecs([...selectedSpecs, specId]);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      toast.success('Đã cập nhật chuyên môn nhân viên!');
      setIsSaving(false);
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Quản lý chuyên môn"
        description="Gán các dịch vụ cứu hộ mà nhân viên này có khả năng xử lý."
        backButton={
          <Link
            to="/admin/staff"
            className="flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#1D4ED8] font-medium transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Quay lại danh sách
          </Link>
        }
      />

      <Card padding={true} className="mb-6 border-[#E2E8F0]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#1D4ED8] flex items-center justify-center text-white font-bold text-xl shadow-md shadow-[#1D4ED8]/20">
            {staffName.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#0F172A]">{staffName}</h3>
            <p className="text-[#64748B] text-sm flex items-center gap-1">
              <User className="w-3.5 h-3.5" /> ID: {id}
            </p>
          </div>
        </div>
      </Card>

      <Card padding={true}>
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-[#1D4ED8]" />
            <h3 className="text-lg font-bold text-[#0F172A]">Danh sách dịch vụ</h3>
          </div>
          <Badge variant="primary">{selectedSpecs.length} đã chọn</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {ALL_SPECIALIZATIONS.map((spec) => {
            const isSelected = selectedSpecs.includes(spec.id);
            return (
              <div 
                key={spec.id}
                onClick={() => toggleSpecialization(spec.id)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-[#1D4ED8] bg-[#EFF6FF] shadow-sm' 
                    : 'border-[#E2E8F0] hover:border-[#CBD5E1] bg-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center shrink-0 border transition-colors ${
                    isSelected ? 'bg-[#1D4ED8] border-[#1D4ED8]' : 'border-[#CBD5E1] bg-white'
                  }`}>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <div>
                    <h4 className={`font-bold text-sm ${isSelected ? 'text-[#1D4ED8]' : 'text-[#0F172A]'}`}>
                      {spec.name}
                    </h4>
                    <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                      {spec.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end border-t border-[#E2E8F0] pt-6">
          <Button icon={Save} loading={isSaving} onClick={handleSave}>
            Lưu thay đổi
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default StaffSpecialization;
