using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using System.Security.Claims;

namespace backend.Controllers
{
    [Route("api/customer")]
    [ApiController]
    // [Authorize(Roles = "KhachHang, Admin")] // Mở ra khi test thật
    public class KhachhangController : ControllerBase
    {
        private readonly DataContext _context;

        public KhachhangController(DataContext context)
        {
            _context = context;
        }

        private int GetCurrentUserId()
        {
            // Trong thực tế, ID lấy từ Token JWT.
            // Tạm thời nếu test chưa có token thì hardcode ID của khách hàng số 2
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (int.TryParse(idClaim, out int id)) return id;
            return 2; // ID của "khachhang1@gmail.com" trong DB mẫu
        }

        private async Task<int> GetKhachHangId(int idTaiKhoan)
        {
            var kh = await _context.Khachhangs.FirstOrDefaultAsync(k => k.IdTaiKhoan == idTaiKhoan);
            return kh?.IdKhachHang ?? 1;
        }

        // ==========================================
        // PROFILE
        // ==========================================
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            int tkId = GetCurrentUserId();
            var kh = await _context.Khachhangs
                .Include(k => k.IdTaiKhoanNavigation)
                .Include(k => k.IdPhuongXaNavigation)
                .FirstOrDefaultAsync(k => k.IdTaiKhoan == tkId);

            if (kh == null) return NotFound();

