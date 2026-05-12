import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import ServiceCard from '../../components/guest/ServiceCard';
import { mockServices } from '../../data/mockData';
import type { ServicePackage } from '../../types';

const categories = ['all', 'Cơ Bản', 'Nâng Cao', 'Cao Cấp'];

export default function ServiceListPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const filteredServices = useMemo(() => {
    return mockServices.filter((service) => {
      const matchSearch = service.name.toLowerCase().includes(search.toLowerCase()) || service.description.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === 'all' || service.name.includes(category);
      return matchSearch && matchCategory;
    });
  }, [search, category]);

  return (
    <div style={{ display: 'grid', gap: 28 }}>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Danh mục dịch vụ cứu hộ</h1>
          <p>Tìm kiếm và lọc các gói cứu hộ phù hợp với nhu cầu của bạn.</p>
        </div>
      </div>

      <div className="card" style={{ padding: 24, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="search-bar" style={{ flex: 1, minWidth: 240 }}>
          <Search size={16} />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Tìm kiếm dịch vụ..."
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <label htmlFor="service-category" style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Lọc theo loại</label>
          <select
            id="service-category"
            className="form-select"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            style={{ minWidth: 180 }}
          >
            {categories.map((option) => (
              <option key={option} value={option}>{option === 'all' ? 'Tất cả' : option}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid-3" style={{ gap: 20 }}>
        {filteredServices.length > 0 ? (
          filteredServices.map((service: ServicePackage) => (
            <ServiceCard key={service.id} service={service} />
          ))
        ) : (
          <div className="card" style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)' }}>Không tìm thấy dịch vụ phù hợp với bộ lọc của bạn.</p>
          </div>
        )}
      </div>
    </div>
  );
}
