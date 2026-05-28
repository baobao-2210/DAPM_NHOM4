import { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import toast from 'react-hot-toast';
import Modal from '../../components/Modal';
import Loading from '../../components/Loading';
import PageHeader from '../../components/ui/PageHeader';
import SearchBox from '../../components/ui/SearchBox';
import Tabs from '../../components/ui/Tabs';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import { ClipboardList, MapPin, CheckCircle, UserCog } from 'lucide-react';

const statusBadgeVariant = {
  Pending: 'warning',
  Assigned: 'primary',
  OnGoing: 'info',
  Completed: 'success',
};

const statusLabel = {
  Pending: 'Chờ xử lý',
  Assigned: 'Đã phân công',
  OnGoing: 'Đang xử lý',
  Completed: 'Hoàn thành',
};

const ManageRequests = () => {
  const [requests, setRequests] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [assignModal, setAssignModal] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [assigning, setAssigning] = useState(false);

  const fetch = () => {
    Promise.all([
      adminApi.getRequests(),
      adminApi.getStaff(),
    ]).then(([r, s]) => {
      setRequests(r.data?.data || r.data || []);
      setStaff(s.data?.data || s.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(fetch, []);

  const filtered = requests.filter(r => {
    const matchSearch = (r.customer?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.service?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.address || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedStaff) { toast.error('Chọn nhân viên'); return; }
    setAssigning(true);
    try {
      await adminApi.assignRequest(assignModal._id, { staffId: selectedStaff });
      toast.success('Phân công nhân viên thành công!');
      setAssignModal(null);
      setSelectedStaff('');
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Phân công thất bại');
    } finally {
      setAssigning(false);
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleString('vi-VN') : '—';

  const tabItems = [
    { value: 'all', label: 'Tất cả', count: requests.length },
    { value: 'Pending', label: 'Chờ xử lý', count: requests.filter(r => r.status === 'Pending').length },
    { value: 'Assigned', label: 'Đã phân công', count: requests.filter(r => r.status === 'Assigned').length },
    { value: 'OnGoing', label: 'Đang xử lý', count: requests.filter(r => r.status === 'OnGoing').length },
    { value: 'Completed', label: 'Hoàn thành', count: requests.filter(r => r.status === 'Completed').length },
  ];

  return (
    <div>
      <PageHeader
        title="Quản lý đơn cứu hộ"
        description={`${requests.length} yêu cầu cứu hộ trong hệ thống`}
      />

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBox
            value={search}
            onChange={setSearch}
            placeholder="Tìm theo khách hàng, dịch vụ, địa chỉ..."
          />
        </div>
      </div>

      <div className="mb-6">
        <Tabs
          tabs={tabItems}
          activeTab={filterStatus}
          onChange={setFilterStatus}
        />
      </div>

      {loading ? <Loading fullscreen={false} /> : (
        <Table>
          <Table.Head>
            <Table.Row hoverable={false}>
              <Table.HeadCell>Khách hàng & Dịch vụ</Table.HeadCell>
              <Table.HeadCell className="hidden lg:table-cell">Địa chỉ</Table.HeadCell>
              <Table.HeadCell className="hidden md:table-cell">Trạng thái</Table.HeadCell>
              <Table.HeadCell className="hidden xl:table-cell">Nhân viên</Table.HeadCell>
              <Table.HeadCell align="right">Thao tác</Table.HeadCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <EmptyState
                    icon={ClipboardList}
                    title="Không có đơn nào"
                    description="Không tìm thấy đơn cứu hộ phù hợp với bộ lọc"
                  />
                </td>
              </tr>
            ) : filtered.map(req => {
              const variant = statusBadgeVariant[req.status] || 'default';
              const label = statusLabel[req.status] || req.status;
              return (
                <Table.Row key={req._id}>
                  <Table.Cell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center text-lg flex-shrink-0">🚗</div>
                      <div>
                        <p className="text-sm font-semibold text-[#0F172A]">{req.service?.name || 'Cứu hộ xe'}</p>
                        <p className="text-xs text-[#64748B] mt-0.5">{req.customer?.name || 'Khách hàng'}</p>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="hidden lg:table-cell">
                    <div className="flex items-center gap-1.5 text-sm text-[#64748B] max-w-xs">
                      <MapPin className="w-3.5 h-3.5 text-[#FBBF24] flex-shrink-0" />
                      <span className="truncate">{req.address || '—'}</span>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="hidden md:table-cell">
                    <Badge variant={variant} size="sm" dot>{label}</Badge>
                  </Table.Cell>
                  <Table.Cell className="hidden xl:table-cell">
                    <span className="text-sm text-[#0F172A]">
                      {req.staff?.name || (
                        <span className="text-[#94A3B8] italic text-xs bg-[#F8FAFC] px-2 py-0.5 rounded-md border border-[#E2E8F0]">
                          Chưa phân công
                        </span>
                      )}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-2 justify-end">
                      {req.status === 'Pending' && (
                        <Button
                          variant="primary"
                          size="sm"
                          icon={UserCog}
                          onClick={() => { setAssignModal(req); setSelectedStaff(req.staff?._id || ''); }}
                        >
                          Phân công
                        </Button>
                      )}
                      {(req.status === 'Assigned' || req.status === 'OnGoing') && (
                        <Button
                          variant="outline"
                          size="sm"
                          icon={UserCog}
                          onClick={() => { setAssignModal(req); setSelectedStaff(req.staff?._id || ''); }}
                        >
                          Đổi NV
                        </Button>
                      )}
                    </div>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      )}

      {/* Assign Staff Modal */}
      <Modal isOpen={!!assignModal} onClose={() => { setAssignModal(null); setSelectedStaff(''); }} title="Phân công nhân viên">
        {assignModal && (
          <form onSubmit={handleAssign} className="space-y-5">
            <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
              <p className="text-xs text-[#64748B] font-medium mb-1">Đơn cứu hộ:</p>
              <p className="text-[#0F172A] font-bold">{assignModal.service?.name || 'Cứu hộ xe'}</p>
              <div className="flex items-center gap-2 mt-2 text-xs text-[#64748B]">
                <span className="bg-white px-2 py-0.5 rounded border border-[#E2E8F0]">{assignModal.customer?.name}</span>
                <span>•</span>
                <span className="truncate flex-1">{assignModal.address}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-3">
                Chọn nhân viên <span className="text-[#EF4444]">*</span>
              </label>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
                {staff.map(s => (
                  <label
                    key={s._id}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedStaff === s._id
                        ? 'border-[#1D4ED8] bg-[#EFF6FF]'
                        : 'border-[#E2E8F0] bg-white hover:border-[#1D4ED8]/30'
                    }`}
                  >
                    <input
                      type="radio"
                      name="staff"
                      value={s._id}
                      checked={selectedStaff === s._id}
                      onChange={e => setSelectedStaff(e.target.value)}
                      className="hidden"
                    />
                    <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
                      <span className="text-[#1D4ED8] text-sm font-bold">{s.name?.[0]?.toUpperCase()}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#0F172A]">{s.name}</p>
                      <p className="text-xs text-[#64748B] mt-0.5">{s.specialization || 'Tổng hợp'}</p>
                    </div>
                    {selectedStaff === s._id && (
                      <div className="w-6 h-6 rounded-full bg-[#1D4ED8] text-white flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-[#E2E8F0]">
              <Button type="submit" variant="primary" fullWidth loading={assigning}>
                Xác nhận phân công
              </Button>
              <Button type="button" variant="outline" onClick={() => { setAssignModal(null); setSelectedStaff(''); }}>
                Hủy
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default ManageRequests;
