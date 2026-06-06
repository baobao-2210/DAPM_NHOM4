import React from 'react';
import { useStaffData } from '../../hooks/useStaffQueries';
import { Activity, BellRing, CheckCircle, Clock, Star, TrendingUp, DollarSign } from 'lucide-react';

export default function Dashboard() {
  const { staffInfo, metricsQuery } = useStaffData();
  const metrics = metricsQuery.data || {};

  const fmt = (val?: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-[1200px] mx-auto pb-10">
        
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <span className="bg-blue-100 p-2 rounded-xl"><Activity className="w-8 h-8 text-blue-600" /></span>
            Tổng quan hoạt động
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Xin chào, <span className="font-bold text-gray-900">{staffInfo?.hoTen}</span>! Đây là kết quả hoạt động của bạn.</p>
        </div>

        {/* THỐNG KÊ DOANH THU */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-[24px] shadow-xl shadow-blue-900/20 text-white relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-blue-200 font-bold uppercase tracking-wider text-sm mb-1">Thu nhập hôm nay</p>
                <h3 className="text-3xl font-black">{fmt(metrics.thuNhapHomNay)}</h3>
              </div>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"><DollarSign className="w-6 h-6" /></div>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium bg-white/10 w-max px-3 py-1.5 rounded-full">
              <TrendingUp className="w-4 h-4" /> <span>Tiếp tục cố gắng!</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-500 font-bold uppercase tracking-wider text-sm mb-1">Thu nhập tháng</p>
                <h3 className="text-3xl font-black text-gray-900">{fmt(metrics.thuNhapThang)}</h3>
              </div>
              <div className="p-3 bg-green-50 rounded-xl"><TrendingUp className="w-6 h-6 text-green-600" /></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-500 font-bold uppercase tracking-wider text-sm mb-1">Đánh giá trung bình</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-4xl font-black text-gray-900">{metrics.danhGiaTrungBinh || '—'}</h3>
                  <span className="text-yellow-500"><Star className="w-6 h-6 fill-current" /></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-black text-gray-900 mb-4">Thống kê đơn hàng hôm nay</h2>
        
        {/* THỐNG KÊ ĐƠN HÀNG */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900 leading-none mb-1">{metrics.donHomNay || 0}</p>
              <p className="text-xs font-bold text-gray-500 uppercase">Tổng đơn</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center shrink-0">
              <BellRing className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900 leading-none mb-1">{metrics.donChoNhan || 0}</p>
              <p className="text-xs font-bold text-gray-500 uppercase">Chờ nhận</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900 leading-none mb-1">{metrics.donDangXuLy || 0}</p>
              <p className="text-xs font-bold text-gray-500 uppercase">Đang xử lý</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center shrink-0">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900 leading-none mb-1">{metrics.donHoanThanhHomNay || 0}</p>
              <p className="text-xs font-bold text-gray-500 uppercase">Hoàn thành</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}