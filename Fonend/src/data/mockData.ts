import type {
  RescueRequest, Staff, User, Vehicle, DashboardStats, ServicePackage, Notification
} from '../types';

// ==================== USERS ====================
export const mockUsers: User[] = [
  { id: 'u1', name: 'Nguyễn Văn Admin', email: 'admin@rescue.vn', phone: '0901234567', role: 'admin', status: 'active', createdAt: '2024-01-01' },
  { id: 'u2', name: 'Trần Thị Staff', email: 'staff1@rescue.vn', phone: '0912345678', role: 'staff', status: 'active', createdAt: '2024-02-10' },
  { id: 'u3', name: 'Lê Văn Cường', email: 'cuong@gmail.com', phone: '0923456789', role: 'customer', status: 'active', createdAt: '2024-03-15' },
  { id: 'u4', name: 'Phạm Thị Lan', email: 'lan@gmail.com', phone: '0934567890', role: 'customer', status: 'active', createdAt: '2024-04-01' },
  { id: 'u5', name: 'Hoàng Minh Tuấn', email: 'tuan@gmail.com', phone: '0945678901', role: 'customer', status: 'active', createdAt: '2024-04-20' },
];

// ==================== VEHICLES ====================
export const mockVehicles: Vehicle[] = [
  { id: 'v1', ownerId: 'u3', ownerName: 'Lê Văn Cường', licensePlate: '51A-12345', brand: 'Toyota', model: 'Vios', year: 2021, color: 'Trắng', type: 'car', status: 'active' },
  { id: 'v2', ownerId: 'u4', ownerName: 'Phạm Thị Lan', licensePlate: '51B-67890', brand: 'Honda', model: 'City', year: 2022, color: 'Đen', type: 'car', status: 'in_service' },
  { id: 'v3', ownerId: 'u5', ownerName: 'Hoàng Minh Tuấn', licensePlate: '51C-11111', brand: 'Yamaha', model: 'Exciter', year: 2023, color: 'Xanh', type: 'motorcycle', status: 'active' },
  { id: 'v4', ownerId: 'u3', ownerName: 'Lê Văn Cường', licensePlate: '51D-22222', brand: 'Ford', model: 'Ranger', year: 2020, color: 'Bạc', type: 'car', status: 'active' },
];

// ==================== STAFF ====================
export const mockStaff: Staff[] = [
  { id: 's1', name: 'Nguyễn Hùng Dũng', phone: '0901111111', email: 'dung@rescue.vn', specialization: ['Động cơ', 'Điện xe'], role: 'leader', status: 'available', rating: 4.9, totalCompleted: 312, joinedAt: '2023-01-10', location: { lat: 10.7769, lng: 106.7009, address: 'Quận 1, TP.HCM' } },
  { id: 's2', name: 'Trần Minh Khoa', phone: '0902222222', email: 'khoa@rescue.vn', specialization: ['Vỏ xe', 'Kéo xe'], role: 'driver', status: 'busy', rating: 4.7, totalCompleted: 208, joinedAt: '2023-03-05', currentRequestId: 'r1', location: { lat: 10.8231, lng: 106.6297, address: 'Quận 12, TP.HCM' } },
  { id: 's3', name: 'Lê Quang Vinh', phone: '0903333333', email: 'vinh@rescue.vn', specialization: ['Nhiên liệu', 'Khóa xe'], role: 'senior', status: 'available', rating: 4.8, totalCompleted: 176, joinedAt: '2023-06-20', location: { lat: 10.7956, lng: 106.7219, address: 'Bình Thạnh, TP.HCM' } },
  { id: 's4', name: 'Phạm Đức Tài', phone: '0904444444', email: 'tai@rescue.vn', specialization: ['Tai nạn', 'Cứu hộ khẩn cấp'], role: 'staff', status: 'on_break', rating: 4.6, totalCompleted: 145, joinedAt: '2023-09-01' },
  { id: 's5', name: 'Võ Thành Nam', phone: '0905555555', email: 'nam@rescue.vn', specialization: ['Điện xe', 'Máy lạnh'], role: 'staff', status: 'offline', rating: 4.5, totalCompleted: 98, joinedAt: '2024-01-15' },

];

