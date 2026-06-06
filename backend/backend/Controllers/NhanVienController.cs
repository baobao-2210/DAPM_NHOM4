using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Controllers
{
    /// <summary>
    /// UC-26: Xem lịch cứu hộ
    /// UC-27: Cập nhật thông tin cá nhân
    /// UC-28: Cập nhật dịch vụ cung cấp
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class NhanVienController : ControllerBase
    {
        private readonly DataContext _context;
        public NhanVienController(DataContext context) { _context = context; }

        // ═══════════════════════════════════════════════════════════════
        // Helper: tìm IdNhanVien từ IdTaiKhoan (dùng cho frontend sau login)
        // GET /api/NhanVien/by-taikhoan/{idTaiKhoan}
        // ═══════════════════════════════════════════════════════════════
        [HttpGet("by-taikhoan/{idTaiKhoan}")]
        public async Task<IActionResult> GetByTaiKhoan(int idTaiKhoan)
        {
            var nv = await _context.NhanvienCuuhos
                .Include(nv => nv.IdTaiKhoanNavigation)
                .FirstOrDefaultAsync(nv => nv.IdTaiKhoan == idTaiKhoan);

            if (nv == null) return NotFound(new { message = "Không tìm thấy nhân viên với tài khoản này" });

            return Ok(new
            {
                idNhanVien = nv.IdNhanVien,
                idTaiKhoan = nv.IdTaiKhoan,
                hoTen = nv.IdTaiKhoanNavigation.HoTen,
                email = nv.IdTaiKhoanNavigation.Email,
                trangThaiNhanViec = nv.TrangThaiNhanViec,
                diemTb = nv.DiemTb
            });
        }

        // ═══════════════════════════════════════════════════════════════
        // UC-26  GET /api/NhanVien/{id}/history?thang=5&nam=2025
        // Lịch cứu hộ theo tháng + thống kê tháng
        // ═══════════════════════════════════════════════════════════════
        [HttpGet("{id}/history")]
        public async Task<IActionResult> GetHistory(int id, [FromQuery] int? thang, [FromQuery] int? nam)
        {
            var now = DateTime.Now;
            int mThang = thang ?? now.Month;
            int mNam = nam ?? now.Year;

            var items = await _context.YeucauCuuhos
                .Include(y => y.IdKhachHangNavigation)
                    .ThenInclude(kh => kh.IdTaiKhoanNavigation)
                .Include(y => y.IdDichVuNavigation)
                .Include(y => y.IdPhuongXaNavigation)
                    .ThenInclude(px => px.IdTinhThanhNavigation)
                .Where(y =>
                    y.IdNhanVien == id &&
                    y.NgayTao.HasValue &&
                    y.NgayTao.Value.Month == mThang &&
                    y.NgayTao.Value.Year == mNam)
                .OrderByDescending(y => y.NgayTao)
                .Select(y => new
                {
                    id = y.IdYeuCau,
                    trangThaiHienTai = y.TrangThaiHienTai,
                    tenKhachHang = y.IdKhachHangNavigation.IdTaiKhoanNavigation.HoTen,
                    soDienThoai = y.IdKhachHangNavigation.IdTaiKhoanNavigation.SoDienThoai,
                    tenDichVu = y.IdDichVuNavigation.TenDichVu,
                    noiSuCo = y.NoiSuCo,
                    tenPhuongXa = y.IdPhuongXaNavigation.TenPhuongXa,
                    tenTinh = y.IdPhuongXaNavigation.IdTinhThanhNavigation.TenTinh,
                    ngayTao = y.NgayTao,
                    ngayHoanThanh = y.NgayHoanThanh,
                    chiPhiThucTe = y.ChiPhiThucTe
                })
                .ToListAsync();

            var thongKe = new
            {
                tongDon = items.Count,
                donHoanThanh = items.Count(x => x.trangThaiHienTai == "HoanThanh"),
                donDangXuLy = items.Count(x => x.trangThaiHienTai == "DangXuLy"),
                donDaHuy = items.Count(x => x.trangThaiHienTai == "DaHuy"),
                tongThuNhap = items
                    .Where(x => x.trangThaiHienTai == "HoanThanh")
                    .Sum(x => x.chiPhiThucTe ?? 0)
            };

            return Ok(new { lichCuuHo = items, thongKe, thang = mThang, nam = mNam });
        }

        // ═══════════════════════════════════════════════════════════════
        // UC-27  GET /api/NhanVien/{id}/profile
        // ═══════════════════════════════════════════════════════════════
        [HttpGet("{id}/profile")]
        public async Task<IActionResult> GetProfile(int id)
        {
            var nv = await _context.NhanvienCuuhos
                .Include(nv => nv.IdTaiKhoanNavigation)
                .Include(nv => nv.IdDichVus)
                    .ThenInclude(dv => dv.IdDanhMucNavigation)
                .Include(nv => nv.IdPhuongXas)
                    .ThenInclude(px => px.IdTinhThanhNavigation)
                .FirstOrDefaultAsync(nv => nv.IdNhanVien == id);

            if (nv == null) return NotFound(new { message = "Không tìm thấy nhân viên" });

            var tongHT = await _context.YeucauCuuhos
                .CountAsync(y => y.IdNhanVien == id && y.TrangThaiHienTai == "HoanThanh");

            return Ok(new
            {
                idNhanVien = nv.IdNhanVien,
                idTaiKhoan = nv.IdTaiKhoan,
                hoTen = nv.IdTaiKhoanNavigation.HoTen,
                email = nv.IdTaiKhoanNavigation.Email,
                soDienThoai = nv.IdTaiKhoanNavigation.SoDienThoai,
                ngaySinh = nv.IdTaiKhoanNavigation.NgaySinh,
                avatar = nv.IdTaiKhoanNavigation.Avatar,
                trangThaiNhanViec = nv.TrangThaiNhanViec,
                diemTb = nv.DiemTb,
                moTa = nv.MoTa,
                // Many-to-many — dùng navigation
                khuVucPhucVu = nv.IdPhuongXas.Select(px => new
                {
                    idPhuongXa = px.IdPhuongXa,
                    tenPhuongXa = px.TenPhuongXa,
                    tenTinh = px.IdTinhThanhNavigation.TenTinh
                }),
                dichVuCungCap = nv.IdDichVus.Select(dv => new
                {
                    idDichVu = dv.IdDichVu,
                    tenDichVu = dv.TenDichVu,
                    giaCoBan = dv.GiaCoBan,
                    tenDanhMuc = dv.IdDanhMucNavigation.TenDanhMuc
                }),
                thongKe = new { tongDonHoanThanh = tongHT }
            });
        }

        // ═══════════════════════════════════════════════════════════════
        // UC-27  PUT /api/NhanVien/{id}/profile
        // Body: { hoTen, soDienThoai, ngaySinh, avatar, moTa, trangThaiNhanViec }
        // ═══════════════════════════════════════════════════════════════
        [HttpPut("{id}/profile")]
        public async Task<IActionResult> UpdateProfile(int id, [FromBody] UpdateProfileDto dto)
        {
            var nv = await _context.NhanvienCuuhos
                .Include(nv => nv.IdTaiKhoanNavigation)
                .FirstOrDefaultAsync(nv => nv.IdNhanVien == id);

            if (nv == null) return NotFound(new { message = "Không tìm thấy nhân viên" });

            var tk = nv.IdTaiKhoanNavigation;

            // Kiểm tra số điện thoại không trùng với tài khoản khác
            if (!string.IsNullOrWhiteSpace(dto.SoDienThoai) && dto.SoDienThoai != tk.SoDienThoai)
            {
                bool trung = await _context.Taikhoans.AnyAsync(t =>
                    t.SoDienThoai == dto.SoDienThoai && t.IdTaiKhoan != tk.IdTaiKhoan);
                if (trung)
                    return BadRequest(new { message = "Số điện thoại đã được dùng bởi tài khoản khác" });
                tk.SoDienThoai = dto.SoDienThoai;
            }

            if (!string.IsNullOrWhiteSpace(dto.HoTen)) tk.HoTen = dto.HoTen;
            if (!string.IsNullOrWhiteSpace(dto.Avatar)) tk.Avatar = dto.Avatar;
            if (dto.NgaySinh.HasValue)
                tk.NgaySinh = DateOnly.FromDateTime(dto.NgaySinh.Value);

            if (!string.IsNullOrWhiteSpace(dto.MoTa)) nv.MoTa = dto.MoTa;
            if (dto.TrangThaiNhanViec.HasValue) nv.TrangThaiNhanViec = dto.TrangThaiNhanViec.Value;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Cập nhật thông tin thành công" });
        }

        // GET /api/NhanVien/{id}/dashboard-metrics
        [HttpGet("{id}/dashboard-metrics")]
        public async Task<IActionResult> GetDashboardMetrics(int id)
        {
            var now = DateTime.Now;
            var today = now.Date;

            // Load nv to get IdDichVus for pending requests
            var nv = await _context.NhanvienCuuhos.Include(n => n.IdDichVus).FirstOrDefaultAsync(n => n.IdNhanVien == id);
            if (nv == null) return NotFound(new { message = "Không tìm thấy nhân viên" });

            // Base queries
            var yeuCaus = _context.YeucauCuuhos.Where(y => y.IdNhanVien == id);
            
            // 1. Tổng đơn hôm nay
            int tongDonHomNay = await yeuCaus.CountAsync(y => y.NgayTao.HasValue && y.NgayTao.Value.Date == today);
            
            // 2. Đơn đang xử lý
            int donDangXuLy = await yeuCaus.CountAsync(y => y.TrangThaiHienTai == "DangXuLy");
            
            // 3. Đơn hoàn thành
            int donHoanThanh = await yeuCaus.CountAsync(y => y.TrangThaiHienTai == "HoanThanh");
            
            // 4. Thu nhập hôm nay
            decimal thuNhapHomNay = await yeuCaus
                .Where(y => y.TrangThaiHienTai == "HoanThanh" && y.NgayHoanThanh.HasValue && y.NgayHoanThanh.Value.Date == today)
                .SumAsync(y => y.ChiPhiThucTe ?? 0);
                
            // 5. Thu nhập tháng
            decimal thuNhapThang = await yeuCaus
                .Where(y => y.TrangThaiHienTai == "HoanThanh" && y.NgayHoanThanh.HasValue && y.NgayHoanThanh.Value.Month == now.Month && y.NgayHoanThanh.Value.Year == now.Year)
                .SumAsync(y => y.ChiPhiThucTe ?? 0);

            // 5.1 Tổng thu nhập
            decimal tongThuNhap = await yeuCaus
                .Where(y => y.TrangThaiHienTai == "HoanThanh")
                .SumAsync(y => y.ChiPhiThucTe ?? 0);

            // 5.2 Đơn chờ nhận
            var dichVuIds = nv.IdDichVus.Select(d => d.IdDichVu).ToList();
            int donChoNhan = await _context.YeucauCuuhos.CountAsync(y => 
                y.TrangThaiHienTai == "TiepNhan" && 
                y.IdNhanVien == null && 
                dichVuIds.Contains(y.IdDichVu));

            // 6. Đánh giá trung bình
            var danhGias = _context.Danhgia.Where(d => d.IdNhanVien == id);
            double danhGiaTrungBinh = 0;
            if (await danhGias.AnyAsync())
            {
                danhGiaTrungBinh = await danhGias.AverageAsync(d => (double)d.SoSao);
            }

            return Ok(new
            {
                tongDonHomNay,
                donChoNhan,
                donDangXuLy,
                donHoanThanh,
                thuNhapHomNay,
                thuNhapThang,
                tongThuNhap,
                danhGiaTrungBinh = Math.Round(danhGiaTrungBinh, 1)
            });
        }

        // GET /api/NhanVien/{id}/reviews
        [HttpGet("{id}/reviews")]
        public async Task<IActionResult> GetReviews(int id)
        {
            var reviews = await _context.Danhgia // <--- Đã sửa thành Danhgia (bỏ chữ s)
                .Include(d => d.IdYeuCauNavigation).ThenInclude(y => y.IdKhachHangNavigation).ThenInclude(k => k.IdTaiKhoanNavigation)
                .Include(d => d.IdYeuCauNavigation).ThenInclude(y => y.IdDichVuNavigation)
                .Where(d => d.IdNhanVien == id)  // <--- Tối ưu hóa: Lọc trực tiếp bằng IdNhanVien
                .OrderByDescending(d => d.ThoiGian)
                .Select(d => new
                {
                    id = d.IdYeuCau,
                    customerName = d.IdYeuCauNavigation.IdKhachHangNavigation.IdTaiKhoanNavigation.HoTen,
                    rating = d.SoSao,
                    date = d.ThoiGian,
                    comment = d.NhanXet,
                    service = d.IdYeuCauNavigation.IdDichVuNavigation.TenDichVu
                })
                .ToListAsync();

            return Ok(reviews);
        }

        // ═══════════════════════════════════════════════════════════════
        // UC-28  GET /api/NhanVien/{id}/services
        // Trả về tất cả dịch vụ hoạt động + danh sách đã đăng ký
        // ═══════════════════════════════════════════════════════════════
        [HttpGet("{id}/services")]
        public async Task<IActionResult> GetServices(int id)
        {
            // Tất cả dịch vụ đang hoạt động
            var tatCa = await _context.DichvuCuuhos
                .Include(dv => dv.IdDanhMucNavigation)
                .Where(dv => dv.TrangThai == "HoatDong")
                .Select(dv => new
                {
                    id = dv.IdDichVu,
                    name = dv.TenDichVu,
                    giaCoBan = dv.GiaCoBan,
                    moTa = dv.MoTa,
                    tenDanhMuc = dv.IdDanhMucNavigation.TenDanhMuc
                })
                .ToListAsync();

            // Dịch vụ nhân viên đã đăng ký — dùng navigation
            var nv = await _context.NhanvienCuuhos
                .Include(nv => nv.IdDichVus)
                .FirstOrDefaultAsync(nv => nv.IdNhanVien == id);

            var daDangKy = nv?.IdDichVus.Select(dv => dv.IdDichVu).ToList() ?? new List<int>();

            return Ok(new { tatCaDichVu = tatCa, daDangKy });
        }

        // ═══════════════════════════════════════════════════════════════
        // UC-28  PUT /api/NhanVien/{id}/services
        // Body: { "services": [1, 3, 5] }
        // ═══════════════════════════════════════════════════════════════
        [HttpPut("{id}/services")]
        public async Task<IActionResult> UpdateServices(int id, [FromBody] UpdateServicesDto dto)
        {
            if (dto.Services == null || dto.Services.Count == 0)
                return BadRequest(new { message = "Phải chọn ít nhất 1 dịch vụ" });

            // Validate dịch vụ tồn tại & đang hoạt động
            var hopLe = await _context.DichvuCuuhos
                .Where(dv => dto.Services.Contains(dv.IdDichVu) && dv.TrangThai == "HoatDong")
                .ToListAsync();

            if (hopLe.Count != dto.Services.Distinct().Count())
                return BadRequest(new { message = "Một số dịch vụ không tồn tại hoặc đã ngừng hoạt động" });

            // Cảnh báo khi đang có đơn active
            bool coActive = await _context.YeucauCuuhos.AnyAsync(y =>
                y.IdNhanVien == id && y.TrangThaiHienTai == "DangXuLy");

            // Load nhân viên với navigation many-to-many
            var nv = await _context.NhanvienCuuhos
                .Include(nv => nv.IdDichVus)
                .FirstOrDefaultAsync(nv => nv.IdNhanVien == id);

            if (nv == null) return NotFound(new { message = "Không tìm thấy nhân viên" });

            // Clear cũ, thêm mới qua navigation (EF xử lý join table)
            nv.IdDichVus.Clear();
            foreach (var dv in hopLe)
                nv.IdDichVus.Add(dv);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Cập nhật dịch vụ thành công",
                services = dto.Services,
                canhBao = coActive
                    ? "Bạn đang có đơn đang xử lý. Thay đổi sẽ áp dụng cho đơn tiếp theo."
                    : null
            });
        }
    }

    // ─── DTOs ─────────────────────────────────────────────────────────────────
    public class UpdateProfileDto
    {
        public string? HoTen { get; set; }
        public string? SoDienThoai { get; set; }
        public DateTime? NgaySinh { get; set; }
        public string? Avatar { get; set; }
        public string? MoTa { get; set; }
        public bool? TrangThaiNhanViec { get; set; }
    }

    public class UpdateServicesDto
    {
        public List<int> Services { get; set; } = new();
    }
}