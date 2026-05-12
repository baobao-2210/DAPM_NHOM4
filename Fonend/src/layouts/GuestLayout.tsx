import { Outlet } from 'react-router-dom';
import GuestHeader from '../components/guest/GuestHeader';
import GuestFooter from '../components/guest/GuestFooter';

export default function GuestLayout() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <GuestHeader />
      <main className="page-content animate-fade-in" style={{ paddingTop: 40, maxWidth: 1200, margin: '0 auto' }}>
        <Outlet />
      </main>
      <GuestFooter />
    </div>
  );
}