// ==================== RESCUE REQUESTS ====================
export const mockRequests: RescueRequest[] = [
  {
    id: 'r1', customerId: 'u3', customerName: 'Lê Văn Cường', customerPhone: '0923456789',
    vehicleId: 'v1', vehiclePlate: '51A-12345', vehicleModel: 'Toyota Vios 2021',
    problemType: 'flat_tire', description: 'Xe bị nổ lốp trên đường Nguyễn Huệ, cần thay lốp gấp',
    location: { lat: 10.7769, lng: 106.7009, address: '39 Nguyễn Huệ, Quận 1, TP.HCM' },
    status: 'in_progress', priority: 'high',
    assignedStaffId: 's2', assignedStaffName: 'Trần Minh Khoa',
    createdAt: '2025-05-09T08:30:00Z', updatedAt: '2025-05-09T08:45:00Z',
    estimatedArrival: '2025-05-09T09:00:00Z', cost: 350000
  },
  {
    id: 'r2', customerId: 'u4', customerName: 'Phạm Thị Lan', customerPhone: '0934567890',
    vehicleId: 'v2', vehiclePlate: '51B-67890', vehicleModel: 'Honda City 2022',
    problemType: 'battery_dead', description: 'Xe chết máy, hết bình ắc quy không khởi động được',
    location: { lat: 10.8231, lng: 106.6297, address: '15 Lê Văn Việt, Quận 9, TP.HCM' },
    status: 'pending', priority: 'medium',
    createdAt: '2025-05-09T09:00:00Z', updatedAt: '2025-05-09T09:00:00Z', cost: 250000
  },
  {
    id: 'r3', customerId: 'u5', customerName: 'Hoàng Minh Tuấn', customerPhone: '0945678901',
    vehicleId: 'v3', vehiclePlate: '51C-11111', vehicleModel: 'Yamaha Exciter 2023',
    problemType: 'fuel_empty', description: 'Hết xăng giữa đường, không có trạm xăng gần đây',
    location: { lat: 10.7956, lng: 106.7219, address: 'Xa lộ Hà Nội, TP.HCM' },
    status: 'accepted', priority: 'low',
    assignedStaffId: 's3', assignedStaffName: 'Lê Quang Vinh',
    createdAt: '2025-05-09T09:15:00Z', updatedAt: '2025-05-09T09:20:00Z',
    estimatedArrival: '2025-05-09T09:40:00Z', cost: 150000
  },
  {
    id: 'r4', customerId: 'u3', customerName: 'Lê Văn Cường', customerPhone: '0923456789',
    vehicleId: 'v4', vehiclePlate: '51D-22222', vehicleModel: 'Ford Ranger 2020',
    problemType: 'engine_failure', description: 'Động cơ bị hỏng, xe không thể di chuyển, cần kéo về garage',
    location: { lat: 10.7500, lng: 106.6800, address: 'Đường Võ Văn Kiệt, Quận 8, TP.HCM' },
    status: 'completed', priority: 'critical',
    assignedStaffId: 's1', assignedStaffName: 'Nguyễn Hùng Dũng',
    createdAt: '2025-05-08T14:00:00Z', updatedAt: '2025-05-08T17:30:00Z',
    completedAt: '2025-05-08T17:30:00Z', cost: 1200000, rating: 5, feedback: 'Phục vụ rất tốt, nhanh chóng!'
  },
  {
    id: 'r5', customerId: 'u4', customerName: 'Phạm Thị Lan', customerPhone: '0934567890',
    vehicleId: 'v2', vehiclePlate: '51B-67890', vehicleModel: 'Honda City 2022',
    problemType: 'lockout', description: 'Quên chìa khóa trong xe, cần hỗ trợ mở khóa',
    location: { lat: 10.8000, lng: 106.6500, address: 'Trung tâm thương mại Aeon Mall, Bình Dương' },
    status: 'dispatched', priority: 'medium',
    assignedStaffId: 's1', assignedStaffName: 'Nguyễn Hùng Dũng',
    createdAt: '2025-05-09T07:00:00Z', updatedAt: '2025-05-09T07:10:00Z',
    estimatedArrival: '2025-05-09T07:45:00Z', cost: 200000
  },
];

// ==================== DASHBOARD STATS ====================
export const mockDashboardStats: DashboardStats = {
  totalRequests: 1248,
  pendingRequests: 7,
  activeRequests: 12,
  completedToday: 34,
  totalStaff: 18,
  availableStaff: 8,
  totalRevenue: 85400000,
  avgResponseTime: 14,
};

// ==================== SERVICES ====================
export const mockServices: ServicePackage[] = [
  { id: 'svc1', name: 'Cơ Bản', description: 'Gói hỗ trợ tiêu chuẩn', price: 299000, duration: 30, features: ['Thay lốp', 'Nhiên liệu khẩn cấp', 'Khởi động xe', 'Hỗ trợ 24/7'], isPopular: false },
  { id: 'svc2', name: 'Nâng Cao', description: 'Gói hỗ trợ toàn diện', price: 599000, duration: 60, features: ['Tất cả gói Cơ Bản', 'Kéo xe (50km)', 'Sửa chữa tại chỗ', 'Xe thay thế 24h', 'Ưu tiên xử lý'], isPopular: true },
  { id: 'svc3', name: 'Cao Cấp', description: 'Bảo vệ toàn diện không giới hạn', price: 999000, duration: 120, features: ['Tất cả gói Nâng Cao', 'Kéo xe không giới hạn', 'Sửa chữa tại garage đối tác', 'Xe thay thế 72h', 'Tư vấn bảo hiểm', 'Ưu tiên tuyệt đối'], isPopular: false },
];

// ==================== NOTIFICATIONS ====================
export const mockNotifications: Notification[] = [
  { id: 'n1', type: 'danger', title: 'Yêu cầu khẩn cấp', message: 'Có yêu cầu cứu hộ mức ưu tiên CRITICAL từ khách hàng Lê Văn Cường', isRead: false, createdAt: '2025-05-09T09:05:00Z' },
  { id: 'n2', type: 'success', title: 'Hoàn thành yêu cầu', message: 'Yêu cầu #R004 đã được hoàn thành bởi Nguyễn Hùng Dũng', isRead: false, createdAt: '2025-05-08T17:30:00Z' },
  { id: 'n3', type: 'info', title: 'Nhân viên mới', message: 'Võ Thành Nam vừa bắt đầu ca làm việc', isRead: true, createdAt: '2025-05-09T07:00:00Z' },
  { id: 'n4', type: 'warning', title: 'Nhân viên thiếu', message: 'Khu vực Quận 7 đang thiếu nhân viên hỗ trợ', isRead: true, createdAt: '2025-05-09T06:00:00Z' },
];
