import { useState } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import StarRating from '../../components/ui/StarRating';
import Textarea from '../../components/ui/Textarea';
import Badge from '../../components/ui/Badge';
import { Star, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { customerApi } from '../../api/customerApi';

const MOCK_REVIEWS = [
  {
    id: 1,
    requestId: 'REQ-1234',
    serviceName: 'Kéo xe cứu hộ',
    staffName: 'Nguyễn Văn A',
    date: '24/05/2026',
    rating: 5,
    comment: 'Nhân viên đến rất nhanh, nhiệt tình và chuyên nghiệp. Cảm ơn RescueCar!',
    status: 'reviewed',
  },
  {
    id: 2,
    requestId: 'REQ-1235',
    serviceName: 'Kích bình ắc quy',
    staffName: 'Trần Văn B',
    date: '25/05/2026',
    rating: 0,
    comment: '',
    status: 'pending',
  },
];

const Reviews = () => {
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'reviewed'

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submittingId, setSubmittingId] = useState(null);

  const pendingReviews = reviews.filter((r) => r.status === 'pending');
  const completedReviews = reviews.filter((r) => r.status === 'reviewed');

  const handleSubmitReview = async (review) => {
    if (rating === 0) {
      toast.error('Vui lòng chọn số sao đánh giá');
      return;
    }
    
    try {
      const numericId = parseInt(review.requestId.replace('REQ-', ''));
      if (isNaN(numericId)) {
        toast.error('Mã đơn không hợp lệ trong dữ liệu mẫu');
        return;
      }

      await customerApi.reviewRequest(numericId, { rating, comment });
      
      setReviews(
        reviews.map((r) =>
          r.id === review.id
            ? { ...r, status: 'reviewed', rating, comment, date: new Date().toLocaleDateString('vi-VN') }
            : r
        )
      );
      
      toast.success('Gửi đánh giá thành công! Cảm ơn bạn.');
      setRating(0);
      setComment('');
      setSubmittingId(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gửi đánh giá thất bại');
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title="Đánh giá dịch vụ"
        description="Góp ý của bạn giúp chúng tôi cải thiện chất lượng phục vụ tốt hơn mỗi ngày."
      />

      <div className="flex gap-4 mb-6 border-b border-[#E2E8F0]">
        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-4 px-2 font-medium text-sm transition-colors relative ${
            activeTab === 'pending' ? 'text-[#1D4ED8]' : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          Chờ đánh giá ({pendingReviews.length})
          {activeTab === 'pending' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#1D4ED8] rounded-t-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('reviewed')}
          className={`pb-4 px-2 font-medium text-sm transition-colors relative ${
            activeTab === 'reviewed' ? 'text-[#1D4ED8]' : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          Đã đánh giá ({completedReviews.length})
          {activeTab === 'reviewed' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#1D4ED8] rounded-t-full" />
          )}
        </button>
      </div>

      <div className="space-y-6">
        {activeTab === 'pending' && (
          pendingReviews.length === 0 ? (
            <Card padding={true}>
              <EmptyState
                icon={Star}
                title="Không có đơn chờ đánh giá"
                description="Bạn đã đánh giá tất cả các đơn cứu hộ hoàn thành."
              />
            </Card>
          ) : (
            pendingReviews.map((review) => (
              <Card key={review.id} padding={true} className="border-[#1D4ED8]/20 bg-[#F8FAFC]">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Info */}
                  <div className="md:w-1/3 space-y-3">
                    <div>
                      <p className="text-xs text-[#64748B] uppercase font-bold tracking-wider mb-1">Mã đơn</p>
                      <p className="font-semibold text-[#0F172A]">{review.requestId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#64748B] uppercase font-bold tracking-wider mb-1">Dịch vụ</p>
                      <p className="font-medium text-[#0F172A]">{review.serviceName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#64748B] uppercase font-bold tracking-wider mb-1">Nhân viên thực hiện</p>
                      <p className="font-medium text-[#1D4ED8]">{review.staffName}</p>
                    </div>
                  </div>

                  {/* Form */}
                  <div className="md:w-2/3 bg-white p-6 rounded-xl border border-[#E2E8F0]">
                    <h4 className="font-bold text-[#0F172A] mb-4">Trải nghiệm của bạn như thế nào?</h4>
                    <div className="mb-6 flex justify-center py-4 bg-[#F8FAFC] rounded-xl border border-[#F1F5F9]">
                      <StarRating 
                        size="xl" 
                        value={submittingId === review.id ? rating : 0} 
                        onChange={(val) => { setRating(val); setSubmittingId(review.id); }} 
                      />
                    </div>
                    
                    {submittingId === review.id && rating > 0 && (
                      <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
                        <Textarea
                          placeholder="Chia sẻ thêm về trải nghiệm của bạn (không bắt buộc)..."
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          rows={3}
                        />
                        <div className="flex justify-end gap-3">
                          <Button variant="outline" onClick={() => { setSubmittingId(null); setRating(0); }}>
                            Hủy
                          </Button>
                          <Button onClick={() => handleSubmitReview(review)}>
                            Gửi đánh giá
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )
        )}

        {activeTab === 'reviewed' && (
          completedReviews.length === 0 ? (
            <Card padding={true}>
              <EmptyState
                icon={MessageSquare}
                title="Chưa có đánh giá nào"
                description="Bạn chưa thực hiện đánh giá cho đơn cứu hộ nào."
              />
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedReviews.map((review) => (
                <Card key={review.id} padding={true} className="flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <Badge variant="primary" className="mb-2">{review.serviceName}</Badge>
                      <p className="text-xs text-[#64748B]">{review.date}</p>
                    </div>
                    <StarRating value={review.rating} readOnly size="sm" />
                  </div>
                  
                  <p className="text-[#0F172A] text-sm flex-1 mb-4 italic">
                    "{review.comment || 'Không có nhận xét'}"
                  </p>

                  <div className="pt-4 border-t border-[#E2E8F0] mt-auto">
                    <p className="text-xs text-[#64748B]">
                      Nhân viên: <span className="font-semibold text-[#0F172A]">{review.staffName}</span>
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Reviews;