            return Ok(new
            {
                name = kh.IdTaiKhoanNavigation.HoTen,
                email = kh.IdTaiKhoanNavigation.Email,
                phone = kh.IdTaiKhoanNavigation.SoDienThoai,
                avatar = kh.IdTaiKhoanNavigation.Avatar,
                address = kh.IdPhuongXaNavigation.TenPhuongXa
            });
        }

        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] CustomerProfileDto dto)
        {
            int tkId = GetCurrentUserId();
            var tk = await _context.Taikhoans.FindAsync(tkId);
            if (tk == null) return NotFound();

            tk.HoTen = dto.Name;
            tk.SoDienThoai = dto.Phone;
            if (!string.IsNullOrEmpty(dto.Avatar)) tk.Avatar = dto.Avatar;
            // Địa chỉ (Phường/Xã) không update trong demo này cho đơn giản

            await _context.SaveChangesAsync();
            return Ok(new { message = "Cập nhật thành công" });
        }

        // ==========================================
        // XE KHÁCH HÀNG (VEHICLES)
        // ==========================================
        [HttpGet("vehicles")]
        public async Task<IActionResult> GetVehicles()
        {
            int khId = await GetKhachHangId(GetCurrentUserId());
            var vehicles = await _context.XeKhachhangs
                .Include(x => x.IdLoaiXeNavigation)
                .Where(x => x.IdKhachHang == khId)
                .Select(x => new
                {
                    _id = x.IdXe,
                    brand = x.HangXe,
                    model = x.DongXe,
                    licensePlate = x.BienSo,
                    color = x.MauXe,
                    type = x.IdLoaiXeNavigation.TenLoaiXe
                })
                .ToListAsync();

            return Ok(new { data = vehicles });
        }

        [HttpPost("vehicles")]
        public async Task<IActionResult> CreateVehicle([FromBody] VehicleDto dto)
        {
            int khId = await GetKhachHangId(GetCurrentUserId());

            var loaiXe = await _context.LoaiXes.FirstOrDefaultAsync(l => l.TenLoaiXe == dto.Type);
            if (loaiXe == null)
            {
                loaiXe = new LoaiXe { TenLoaiXe = dto.Type ?? "Xe Máy", TrangThai = "HoatDong" };
                _context.LoaiXes.Add(loaiXe);
                await _context.SaveChangesAsync();
            }

            var xe = new XeKhachhang
            {
                IdKhachHang = khId,
                IdLoaiXe = loaiXe.IdLoaiXe,
                HangXe = dto.Brand,
                DongXe = dto.Model,
                BienSo = dto.LicensePlate,
                MauXe = dto.Color,
                NgayTao = DateTime.Now
            };

            _context.XeKhachhangs.Add(xe);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpPut("vehicles/{id}")]
        public async Task<IActionResult> UpdateVehicle(int id, [FromBody] VehicleDto dto)
        {
            var xe = await _context.XeKhachhangs.FindAsync(id);
            if (xe == null) return NotFound();

            var loaiXe = await _context.LoaiXes.FirstOrDefaultAsync(l => l.TenLoaiXe == dto.Type);
            if (loaiXe == null)
            {
                loaiXe = new LoaiXe { TenLoaiXe = dto.Type ?? "Xe Máy", TrangThai = "HoatDong" };
                _context.LoaiXes.Add(loaiXe);
                await _context.SaveChangesAsync();
            }

            xe.HangXe = dto.Brand;
            xe.DongXe = dto.Model;
            xe.BienSo = dto.LicensePlate;
            xe.MauXe = dto.Color;
            xe.IdLoaiXe = loaiXe.IdLoaiXe;

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("vehicles/{id}")]
        public async Task<IActionResult> DeleteVehicle(int id)
        {
            var xe = await _context.XeKhachhangs.FindAsync(id);
            if (xe == null) return NotFound();
            
            // Xóa thì phải check xem xe này có đang nằm trong Yêu cầu cứu hộ nào không
            bool isUsed = await _context.YeucauCuuhos.AnyAsync(y => y.IdXe == id);
            if (isUsed) return BadRequest(new { message = "Xe này đã từng gọi cứu hộ, không thể xóa trực tiếp." });

            _context.XeKhachhangs.Remove(xe);
            await _context.SaveChangesAsync();
            return Ok();
        }

        // ==========================================
        // YÊU CẦU CỨU HỘ CỦA KHÁCH HÀNG
        // ==========================================
        [HttpGet("rescue-requests")]
        public async Task<IActionResult> GetRescueRequests()
        {
            int khId = await GetKhachHangId(GetCurrentUserId());
            var requests = await _context.YeucauCuuhos
                .Include(y => y.IdDichVuNavigation)
                .Include(y => y.IdNhanVienNavigation).ThenInclude(nv => nv.IdTaiKhoanNavigation)
                .Where(y => y.IdKhachHang == khId)
                .OrderByDescending(y => y.NgayTao)
                .Select(y => new
                {
                    _id = y.IdYeuCau,
                    service = y.IdDichVuNavigation.TenDichVu,
                    date = y.NgayTao,
                    status = y.TrangThaiHienTai == "HoanThanh" ? "completed" : (y.TrangThaiHienTai == "DangXuLy" ? "in-progress" : "pending"),
                    total = y.ChiPhiThucTe > 0 ? y.ChiPhiThucTe : y.ChiPhiDuKien,
                    staff = y.IdNhanVienNavigation != null ? y.IdNhanVienNavigation.IdTaiKhoanNavigation.HoTen : "Đang tìm..."
                })
                .ToListAsync();

            return Ok(new { data = requests });
        }

        [HttpGet("rescue-requests/{id}")]
        public async Task<IActionResult> GetRescueRequestDetail(int id)
        {
            var yc = await _context.YeucauCuuhos
                .Include(y => y.IdDichVuNavigation)
                .Include(y => y.IdXeNavigation)
                .Include(y => y.IdNhanVienNavigation).ThenInclude(nv => nv.IdTaiKhoanNavigation)
                .FirstOrDefaultAsync(y => y.IdYeuCau == id);
            
            if (yc == null) return NotFound();

            var staff = yc.IdNhanVienNavigation != null ? new {
                name = yc.IdNhanVienNavigation.IdTaiKhoanNavigation.HoTen,
                phone = yc.IdNhanVienNavigation.IdTaiKhoanNavigation.SoDienThoai
            } : null;

            return Ok(new { data = new {
                _id = yc.IdYeuCau,
                service = yc.IdDichVuNavigation.TenDichVu,
                date = yc.NgayTao,
                status = yc.TrangThaiHienTai == "HoanThanh" ? "completed" : (yc.TrangThaiHienTai == "DangXuLy" ? "in-progress" : "pending"),
                total = yc.ChiPhiThucTe > 0 ? yc.ChiPhiThucTe : yc.ChiPhiDuKien,
                location = yc.NoiSuCo,
                description = yc.MoTaSuCo,
                vehicle = $"{yc.IdXeNavigation.HangXe} {yc.IdXeNavigation.DongXe} - {yc.IdXeNavigation.BienSo}",
                staff = staff
            } });
        }

        [HttpPost("rescue-requests")]
        public async Task<IActionResult> CreateRescueRequest([FromBody] RescueRequestDto dto)
        {
            int khId = await GetKhachHangId(GetCurrentUserId());
            
            var req = new YeucauCuuho
            {
                IdKhachHang = khId,
                IdXe = dto.VehicleId,
                IdDichVu = dto.ServiceId,
                IdPhuongXa = 1, // Fix cứng cho Phường Bến Nghé
                NoiSuCo = dto.Location,
                MoTaSuCo = dto.Description,
                TrangThaiHienTai = "TiepNhan",
                ChiPhiDuKien = 0,
                NgayTao = DateTime.Now
            };

            _context.YeucauCuuhos.Add(req);
            await _context.SaveChangesAsync();
            return Ok(new { data = new { _id = req.IdYeuCau } });
        }
    }

    public class CustomerProfileDto
    {
        public string Name { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string? Avatar { get; set; }
    }

    public class VehicleDto
    {
        public string Brand { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public string LicensePlate { get; set; } = string.Empty;
        public string? Color { get; set; }
        public string? Type { get; set; }
    }

    public class RescueRequestDto
    {
        public int VehicleId { get; set; }
        public int ServiceId { get; set; }
        public string Location { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }
}
