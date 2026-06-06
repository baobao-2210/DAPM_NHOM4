import { useState, useEffect } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Tabs from '../../components/ui/Tabs';
import Textarea from '../../components/ui/Textarea';
import EmptyState from '../../components/ui/EmptyState';
import Skeleton from '../../components/ui/Skeleton';
import { Star, MessageSquare, CheckCircle2, AlertCircle } from 'lucide-react';
import { customerApi } from '../../api/customerApi';
import toast from 'react-hot-toast';

const Reviews = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [ratingState, setRatingState] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    customerApi.getRequests()
      .then(res => {
        const data = res.data?.data || res.data || [];
        // Only consider completed requests for review
        setRequests(data.filter(r => r.status === 'completed'));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const handleReviewChange = (reqId, field, value) => {
    setRatingState(prev => ({
      ...prev,
      [reqId]: {
        ...prev[reqId],
        [field]: value
      }
    }));
  };

  const submitReview = async (reqId) => {
    const data = ratingState[reqId];
    if (!data?.rating) {
      toast.error('Vui lòng chọn số sao đánh giá');
      return;
    }

    try {
      await customerApi.reviewRequest(reqId, { rating: data.rating, comment: data.comment || '' });
      toast.success('Gửi đánh giá thành công!');
      fetchData();
    } catch (err) {
      if (!err.response) {
        toast.success('Gửi đánh giá thành công! (Demo)');
        setRequests(requests.map(r => r._id === reqId ? { ...r, isReviewed: true } : r));
      } else {
        toast.error(err.response?.data?.message || 'Gửi đánh giá thất bại');
      }
    }
  };

  const pendingReviews = requests.filter(r => !r.isReviewed);
  const reviewedHistory = requests.filter(r => r.isReviewed);

  const tabs = [
    { value: 'pending', label: 'Chờ đánh giá', count: pendingReviews.length },
    { value: 'history', label: 'Lịch sử đánh giá', count: reviewedHistory.length },
  ];

  const displayList = activeTab === 'pending' ? pendingReviews : reviewedHistory;

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Đánh giá dịch vụ"
        description="Chia sẻ trải nghiệm của bạn để chúng tôi cải thiện chất lượng dịch vụ."
      />

      <div className="mb-6 overflow-x-auto">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <Skeleton key={i} variant="card" className="h-40" />)}
        </div>
      ) : displayList.length === 0 ? (
        <Card>
          <EmptyState
            icon={Star}
            title="Không có yêu cầu đánh giá"
            description={activeTab === 'pending' ? 'Bạn không có đơn nào đang chờ đánh giá.' : 'Bạn chưa có lịch sử đánh giá nào.'}
          />
        </Card>
      ) : (
        <div className="space-y-6">
          {displayList.map(req => {
            const currentRating = ratingState[req._id]?.rating || 0;
            const currentComment = ratingState[req._id]?.comment || '';

            return (
              <Card key={req._id}>
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Info */}
                  <div className="flex-1 border-b md:border-b-0 md:border-r border-[#E2E8F0] pb-4 md:pb-0 md:pr-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="success">Hoàn thành</Badge>
                      <span className="text-xs text-[#64748B] font-medium">{new Date(req.date).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <h3 className="font-bold text-[#0F172A] text-lg mb-1">{req.service || 'Dịch vụ cứu hộ'}</h3>
                    <p className="text-sm text-[#64748B] mb-3">Mã đơn: #{req._id}</p>
                    {req.staff && (
                      <p className="text-sm font-medium text-[#0F172A]">Nhân viên: {req.staff}</p>
                    )}
                  </div>

                  {/* Review Action / Display */}
                  <div className="flex-1 md:max-w-md">
                    {activeTab === 'pending' ? (
                      <div>
                        <h4 className="text-sm font-bold text-[#0F172A] mb-3">Đánh giá của bạn</h4>
                        <div className="flex gap-2 mb-4">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => handleReviewChange(req._id, 'rating', star)}
                              className={`p-1.5 rounded-lg transition-colors ${currentRating >= star ? 'text-[#F59E0B]' : 'text-[#CBD5E1] hover:text-[#F59E0B]/50'}`}
                            >
                              <Star className="w-8 h-8 fill-current" />
                            </button>
                          ))}
                        </div>
                        <Textarea
                          placeholder="Chia sẻ thêm về trải nghiệm của bạn (tùy chọn)..."
                          rows={2}
                          value={currentComment}
                          onChange={(e) => handleReviewChange(req._id, 'comment', e.target.value)}
                          className="mb-4"
                        />
                        <Button 
                          variant="primary" 
                          onClick={() => submitReview(req._id)}
                          disabled={!currentRating}
                        >
                          Gửi đánh giá
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 h-full">
                        <div className="w-12 h-12 rounded-full bg-[#F0FDF4] flex items-center justify-center">
                          <CheckCircle2 className="w-6 h-6 text-[#22C55E]" />
                        </div>
                        <div>
                          <p className="font-bold text-[#0F172A]">Đã gửi đánh giá</p>
                          <p className="text-sm text-[#64748B]">Cảm ơn bạn đã đóng góp ý kiến!</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Reviews;
