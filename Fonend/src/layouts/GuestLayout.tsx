import { Outlet } from 'react-router-dom';
import GuestHeader from '../components/guest/GuestHeader';
import GuestFooter from '../components/guest/GuestFooter';

export default function GuestLayout() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-body)' }}>
      <GuestHeader />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }} className="animate-fade-in">
        <Outlet />
      </main>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 40px' }}>
        <GuestFooter />
      </div>
    </div>
  );
}
