import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  Settings, Save, Globe, Bell, Shield, Clock, MapPin,
  DollarSign, Phone, Mail, AlertTriangle, Info, ChevronRight
} from 'lucide-react';

// ===================== TYPES =====================
interface SystemSettings {
  // General
  systemName: string;
  hotline: string;
  email: string;
  address: string;
  operatingHours: string;
  // Service
  maxResponseTimeMinutes: number;
  maxTowingDistanceKm: number;
  baseServiceFee: number;
  urgentMultiplier: number;
  // Notification
  enableSmsNotification: boolean;
  enableEmailNotification: boolean;
  enablePushNotification: boolean;
  notifyOnNewRequest: boolean;
  notifyOnCompletion: boolean;
  notifyOnComplaint: boolean;
  // Map & Zone
  defaultLat: number;
  defaultLng: number;
  serviceRadiusKm: number;
  // Maintenance
  maintenanceMode: boolean;
  maintenanceMessage: string;
}

const defaultSettings: SystemSettings = {
  systemName: 'RescueGuard VN',
  hotline: '1800-xxxx',
  email: 'support@rescueguard.vn',
  address: '39 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
  operatingHours: '24/7',
  maxResponseTimeMinutes: 30,
  maxTowingDistanceKm: 50,
  baseServiceFee: 100000,
  urgentMultiplier: 1.5,
  enableSmsNotification: true,
  enableEmailNotification: true,
  enablePushNotification: true,
  notifyOnNewRequest: true,
  notifyOnCompletion: true,
  notifyOnComplaint: true,
  defaultLat: 10.7769,
  defaultLng: 106.7009,
  serviceRadiusKm: 30,
  maintenanceMode: false,
  maintenanceMessage: 'Hệ thống đang bảo trì, vui lòng quay lại sau.',
};

// ===================== TOGGLE SWITCH =====================
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{
        width: 48, height: 26, borderRadius: 99, border: 'none', cursor: 'pointer',
        background: checked ? 'var(--primary)' : '#d1d5db',
        position: 'relative', transition: 'background 0.25s',
        flexShrink: 0,
      }}
    >
      <span style={{
        display: 'block', width: 20, height: 20, borderRadius: '50%', background: 'white',
        position: 'absolute', top: 3, left: checked ? 25 : 3,
        transition: 'left 0.25s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
      }} />
    </button>
  );
}

