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
}
