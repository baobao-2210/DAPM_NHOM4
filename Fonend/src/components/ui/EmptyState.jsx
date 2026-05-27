import { Inbox } from 'lucide-react';
import Button from './Button';

const EmptyState = ({
  icon: Icon = Inbox,
  title = 'Không có dữ liệu',
  description = 'Chưa có dữ liệu để hiển thị.',
  actionLabel,
  onAction,
  className = '',
}) => (
  <div className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}>
    <div className="w-16 h-16 rounded-2xl bg-[#F1F5F9] flex items-center justify-center mb-4">
      <Icon className="w-8 h-8 text-[#94A3B8]" />
    </div>
    <h3 className="text-lg font-semibold text-[#0F172A] mb-2">{title}</h3>
    <p className="text-sm text-[#64748B] max-w-sm mb-6">{description}</p>
    {actionLabel && onAction && (
      <Button variant="primary" size="md" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </div>
);

export default EmptyState;