// ===================== SECTION CARD =====================
function SectionCard({ icon: Icon, title, description, children, color = 'var(--primary)' }: {
  icon: React.ElementType; title: string; description: string; children: React.ReactNode; color?: string;
}) {
  return (
    <div className="card p-0 overflow-hidden">
      <div className="p-6 border-b border-[var(--border)] flex items-center gap-4"
        style={{ background: 'var(--bg-body)/30' }}>
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}18`, color }}>
          <Icon size={18} />
        </div>
        <div>
          <div className="font-black text-[var(--text-main)]">{title}</div>
          <div className="text-xs text-[var(--text-muted)]">{description}</div>
        </div>
      </div>
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
        {children}
      </div>
    </div>
  );
}

// ===================== SETTING ROW =====================
function SettingRow({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>{label}</div>
        {hint && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{hint}</div>}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );
}

const inputCls = "bg-[var(--bg-body)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm outline-none transition-all focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5 font-medium text-[var(--text-main)]";

// ===================== MAIN PAGE =====================
export default function SystemSettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings);
  const [activeSection, setActiveSection] = useState('general');
  const [isDirty, setIsDirty] = useState(false);

  function update<K extends keyof SystemSettings>(key: K, value: SystemSettings[K]) {
    setSettings(prev => ({ ...prev, [key]: value }));
    setIsDirty(true);
  }

  function handleSave() {
    toast.success('Đã lưu cài đặt hệ thống!');
    setIsDirty(false);
  }

  function handleReset() {
    if (window.confirm('Khôi phục về cài đặt mặc định?')) {
      setSettings(defaultSettings);
      setIsDirty(false);
      toast('Đã khôi phục cài đặt mặc định', { icon: '↩️' });
    }
  }

  const sections = [
    { id: 'general', label: 'Thông tin chung', icon: Globe },
    { id: 'service', label: 'Cấu hình dịch vụ', icon: Settings },
    { id: 'notification', label: 'Thông báo', icon: Bell },
    { id: 'map', label: 'Bản đồ & Khu vực', icon: MapPin },
    { id: 'maintenance', label: 'Bảo trì hệ thống', icon: Shield },
  ];

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">
            <span>Quản trị</span><span className="opacity-30">/</span>
            <span className="text-[var(--primary)]">Cài đặt hệ thống</span>
          </div>
          <h1 className="text-4xl font-black text-[var(--text-main)] tracking-tight">Quản lý hệ thống</h1>
          <p className="text-[var(--text-sub)] max-w-2xl">Cấu hình thông tin, tham số dịch vụ và các thiết lập vận hành của RescueGuard.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-secondary" onClick={handleReset}>Khôi phục mặc định</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={!isDirty}
            style={{ opacity: isDirty ? 1 : 0.5 }}>
            <Save size={16} /> Lưu thay đổi
          </button>
        </div>
      </div>

      {isDirty && (
        <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 16, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <AlertTriangle size={16} style={{ color: '#d97706', flexShrink: 0 }} />
          <span style={{ fontSize: 14, fontWeight: 700, color: '#92400e' }}>Bạn có thay đổi chưa được lưu. Nhấn "Lưu thay đổi" để áp dụng.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Sidebar Nav */}
        <div className="card p-3 space-y-1">
          {sections.map(s => (
            <button key={s.id}
              onClick={() => setActiveSection(s.id)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all text-left"
              style={{
                background: activeSection === s.id ? 'var(--primary-soft)' : 'transparent',
                color: activeSection === s.id ? 'var(--primary)' : 'var(--text-sub)',
                borderLeft: activeSection === s.id ? '3px solid var(--primary)' : '3px solid transparent',
              }}>
              <s.icon size={16} />
              {s.label}
              <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.5 }} />
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* General Settings */}
          {activeSection === 'general' && (
            <SectionCard icon={Globe} title="Thông tin chung" description="Tên hệ thống, liên hệ và địa chỉ vận hành">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label block mb-2">Tên hệ thống</label>
                  <input className={`${inputCls} w-full`} value={settings.systemName} onChange={e => update('systemName', e.target.value)} />
                </div>
                <div>
                  <label className="form-label block mb-2">Giờ hoạt động</label>
                  <input className={`${inputCls} w-full`} value={settings.operatingHours} onChange={e => update('operatingHours', e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label block mb-2">
                    <Phone size={11} className="inline mr-1" />Hotline hỗ trợ
                  </label>
                  <input className={`${inputCls} w-full`} value={settings.hotline} onChange={e => update('hotline', e.target.value)} />
                </div>
                <div>
                  <label className="form-label block mb-2">
                    <Mail size={11} className="inline mr-1" />Email hỗ trợ
                  </label>
                  <input className={`${inputCls} w-full`} type="email" value={settings.email} onChange={e => update('email', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="form-label block mb-2">
                  <MapPin size={11} className="inline mr-1" />Địa chỉ trụ sở
                </label>
                <input className={`${inputCls} w-full`} value={settings.address} onChange={e => update('address', e.target.value)} />
              </div>
            </SectionCard>
          )}

          {/* Service Config */}
          {activeSection === 'service' && (
            <SectionCard icon={Settings} title="Cấu hình dịch vụ" description="Thông số vận hành và chính sách dịch vụ" color="#8b5cf6">
              <SettingRow label="Thời gian phản hồi tối đa (phút)"
                hint="Nhân viên phải đến nơi trong giới hạn này">
                <input className={inputCls} type="number" style={{ width: 100, textAlign: 'right' }}
                  value={settings.maxResponseTimeMinutes}
                  onChange={e => update('maxResponseTimeMinutes', Number(e.target.value))} />
              </SettingRow>
              <div style={{ height: 1, background: 'var(--border)' }} />
              <SettingRow label="Khoảng cách kéo xe tối đa (km)"
                hint="Phạm vi kéo xe trong gói dịch vụ tiêu chuẩn">
                <input className={inputCls} type="number" style={{ width: 100, textAlign: 'right' }}
                  value={settings.maxTowingDistanceKm}
                  onChange={e => update('maxTowingDistanceKm', Number(e.target.value))} />
              </SettingRow>
              <div style={{ height: 1, background: 'var(--border)' }} />
              <SettingRow label="Phí dịch vụ cơ bản (đ)"
                hint="Phí tối thiểu cho mỗi yêu cầu cứu hộ">
                <input className={inputCls} type="number" style={{ width: 120, textAlign: 'right' }}
                  value={settings.baseServiceFee}
                  onChange={e => update('baseServiceFee', Number(e.target.value))} />
              </SettingRow>
              <div style={{ height: 1, background: 'var(--border)' }} />
              <SettingRow label="Hệ số phí khẩn cấp"
                hint="Nhân với phí cơ bản cho yêu cầu ưu tiên cao">
                <input className={inputCls} type="number" step="0.1" style={{ width: 100, textAlign: 'right' }}
                  value={settings.urgentMultiplier}
                  onChange={e => update('urgentMultiplier', Number(e.target.value))} />
              </SettingRow>
            </SectionCard>
          )}

          {/* Notification Settings */}
          {activeSection === 'notification' && (
            <SectionCard icon={Bell} title="Cài đặt thông báo" description="Kênh và điều kiện gửi thông báo" color="#f59e0b">
              <div>
                <div className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] mb-4">Kênh thông báo</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <SettingRow label="Thông báo SMS" hint="Gửi tin nhắn SMS đến khách hàng và nhân viên">
                    <Toggle checked={settings.enableSmsNotification} onChange={v => update('enableSmsNotification', v)} />
                  </SettingRow>
                  <div style={{ height: 1, background: 'var(--border)' }} />
                  <SettingRow label="Thông báo Email" hint="Gửi email xác nhận và cập nhật trạng thái">
                    <Toggle checked={settings.enableEmailNotification} onChange={v => update('enableEmailNotification', v)} />
                  </SettingRow>
                  <div style={{ height: 1, background: 'var(--border)' }} />
                  <SettingRow label="Thông báo đẩy (Push)" hint="Thông báo trên ứng dụng di động">
                    <Toggle checked={settings.enablePushNotification} onChange={v => update('enablePushNotification', v)} />
                  </SettingRow>
                </div>
              </div>
              <div style={{ height: 1, background: 'var(--border)' }} />
              <div>
                <div className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] mb-4">Sự kiện kích hoạt thông báo</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <SettingRow label="Yêu cầu mới" hint="Khi có khách hàng gửi yêu cầu cứu hộ">
                    <Toggle checked={settings.notifyOnNewRequest} onChange={v => update('notifyOnNewRequest', v)} />
                  </SettingRow>
                  <div style={{ height: 1, background: 'var(--border)' }} />
                  <SettingRow label="Hoàn thành yêu cầu" hint="Khi nhân viên đánh dấu hoàn thành">
                    <Toggle checked={settings.notifyOnCompletion} onChange={v => update('notifyOnCompletion', v)} />
                  </SettingRow>
                  <div style={{ height: 1, background: 'var(--border)' }} />
                  <SettingRow label="Có khiếu nại mới" hint="Khi khách hàng gửi khiếu nại">
                    <Toggle checked={settings.notifyOnComplaint} onChange={v => update('notifyOnComplaint', v)} />
                  </SettingRow>
                </div>
              </div>
            </SectionCard>
          )}

          {/* Map Settings */}
          {activeSection === 'map' && (
            <SectionCard icon={MapPin} title="Bản đồ & Khu vực phục vụ" description="Cấu hình vùng hoạt động và tọa độ trung tâm" color="var(--success)">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label block mb-2">Vĩ độ trung tâm (Lat)</label>
                  <input className={`${inputCls} w-full`} type="number" step="0.0001"
                    value={settings.defaultLat} onChange={e => update('defaultLat', Number(e.target.value))} />
                </div>
                <div>
                  <label className="form-label block mb-2">Kinh độ trung tâm (Lng)</label>
                  <input className={`${inputCls} w-full`} type="number" step="0.0001"
                    value={settings.defaultLng} onChange={e => update('defaultLng', Number(e.target.value))} />
                </div>
              </div>
              <div style={{ height: 1, background: 'var(--border)' }} />
              <SettingRow label="Bán kính phục vụ (km)"
                hint="Khu vực tối đa hệ thống chấp nhận yêu cầu">
                <input className={inputCls} type="number" style={{ width: 100, textAlign: 'right' }}
                  value={settings.serviceRadiusKm}
                  onChange={e => update('serviceRadiusKm', Number(e.target.value))} />
              </SettingRow>
              <div style={{ background: 'var(--bg-body)', borderRadius: 16, padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                <Info size={16} style={{ color: 'var(--info)', flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: 'var(--text-sub)' }}>
                  Khu vực phục vụ hiện tại: TP. Hồ Chí Minh và các vùng lân cận trong bán kính <strong>{settings.serviceRadiusKm}km</strong>.
                </span>
              </div>
            </SectionCard>
          )}

          {/* Maintenance */}
          {activeSection === 'maintenance' && (
            <SectionCard icon={Shield} title="Bảo trì hệ thống" description="Chế độ bảo trì và thông báo đến người dùng" color="var(--danger)">
              <SettingRow label="Chế độ bảo trì"
                hint="Khi bật, người dùng sẽ thấy thông báo bảo trì và không thể tạo yêu cầu mới">
                <Toggle checked={settings.maintenanceMode} onChange={v => {
                  if (v && !window.confirm('Bật chế độ bảo trì sẽ ngừng mọi yêu cầu mới. Tiếp tục?')) return;
                  update('maintenanceMode', v);
                }} />
              </SettingRow>

              {settings.maintenanceMode && (
                <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 16, padding: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <AlertTriangle size={16} style={{ color: 'var(--danger)' }} />
                    <span style={{ fontWeight: 900, fontSize: 13, color: 'var(--danger)' }}>Hệ thống đang ở chế độ bảo trì</span>
                  </div>
                  <label className="form-label block mb-2">Thông báo đến người dùng</label>
                  <textarea
                    className="w-full bg-white border border-[var(--border)] rounded-2xl px-4 py-3 text-sm outline-none transition-all focus:border-[var(--primary)] resize-none"
                    rows={3}
                    value={settings.maintenanceMessage}
                    onChange={e => update('maintenanceMessage', e.target.value)}
                  />
                </div>
              )}

              <div style={{ height: 1, background: 'var(--border)' }} />

              <div>
                <div className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] mb-4">Thông tin phiên bản</div>
                {[
                  { label: 'Phiên bản hệ thống', value: 'v2.5.1' },
                  { label: 'Cập nhật lần cuối', value: '13/05/2026 09:30' },
                  { label: 'Môi trường', value: 'Production' },
                  { label: 'Trạng thái DB', value: '🟢 Kết nối tốt' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
                    <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>{item.label}</span>
                    <span style={{ fontSize: 13, color: 'var(--text-main)', fontWeight: 800 }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}
        </div>
      </div>
    </div>
  );
}
