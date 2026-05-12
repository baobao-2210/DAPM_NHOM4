import { mockServices } from '../data/mockData';
import type { ServicePackage } from '../types';

export type GuestRegisterData = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  address: string;
};

export type ForgotPasswordRequest = {
  emailOrPhone: string;
};

export type LoginRequest = {
  emailOrPhone: string;
  password: string;
};

export function getGuestServices(): Promise<ServicePackage[]> {
  return Promise.resolve(mockServices);
}

export function getGuestServiceById(id: string): Promise<ServicePackage | undefined> {
  return Promise.resolve(mockServices.find((service) => service.id === id));
}

export function login(request: LoginRequest): Promise<{ success: boolean; message: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock login - accept any non-empty input
      if (request.emailOrPhone.trim() && request.password.trim()) {
        resolve({
          success: true,
          message: 'Đăng nhập thành công.',
        });
      } else {
        resolve({
          success: false,
          message: 'Email/số điện thoại hoặc mật khẩu không đúng.',
        });
      }
    }, 500);
  });
}

export function registerCustomer(data: GuestRegisterData): Promise<{ success: boolean; message: string }> {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true, message: 'Đăng ký thành công. Vui lòng kiểm tra email để xác nhận.' }), 500);
  });
}

export function forgotPassword(request: ForgotPasswordRequest): Promise<{ success: boolean; message: string }> {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true, message: 'Hướng dẫn đặt lại mật khẩu đã được gửi tới thông tin bạn cung cấp.' }), 500);
  });
}
