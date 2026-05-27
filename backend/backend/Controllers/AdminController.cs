using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Controllers
{
    [Route("api/admin")]
    [ApiController]
    // [Authorize(Roles = "Admin")] // Bỏ comment khi ráp Frontend để bảo mật
    public class AdminController : ControllerBase
    {
        private readonly DataContext _context;

        public AdminController(DataContext context)
        {
            _context = context;
        }

        // ==========================================
        // DASHBOARD THỐNG KÊ
        // ==========================================
        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard()
        {
            var totalCustomers = await _context.Khachhangs.CountAsync();
            var totalStaff = await _context.NhanvienCuuhos.CountAsync();
            var totalServices = await _context.DichvuCuuhos.CountAsync(d => d.TrangThai == "HoatDong");
            var totalRequests = await _context.YeucauCuuhos.CountAsync();
            
            var pendingRequests = await _context.YeucauCuuhos.CountAsync(y => y.TrangThaiHienTai == "ChoXuLy");
            var ongoingRequests = await _context.YeucauCuuhos.CountAsync(y => y.TrangThaiHienTai == "DangXuLy" || y.TrangThaiHienTai == "DaPhanCong");
            var completedRequests = await _context.YeucauCuuhos.CountAsync(y => y.TrangThaiHienTai == "HoanThanh");

            var revenue = await _context.Thanhtoans
                .Where(t => t.TrangThai == "ThanhCong" || t.TrangThai == "DaThanhToan")
                .SumAsync(t => t.SoTien) ?? 0;

            var recentRequests = await _context.YeucauCuuhos
                .Include(y => y.IdKhachHangNavigation).ThenInclude(k => k.IdTaiKhoanNavigation)
                .Include(y => y.IdDichVuNavigation)
                .OrderByDescending(y => y.NgayTao)
                .Take(5)
                .Select(y => new
                {
                    _id = y.IdYeuCau,
                    customer = new { name = y.IdKhachHangNavigation.IdTaiKhoanNavigation.HoTen },
                    service = new { name = y.IdDichVuNavigation.TenDichVu },
                    address = y.NoiSuCo,
                    status = y.TrangThaiHienTai == "HoanThanh" ? "Completed" : (y.TrangThaiHienTai == "ChoXuLy" ? "Pending" : "OnGoing"),
                    createdAt = y.NgayTao
                })
                .ToListAsync();

            return Ok(new
            {
                totalCustomers,
                totalStaff,
                totalServices,
                totalRequests,
                pendingRequests,
                ongoingRequests,
                completedRequests,
                revenue,
                recentRequests
            });
        }

        // ==========================================
        // QUẢN LÝ DỊCH VỤ
        // ==========================================
        [HttpGet("services")]
        public async Task<IActionResult> GetServices()
        {
            var services = await _context.DichvuCuuhos
                .Include(d => d.IdDanhMucNavigation)
                .Select(d => new
                {
                    _id = d.IdDichVu,
                    name = d.TenDichVu,
                    description = d.MoTa,
                    price = d.GiaCoBan,
                    category = d.IdDanhMucNavigation.TenDanhMuc,
                    icon = "🔧" // Mặc định do DB không có cột này
                })
                .ToListAsync();

            return Ok(new { data = services });
        }

        [HttpPost("services")]
        public async Task<IActionResult> CreateService([FromBody] ServiceDto dto)
        {
            // Tạm thời tạo danh mục mặc định nếu chưa có
            var dm = await _context.DanhmucDichvus.FirstOrDefaultAsync(d => d.TenDanhMuc == dto.Category);
            if (dm == null)
            {
                dm = new DanhmucDichvu { TenDanhMuc = dto.Category, TrangThai = "HoatDong" };
                _context.DanhmucDichvus.Add(dm);
                await _context.SaveChangesAsync();
            }

            var dv = new DichvuCuuho
            {
                IdDanhMuc = dm.IdDanhMuc,
                TenDichVu = dto.Name,
                MoTa = dto.Description,
                GiaCoBan = dto.Price,
                TrangThai = "HoatDong",
                NgayCapNhat = DateTime.Now
            };

            _context.DichvuCuuhos.Add(dv);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Thêm thành công" });
        }

        [HttpPut("services/{id}")]
        public async Task<IActionResult> UpdateService(int id, [FromBody] ServiceDto dto)
        {
            var dv = await _context.DichvuCuuhos.FindAsync(id);
            if (dv == null) return NotFound();

            var dm = await _context.DanhmucDichvus.FirstOrDefaultAsync(d => d.TenDanhMuc == dto.Category);
            if (dm == null)
            {
                dm = new DanhmucDichvu { TenDanhMuc = dto.Category, TrangThai = "HoatDong" };
                _context.DanhmucDichvus.Add(dm);
                await _context.SaveChangesAsync();
            }

            dv.TenDichVu = dto.Name;
            dv.MoTa = dto.Description;
            dv.GiaCoBan = dto.Price;
            dv.IdDanhMuc = dm.IdDanhMuc;
            dv.NgayCapNhat = DateTime.Now;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Cập nhật thành công" });
        }

        [HttpDelete("services/{id}")]
        public async Task<IActionResult> DeleteService(int id)
        {
            var dv = await _context.DichvuCuuhos.FindAsync(id);
            if (dv == null) return NotFound();
            
            dv.TrangThai = "NgungHoatDong";
            await _context.SaveChangesAsync();
            return Ok(new { message = "Đã vô hiệu hóa dịch vụ" });
        }

        // ==========================================
        // QUẢN LÝ NHÂN VIÊN
        // ==========================================
        [HttpGet("staff")]
        public async Task<IActionResult> GetStaff()
        {
            var staff = await _context.NhanvienCuuhos
                .Include(nv => nv.IdTaiKhoanNavigation)
                .Select(nv => new
                {
                    _id = nv.IdNhanVien,
                    name = nv.IdTaiKhoanNavigation.HoTen,
                    email = nv.IdTaiKhoanNavigation.Email,
                    phone = nv.IdTaiKhoanNavigation.SoDienThoai,
                    role = "staff",
                    specialization = nv.MoTa ?? "Nhân viên cứu hộ",
                    status = nv.TrangThaiNhanViec == true ? "active" : "inactive"
                })
                .ToListAsync();

            return Ok(new { data = staff });
        }

        [HttpPost("staff")]
        public async Task<IActionResult> CreateStaff([FromBody] UserDto dto)
        {
            var tk = new Taikhoan
            {
                Email = dto.Email,
                MatKhauHash = "123456", // Default password
                HoTen = dto.Name,
                SoDienThoai = dto.Phone,
                VaiTro = "NhanVien",
                TrangThai = "HoatDong",
                NgayTao = DateTime.Now
            };

            _context.Taikhoans.Add(tk);
            await _context.SaveChangesAsync();

            var nv = new NhanvienCuuho
            {
                IdTaiKhoan = tk.IdTaiKhoan,
                MoTa = dto.Specialization,
                TrangThaiNhanViec = true
            };
            _context.NhanvienCuuhos.Add(nv);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Thêm nhân viên thành công" });
        }

        [HttpPut("staff/{id}")]
        public async Task<IActionResult> UpdateStaff(int id, [FromBody] UserDto dto)
        {
            var nv = await _context.NhanvienCuuhos
                .Include(n => n.IdTaiKhoanNavigation)
                .FirstOrDefaultAsync(n => n.IdNhanVien == id);
            
            if (nv == null) return NotFound();

            nv.IdTaiKhoanNavigation.HoTen = dto.Name;
            nv.IdTaiKhoanNavigation.Email = dto.Email;
            nv.IdTaiKhoanNavigation.SoDienThoai = dto.Phone;
            nv.MoTa = dto.Specialization;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Cập nhật thành công" });
        }

        [HttpDelete("staff/{id}")]
        public async Task<IActionResult> DeleteStaff(int id)
        {
            var nv = await _context.NhanvienCuuhos
                .Include(n => n.IdTaiKhoanNavigation)
                .FirstOrDefaultAsync(n => n.IdNhanVien == id);
            if (nv == null) return NotFound();
            
            nv.IdTaiKhoanNavigation.TrangThai = "Khoa";
            await _context.SaveChangesAsync();
            return Ok(new { message = "Đã khóa tài khoản nhân viên" });
        }

        // ==========================================
        // QUẢN LÝ KHÁCH HÀNG
        // ==========================================
        [HttpGet("customers")]
        public async Task<IActionResult> GetCustomers()
        {
            var customers = await _context.Khachhangs
                .Include(k => k.IdTaiKhoanNavigation)
                .Select(k => new
                {
                    _id = k.IdKhachHang,
                    name = k.IdTaiKhoanNavigation.HoTen,
                    email = k.IdTaiKhoanNavigation.Email,
                    phone = k.IdTaiKhoanNavigation.SoDienThoai,
                    role = "customer",
                    status = k.IdTaiKhoanNavigation.TrangThai == "HoatDong" ? "active" : "inactive"
                })
                .ToListAsync();

            return Ok(new { data = customers });
        }

        [HttpPost("customers")]
        public async Task<IActionResult> CreateCustomer([FromBody] UserDto dto)
        {
            var tk = new Taikhoan
            {
                Email = dto.Email,
                MatKhauHash = "123456",
                HoTen = dto.Name,
                SoDienThoai = dto.Phone,
                VaiTro = "KhachHang",
                TrangThai = "HoatDong",
                NgayTao = DateTime.Now
            };

            _context.Taikhoans.Add(tk);
            await _context.SaveChangesAsync();

            var kh = new Khachhang
            {
                IdTaiKhoan = tk.IdTaiKhoan,
                IdPhuongXa = 1 
            };
            _context.Khachhangs.Add(kh);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpPut("customers/{id}")]
        public async Task<IActionResult> UpdateCustomer(int id, [FromBody] UserDto dto)
        {
            var kh = await _context.Khachhangs
                .Include(k => k.IdTaiKhoanNavigation)
                .FirstOrDefaultAsync(k => k.IdKhachHang == id);
            if (kh == null) return NotFound();

            kh.IdTaiKhoanNavigation.HoTen = dto.Name;
            kh.IdTaiKhoanNavigation.Email = dto.Email;
            kh.IdTaiKhoanNavigation.SoDienThoai = dto.Phone;

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("customers/{id}")]
        public async Task<IActionResult> DeleteCustomer(int id)
        {
            var kh = await _context.Khachhangs
                .Include(k => k.IdTaiKhoanNavigation)
                .FirstOrDefaultAsync(k => k.IdKhachHang == id);
            if (kh == null) return NotFound();

            kh.IdTaiKhoanNavigation.TrangThai = "Khoa";
            await _context.SaveChangesAsync();
            return Ok();
        }

        // ==========================================
        // QUẢN LÝ CUỐC CỨU HỘ
        // ==========================================
        [HttpGet("rescue-requests")]
        public async Task<IActionResult> GetRescueRequests()
        {
            var requests = await _context.YeucauCuuhos
                .Include(y => y.IdKhachHangNavigation).ThenInclude(k => k.IdTaiKhoanNavigation)
                .Include(y => y.IdNhanVienNavigation).ThenInclude(nv => nv.IdTaiKhoanNavigation)
                .Include(y => y.IdDichVuNavigation)
                .OrderByDescending(y => y.NgayTao)
                .Select(y => new
                {
                    _id = y.IdYeuCau,
                    customerName = y.IdKhachHangNavigation.IdTaiKhoanNavigation.HoTen,
                    staffName = y.IdNhanVienNavigation != null ? y.IdNhanVienNavigation.IdTaiKhoanNavigation.HoTen : "Chưa có",
                    service = y.IdDichVuNavigation.TenDichVu,
                    date = y.NgayTao,
                    status = y.TrangThaiHienTai == "HoanThanh" ? "completed" : (y.TrangThaiHienTai == "DangXuLy" ? "in-progress" : "pending"),
                    total = y.ChiPhiThucTe > 0 ? y.ChiPhiThucTe : y.ChiPhiDuKien
                })
                .ToListAsync();

            return Ok(new { data = requests });
        }

        [HttpPut("rescue-requests/{id}/assign")]
        public async Task<IActionResult> AssignRequest(int id, [FromBody] AssignRequestDto dto)
        {
            var req = await _context.YeucauCuuhos.FindAsync(id);
            if (req == null) return NotFound(new { message = "Không tìm thấy yêu cầu" });

            req.IdNhanVien = dto.StaffId;
            req.TrangThaiHienTai = "DaPhanCong";

            // Tạo thông báo cho Nhân viên
            var staff = await _context.NhanvienCuuhos.FindAsync(dto.StaffId);
            if (staff != null)
            {
                var staffNotif = new Thongbao
                {
                    IdTaiKhoanNhan = staff.IdTaiKhoan,
                    TieuDe = "Phân công cứu hộ",
                    NoiDung = $"Bạn vừa được phân công một đơn cứu hộ mới (Mã: {req.IdYeuCau}). Vui lòng kiểm tra mục Đơn được giao.",
                    DaDoc = false,
                    ThoiGian = DateTime.Now,
                    Loai = "HeThong",
                    RefType = "PhanCong"
                };
                _context.Thongbaos.Add(staffNotif);
            }

            // Tạo thông báo cho Khách hàng
            var customer = await _context.Khachhangs.FindAsync(req.IdKhachHang);
            if (customer != null)
            {
                var customerNotif = new Thongbao
                {
                    IdTaiKhoanNhan = customer.IdTaiKhoan,
                    TieuDe = "Cập nhật đơn cứu hộ",
                    NoiDung = $"Đơn cứu hộ của bạn (Mã: {req.IdYeuCau}) đã được phân công cho nhân viên. Hệ thống đang tiến hành xử lý.",
                    DaDoc = false,
                    ThoiGian = DateTime.Now,
                    Loai = "HeThong",
                    RefType = "CapNhatDon"
                };
                _context.Thongbaos.Add(customerNotif);
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Phân công nhân viên thành công" });
        }

        // ==========================================
        // QUẢN LÝ KHU VỰC
        // ==========================================
        [HttpGet("areas")]
        public async Task<IActionResult> GetAreas()
        {
            var areas = await _context.PhuongXas
                .Include(p => p.IdTinhThanhNavigation)
                .Select(p => new
                {
                    _id = p.IdPhuongXa,
                    code = p.MaPhuongXa,
                    name = p.TenPhuongXa,
                    city = p.IdTinhThanhNavigation.TenTinh,
                    cityId = p.IdTinhThanhNavigation.IdTinhThanh,
                    status = "active"
                })
                .ToListAsync();
            return Ok(new { data = areas });
        }

        [HttpPost("areas")]
        public async Task<IActionResult> CreateArea([FromBody] AreaDto dto)
        {
            // Auto add city if not exist or fallback to 1
            var cityId = dto.CityId > 0 ? dto.CityId : 1;
            
            var px = new PhuongXa
            {
                IdTinhThanh = cityId,
                MaPhuongXa = dto.Code ?? "PX-NEW",
                TenPhuongXa = dto.Name
            };
            _context.PhuongXas.Add(px);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Thêm khu vực thành công" });
        }

        [HttpPut("areas/{id}")]
        public async Task<IActionResult> UpdateArea(int id, [FromBody] AreaDto dto)
        {
            var px = await _context.PhuongXas.FindAsync(id);
            if (px == null) return NotFound();

            if (!string.IsNullOrEmpty(dto.Code)) px.MaPhuongXa = dto.Code;
            px.TenPhuongXa = dto.Name;
            if (dto.CityId > 0) px.IdTinhThanh = dto.CityId;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Cập nhật khu vực thành công" });
        }

        [HttpDelete("areas/{id}")]
        public async Task<IActionResult> DeleteArea(int id)
        {
            var px = await _context.PhuongXas.FindAsync(id);
            if (px == null) return NotFound();
            
            _context.PhuongXas.Remove(px);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Đã xóa khu vực" });
        }
    }

    public class ServiceDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Category { get; set; } = string.Empty;
        public string? Icon { get; set; }
    }

    public class UserDto
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string? Specialization { get; set; }
        public string Role { get; set; } = string.Empty;
    }

    public class AssignRequestDto
    {
        public int StaffId { get; set; }
    }

    public class AreaDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Code { get; set; }
        public int CityId { get; set; }
    }
}
