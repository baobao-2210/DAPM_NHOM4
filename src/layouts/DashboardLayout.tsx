import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Outlet } from 'react-router-dom';

export default function DashboardLayout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <main className="page-content animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
