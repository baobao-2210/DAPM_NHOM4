import { useState } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import { AlertTriangle, Plus, X, UploadCloud } from 'lucide-react';
import toast from 'react-hot-toast';
import { customerApi } from '../../api/customerApi';

const MOCK_COMPLAINTS = [
  {
    id: 'CMP-101',
    requestId: 'REQ-1234',
    title: 'Nhân viên đến muộn 30 phút',
    description: 'Nhân viên A hẹn 15p nhưng 45p mới tới, thái độ không tốt.',
    status: 'pending',
    date: '25/05/2026',
    image: null,
  },
  {
    id: 'CMP-100',
    requestId: 'REQ-1200',
    title: 'Phí dịch vụ thu cao hơn báo giá',
    description: 'Trên app báo 200k nhưng nhân viên thu 250k.',
    status: 'resolved',
    date: '20/05/2026',
    image: null,
  },
];

const COMPLAINT_STATUS = {
  pending: { label: 'Chờ xử lý', variant: 'warning' },
  processing: { label: 'Đang giải quyết', variant: 'primary' },
  resolved: { label: 'Đã giải quyết', variant: 'success' },
};

const Complaints = () => {
  const [complaints, setComplaints] = useState(MOCK_COMPLAINTS);
  const [isCreating, setIsCreating] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    requestId: '',
    title: '',
    description: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      let reqIdNumeric = undefined;
      if (formData.requestId) {
        reqIdNumeric = parseInt(formData.requestId.replace('REQ-', ''));
        if (isNaN(reqIdNumeric)) {
          toast.error('Mã đơn không hợp lệ');
          return;
        }
      }

      await customerApi.submitComplaint({
        requestId: reqIdNumeric || 0, // 0 if no specific request
        type: formData.title,
        reason: formData.description,
      });

      const newComplaint = {
        id: `CMP-${Math.floor(Math.random() * 1000) + 200}`,
        ...formData,
        status: 'pending',
        date: new Date().toLocaleDateString('vi-VN'),
        image: null,
      };

      setComplaints([newComplaint, ...complaints]);
      toast.success('Gửi khiếu nại thành công! Chúng tôi sẽ xử lý sớm nhất.');
      setIsCreating(false);
      setFormData({ requestId: '', title: '', description: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gửi khiếu nại thất bại');
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title="Trung tâm khiếu nại"
        description="Gửi khiếu nại về chất lượng dịch vụ hoặc thái độ nhân viên để chúng tôi hỗ trợ bạn."
        actions={
          <Button onClick={() => setIsCreating(!isCreating)} icon={isCreating ? X : Plus}>
            {isCreating ? 'Hủy' : 'Tạo khiếu nại mới'}
          </Button>
        }
      />

      {isCreating && (
        <Card padding={true} className="mb-8 border-[#1D4ED8]/20 bg-[#F8FAFC] animate-[fadeIn_0.3s_ease-out]">
          <h3 className="text-lg font-bold text-[#0F172A] mb-4">Gửi khiếu nại mới</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Chọn đơn cứu hộ (Tùy chọn)"
                value={formData.requestId}
                onChange={(e) => setFormData({ ...formData, requestId: e.target.value })}
                options={[
                  { value: '', label: '-- Chọn đơn cứu hộ liên quan --' },
                  { value: 'REQ-1234', label: 'REQ-1234 - Kéo xe cứu hộ (25/05)' },
                  { value: 'REQ-1235', label: 'REQ-1235 - Kích bình (24/05)' },
                ]}
              />
              <Input
                label="Tiêu đề khiếu nại *"
                placeholder="Vd: Phí dịch vụ sai, nhân viên đến muộn..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            
            <Textarea
              label="Mô tả chi tiết *"
              placeholder="Vui lòng mô tả chi tiết sự việc để chúng tôi có thể giải quyết nhanh nhất..."
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />

            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                Ảnh minh chứng (nếu có)
              </label>
              <div className="border-2 border-dashed border-[#CBD5E1] rounded-xl p-8 text-center hover:bg-[#F1F5F9] hover:border-[#94A3B8] transition-colors cursor-pointer">
                <UploadCloud className="w-8 h-8 text-[#94A3B8] mx-auto mb-2" />
                <p className="text-sm text-[#64748B]">Kéo thả ảnh hoặc click để chọn file</p>
                <p className="text-xs text-[#94A3B8] mt-1">PNG, JPG tối đa 5MB</p>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit">Gửi khiếu nại</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {complaints.map(complaint => (
          <Card key={complaint.id} padding={true} className="border-[#E2E8F0]">
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-[#EF4444] flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#0F172A] text-lg">{complaint.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-[#64748B] mt-1 font-medium">
                    <span>Mã: {complaint.id}</span>
                    <span>•</span>
                    <span>{complaint.date}</span>
                    {complaint.requestId && (
                      <>
                        <span>•</span>
                        <span>Đơn: {complaint.requestId}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="shrink-0">
                <Badge variant={COMPLAINT_STATUS[complaint.status].variant}>
                  {COMPLAINT_STATUS[complaint.status].label}
                </Badge>
              </div>
            </div>
            
            <div className="bg-[#F8FAFC] p-4 rounded-xl text-[#334155] text-sm border border-[#F1F5F9] ml-0 sm:ml-13">
              <p>{complaint.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Complaints;
