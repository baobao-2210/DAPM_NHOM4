import { useState } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { Map, Plus, ChevronRight, ChevronDown, Pencil, Trash2 } from 'lucide-react';

const MOCK_AREAS = [
  {
    id: 'p1',
    name: 'TP. Hồ Chí Minh',
    type: 'province',
    staffCount: 45,
    children: [
      { id: 'd1', name: 'Quận 1', type: 'district', staffCount: 12 },
      { id: 'd2', name: 'Quận 3', type: 'district', staffCount: 8 },
      { id: 'd3', name: 'Thành phố Thủ Đức', type: 'district', staffCount: 25 },
    ],
  },
  {
    id: 'p2',
    name: 'Hà Nội',
    type: 'province',
    staffCount: 30,
    children: [
      { id: 'd4', name: 'Quận Hoàn Kiếm', type: 'district', staffCount: 10 },
      { id: 'd5', name: 'Quận Cầu Giấy', type: 'district', staffCount: 20 },
    ],
  },
];

const ManageAreas = () => {
  const [areas] = useState(MOCK_AREAS);
  const [expandedNodes, setExpandedNodes] = useState(['p1']);

  const toggleNode = (id) => {
    if (expandedNodes.includes(id)) {
      setExpandedNodes(expandedNodes.filter((n) => n !== id));
    } else {
      setExpandedNodes([...expandedNodes, id]);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title="Quản lý khu vực hoạt động"
        description="Thiết lập các tỉnh thành, quận huyện và phân bổ nhân sự cứu hộ."
        actions={
          <Button icon={Plus}>Thêm tỉnh / thành phố</Button>
        }
      />

      <Card padding={true} className="border-[#E2E8F0]">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#E2E8F0]">
          <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
            <Map className="w-5 h-5 text-[#1D4ED8]" />
          </div>
          <div>
            <h3 className="font-bold text-[#0F172A]">Sơ đồ khu vực</h3>
            <p className="text-xs text-[#64748B]">Click vào tỉnh thành để xem chi tiết quận/huyện</p>
          </div>
        </div>

        <div className="space-y-3">
          {areas.map((province) => {
            const isExpanded = expandedNodes.includes(province.id);
            return (
              <div key={province.id} className="border border-[#E2E8F0] rounded-xl overflow-hidden">
                {/* Province Node */}
                <div 
                  className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${
                    isExpanded ? 'bg-[#F8FAFC]' : 'hover:bg-[#F8FAFC]'
                  }`}
                  onClick={() => toggleNode(province.id)}
                >
                  <div className="flex items-center gap-3">
                    <button className="w-6 h-6 flex items-center justify-center text-[#94A3B8] hover:text-[#1D4ED8] transition-colors">
                      {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </button>
                    <span className="font-bold text-[#0F172A] text-base">{province.name}</span>
                    <Badge variant="primary" size="sm">Tỉnh / TP</Badge>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-[#64748B] font-semibold uppercase mb-0.5">Nhân sự</p>
                      <p className="font-bold text-[#1D4ED8]">{province.staffCount}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-[#94A3B8] hover:text-[#1D4ED8] hover:bg-[#EFF6FF] rounded-lg transition-colors" title="Thêm Quận/Huyện">
                        <Plus className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#E2E8F0] rounded-lg transition-colors" title="Sửa">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#FEF2F2] rounded-lg transition-colors" title="Xóa">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* District Nodes */}
                {isExpanded && (
                  <div className="bg-white border-t border-[#E2E8F0]">
                    {province.children.map((district, idx) => (
                      <div 
                        key={district.id} 
                        className={`flex items-center justify-between p-4 pl-14 hover:bg-[#F8FAFC] transition-colors ${
                          idx !== province.children.length - 1 ? 'border-b border-[#F1F5F9]' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-[#334155]">{district.name}</span>
                          <Badge variant="outline" size="sm">Quận / Huyện</Badge>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-[#64748B]">{district.staffCount}</span>
                            <span className="text-xs text-[#94A3B8]">nhân sự</span>
                          </div>
                          <div className="flex gap-2">
                            <button className="p-1.5 text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#E2E8F0] rounded-lg transition-colors" title="Sửa">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#FEF2F2] rounded-lg transition-colors" title="Xóa">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default ManageAreas;
