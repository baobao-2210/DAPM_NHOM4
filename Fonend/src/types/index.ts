// ==================== USER TYPES ====================
export type UserRole = 'admin' | 'staff' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
}

// ==================== VEHICLE TYPES ====================
export interface Vehicle {
  id: string;
  ownerId: string;
  ownerName: string;
  licensePlate: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  type: 'car' | 'motorcycle' | 'truck' | 'bus';
  status: 'active' | 'in_service' | 'inactive';
}

// ==================== RESCUE REQUEST TYPES ====================
export type RequestStatus =
  | 'pending'
  | 'accepted'
  | 'dispatched'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type ProblemType =
  | 'flat_tire'
  | 'engine_failure'
  | 'battery_dead'
  | 'fuel_empty'
  | 'accident'
  | 'towing'
  | 'lockout'
  | 'other';

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface RescueRequest {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  vehicleId: string;
  vehiclePlate: string;
  vehicleModel: string;
  problemType: ProblemType;
  description: string;
  location: Location;
  status: RequestStatus;
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedStaffId?: string;
  assignedStaffName?: string;
  createdAt: string;
  updatedAt: string;
  estimatedArrival?: string;
  completedAt?: string;
  rating?: number;
  feedback?: string;
  cost?: number;
}

// ==================== STAFF TYPES ====================
export type StaffStatus = 'available' | 'busy' | 'offline' | 'on_break';

export type StaffRole = 'leader' | 'senior' | 'staff' | 'driver';

export interface Staff {
  id: string;
  name: string;
  phone: string;
  email: string;
  specialization: string[];
  role: StaffRole;
  status: StaffStatus;
  location?: Location;
  currentRequestId?: string;
  rating: number;
  totalCompleted: number;
  joinedAt: string;
}

// ==================== SERVICE TYPES ====================
export interface ServicePackage {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // minutes
  features: string[];
  isPopular?: boolean;
}

// ==================== NOTIFICATION ====================
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'danger';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
}

// ==================== DASHBOARD STATS ====================
export interface DashboardStats {
  totalRequests: number;
  pendingRequests: number;
  activeRequests: number;
  completedToday: number;
  totalStaff: number;
  availableStaff: number;
  totalRevenue: number;
  avgResponseTime: number; // minutes
}
