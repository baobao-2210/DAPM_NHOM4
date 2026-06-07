import { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import toast from 'react-hot-toast';
import Loading from '../../components/Loading';
import PageHeader from '../../components/ui/PageHeader';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import { Users, UserCog, Wrench, ClipboardList, Star, Trophy, AlertTriangle } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

// Remove static MOCK DATA constants

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

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getDashboardStats()
      .then(res => {
        const data = res.data?.data || res.data;
        // Transform data for charts
        if (data.monthlyRequestsData) {
          data.monthlyRequestsData = data.monthlyRequestsData.map(d => ({ name: `T${d.month || d.Month}`, requests: d.count || d.Count }));
        }
        if (data.monthlyRevenueData) {
          data.monthlyRevenueData = data.monthlyRevenueData.map(d => ({ name: `T${d.month || d.Month}`, revenue: d.revenue || d.Revenue }));
        }
        if (data.requestStatusData && !Array.isArray(data.requestStatusData)) {
          data.requestStatusData = [
            { name: 'Chờ xử lý', value: data.requestStatusData.pending || 0, color: '#FBBF24' },
            { name: 'Đang xử lý', value: data.requestStatusData.ongoing || 0, color: '#1D4ED8' },
            { name: 'Hoàn thành', value: data.requestStatusData.completed || 0, color: '#22C55E' }
          ];
        }
        setStats(data);
      })
      .catch((err) => {
        console.error(err);
        toast.error('Không thể tải dữ liệu thống kê');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading fullscreen={false} />;

  return (
    <div>
      <PageHeader
        title="Dashboard Quản trị"
        description="Tổng quan toàn hệ thống RescueCar"
      />

      {/* KPI StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Khách hàng"
          value={(stats?.totalCustomers || 0).toLocaleString()}
          icon={Users}
          iconBg="bg-[#EFF6FF]"
          iconColor="text-[#1D4ED8]"
          trend={12}
          trendLabel="Đã đăng ký"
        />
        <StatCard
          title="Nhân viên"
          value={(stats?.totalStaff || 0).toLocaleString()}
          icon={UserCog}
          iconBg="bg-[#EFF6FF]"
          iconColor="text-[#1D4ED8]"
          trend={5}
          trendLabel="Đang làm việc"
        />
        <StatCard
          title="Dịch vụ"
          value={(stats?.totalServices || 0).toLocaleString()}
          icon={Wrench}
          iconBg="bg-[#FFFBEB]"
          iconColor="text-[#FBBF24]"
          trend={2}
          trendLabel="Đang cung cấp"
        />
        <StatCard
          title="Yêu cầu"
          value={(stats?.totalRequests || 0).toLocaleString()}
          icon={ClipboardList}
          iconBg="bg-[#F0FDF4]"
          iconColor="text-[#22C55E]"
          trend={18}
          trendLabel="Tổng yêu cầu cứu hộ"
        />
        <StatCard
          title="Top dịch vụ"
          value="Kéo xe"
          icon={Star}
          iconBg="bg-blue-100"
          iconColor="text-[#1D4ED8]"
        />
        <StatCard
          title="Nhân viên XS"
          value="Nguyễn V. A"
          icon={Trophy}
          iconBg="bg-yellow-100"
          iconColor="text-[#F59E0B]"
        />
        <StatCard
          title="Khiếu nại mới"
          value="3"
          icon={AlertTriangle}
          iconBg="bg-red-100"
          iconColor="text-[#EF4444]"
          trend={1}
          trendUp={false}
          trendLabel="Tuần này"
        />
      </div>

      {/* Revenue Banner */}
      {stats?.revenue && (
      <Card variant="default" className="mb-8 bg-[#1D4ED8] border-[#1D4ED8] text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FBBF24]/10 rounded-full translate-y-1/2 -translate-x-1/4" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-blue-700 text-sm font-medium mb-1">
                  Doanh thu ước tính
              </p>

              <p className="text-3xl md:text-4xl font-bold text-blue-900">
              {stats.revenue.toLocaleString('vi-VN')}
                  <span className="text-blue-600 text-2xl ml-1">đ</span>
              </p>
            </div>
            <div className="text-5xl opacity-80">💰</div>
          </div>
        </Card>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Line Chart - Requests by month */}
        <Card variant="default" padding={false}>
          <Card.Header>
            <h3 className="text-sm font-bold text-[#0F172A]">Số lượng yêu cầu theo tháng</h3>
          </Card.Header>
          <Card.Body>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={stats?.monthlyRequestsData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={{ stroke: '#E2E8F0' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={{ stroke: '#E2E8F0' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    fontSize: '13px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="requests"
                  stroke="#1D4ED8"
                  strokeWidth={3}
                  dot={{ fill: '#1D4ED8', r: 5 }}
                  activeDot={{ r: 7, fill: '#1D4ED8' }}
                  name="Yêu cầu"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card.Body>
        </Card>

        {/* Bar Chart - Revenue by month */}
        <Card variant="default" padding={false}>
          <Card.Header>
            <h3 className="text-sm font-bold text-[#0F172A]">Doanh thu theo tháng</h3>
          </Card.Header>
          <Card.Body>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={stats?.monthlyRevenueData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={{ stroke: '#E2E8F0' }} />
                <YAxis
                  tick={{ fontSize: 12, fill: '#64748B' }}
                  axisLine={{ stroke: '#E2E8F0' }}
                  tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    fontSize: '13px',
                  }}
                  formatter={(value) => [`${value.toLocaleString('vi-VN')}đ`, 'Doanh thu']}
                />
                <Bar
                  dataKey="revenue"
                  fill="#FBBF24"
                  radius={[6, 6, 0, 0]}
                  name="Doanh thu"
                />
              </BarChart>
            </ResponsiveContainer>
          </Card.Body>
        </Card>
      </div>

      {/* Pie Chart + Request breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card variant="default" padding={false}>
          <Card.Header>
            <h3 className="text-sm font-bold text-[#0F172A]">Trạng thái yêu cầu</h3>
          </Card.Header>
          <Card.Body className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={stats?.requestStatusData || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {(stats?.requestStatusData || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    fontSize: '13px',
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '12px' }}
                  formatter={(value) => <span className="text-[#64748B]">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card.Body>
        </Card>

        {/* Request breakdown cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card variant="default" className="bg-[#FFFBEB] border-[#FBBF24]/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#FBBF24]/10 flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-[#FBBF24]" />
              </div>
            </div>
            <p className="text-2xl font-bold text-[#0F172A]">{stats?.pendingRequests || 0}</p>
            <p className="text-sm text-[#64748B]">Chờ xử lý</p>
          </Card>
          <Card variant="default" className="bg-[#EFF6FF] border-[#1D4ED8]/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#1D4ED8]/10 flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-[#1D4ED8]" />
              </div>
            </div>
            <p className="text-2xl font-bold text-[#0F172A]">{stats?.ongoingRequests || 0}</p>
            <p className="text-sm text-[#64748B]">Đang xử lý</p>
          </Card>
          <Card variant="default" className="bg-[#F0FDF4] border-[#22C55E]/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#22C55E]/10 flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-[#22C55E]" />
              </div>
            </div>
            <p className="text-2xl font-bold text-[#0F172A]">{stats?.completedRequests || 0}</p>
            <p className="text-sm text-[#64748B]">Hoàn thành</p>
          </Card>
        </div>
      </div>

      {/* Recent Requests Table */}
      {stats?.recentRequests?.length > 0 && (
        <Card variant="default" padding={false}>
          <Card.Header>
            <h3 className="text-sm font-bold text-[#0F172A]">Đơn cứu hộ gần đây</h3>
          </Card.Header>
          <Table>
            <Table.Head>
              <Table.Row hoverable={false}>
                <Table.HeadCell>Dịch vụ</Table.HeadCell>
                <Table.HeadCell>Khách hàng</Table.HeadCell>
                <Table.HeadCell>Địa chỉ</Table.HeadCell>
                <Table.HeadCell>Trạng thái</Table.HeadCell>
                <Table.HeadCell align="right">Ngày tạo</Table.HeadCell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {stats.recentRequests.slice(0, 5).map(req => (
                <Table.Row key={req._id}>
                  <Table.Cell>
                    <span className="font-semibold">{req.service?.name || 'Cứu hộ xe'}</span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-[#64748B]">{req.customer?.name || '—'}</span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-[#64748B] text-sm truncate max-w-[200px] block">{req.address || '—'}</span>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge variant={statusBadgeVariant[req.status] || 'default'} size="sm" dot>
                      {statusLabel[req.status] || req.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell className="text-right">
                    <span className="text-[#94A3B8] text-sm">
                      {new Date(req.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Card>
      )}
    </div>
  );
};

export default AdminDashboard;
