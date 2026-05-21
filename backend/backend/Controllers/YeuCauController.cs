using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Controllers
{
    /// <summary>
    /// UC-21: Danh sách yêu cầu chờ
    /// UC-22: Nhận/xác nhận yêu cầu
    /// UC-23: Cập nhật sub-trạng thái (DangDen / DangSua / DangKiemTra)
    /// UC-24: Hoàn thành cứu hộ
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class YeuCauController : ControllerBase
    {
        private readonly DataContext _context;
        public YeuCauController(DataContext context) { _context = context; }

        // ═══════════════════════════════════════════════════════════════
        // UC-21  GET /api/YeuCau/pending?staffId=3
        // Trả về đơn TiepNhan phù hợp dịch vụ & khu vực của nhân viên
        // ═══════════════════════════════════════════════════════════════
        [HttpGet("pending")]
        public async Task<IActionResult> GetPending([FromQuery] int staffId)
        {
            if (staffId <= 0)
                return BadRequest(new { message = "staffId không hợp lệ" });

            // Many-to-many: dùng navigation property trên NhanvienCuuho
            var nhanVien = await _context.NhanvienCuuhos
                .Include(nv => nv.IdDichVus)
                .Include(nv => nv.IdPhuongXas)
                .FirstOrDefaultAsync(nv => nv.IdNhanVien == staffId);

            if (nhanVien == null)
                return NotFound(new { message = "Không tìm thấy nhân viên" });

            var dichVuIds = nhanVien.IdDichVus.Select(d => d.IdDichVu).ToList();
            var phuongXaIds = nhanVien.IdPhuongXas.Select(p => p.IdPhuongXa).ToList();

            var list = await _context.YeucauCuuhos
                .Include(y => y.IdKhachHangNavigation)
                    .ThenInclude(kh => kh.IdTaiKhoanNavigation)
                .Include(y => y.IdXeNavigation)
                    .ThenInclude(xe => xe.IdLoaiXeNavigation)
                .Include(y => y.IdDichVuNavigation)
                    .ThenInclude(dv => dv.IdDanhMucNavigation)
                .Include(y => y.IdPhuongXaNavigation)
                    .ThenInclude(px => px.IdTinhThanhNavigation)
                .Where(y =>
                    y.TrangThaiHienTai == "TiepNhan" &&
                    y.IdNhanVien == null &&
                    dichVuIds.Contains(y.IdDichVu) &&
                    phuongXaIds.Contains(y.IdPhuongXa))
                .OrderByDescending(y => y.NgayTao)
                .Select(y => new
                {
                    id = y.IdYeuCau,
                    trangThaiHienTai = y.TrangThaiHienTai,
                    moTaSuCo = y.MoTaSuCo,
                    noiSuCo = y.NoiSuCo,
                    ngayTao = y.NgayTao,
                    chiPhiDuKien = y.ChiPhiDuKien,
                    // Khách hàng
                    tenKhachHang = y.IdKhachHangNavigation.IdTaiKhoanNavigation.HoTen,
                    soDienThoai = y.IdKhachHangNavigation.IdTaiKhoanNavigation.SoDienThoai,
                    avatarKhachHang = y.IdKhachHangNavigation.IdTaiKhoanNavigation.Avatar,
                    idTaiKhoanKhachHang = y.IdKhachHangNavigation.IdTaiKhoan,
                    // Xe
                    bienSo = y.IdXeNavigation.BienSo,
                    hangXe = y.IdXeNavigation.HangXe,
                    dongXe = y.IdXeNavigation.DongXe,
                    mauXe = y.IdXeNavigation.MauXe,
                    tenLoaiXe = y.IdXeNavigation.IdLoaiXeNavigation.TenLoaiXe,
                    // Dịch vụ
                    tenDichVu = y.IdDichVuNavigation.TenDichVu,
                    tenDanhMuc = y.IdDichVuNavigation.IdDanhMucNavigation.TenDanhMuc,
                    giaCoBan = y.IdDichVuNavigation.GiaCoBan,
                    // Khu vực
                    tenPhuongXa = y.IdPhuongXaNavigation.TenPhuongXa,
                    tenTinh = y.IdPhuongXaNavigation.IdTinhThanhNavigation.TenTinh,
                    kinhDo = y.IdPhuongXaNavigation.KinhDo,
                    viDo = y.IdPhuongXaNavigation.ViDo
                })
                .ToListAsync();

            return Ok(list);
        }

        // ═══════════════════════════════════════════════════════════════
        // GET /api/YeuCau/active-task/{staffId}
        // Đơn đang xử lý (DangXuLy) của nhân viên + sub-status mới nhất
        // ═══════════════════════════════════════════════════════════════
        [HttpGet("active-task/{staffId}")]
        public async Task<IActionResult> GetActiveTask(int staffId)
        {
            var yc = await _context.YeucauCuuhos
                .Include(y => y.IdKhachHangNavigation)
                    .ThenInclude(kh => kh.IdTaiKhoanNavigation)
                .Include(y => y.IdXeNavigation)
                    .ThenInclude(xe => xe.IdLoaiXeNavigation)
                .Include(y => y.IdDichVuNavigation)
                    .ThenInclude(dv => dv.IdDanhMucNavigation)
                .Include(y => y.IdPhuongXaNavigation)
                    .ThenInclude(px => px.IdTinhThanhNavigation)
                .Where(y => y.IdNhanVien == staffId && y.TrangThaiHienTai == "DangXuLy")
                .OrderByDescending(y => y.NgayTao)
                .FirstOrDefaultAsync();

            if (yc == null) return Ok(null);

            // Sub-status mới nhất từ lịch sử
            var subStatus = await _context.LichSuTrangThaiYeuCaus
                .Where(ls => ls.IdYeuCau == yc.IdYeuCau)
                .OrderByDescending(ls => ls.ThoiGianCapNhat)
                .Select(ls => ls.TrangThai)
                .FirstOrDefaultAsync();

            return Ok(new
            {
                id = yc.IdYeuCau,
                trangThaiHienTai = yc.TrangThaiHienTai,
                subStatus,
                moTaSuCo = yc.MoTaSuCo,
                noiSuCo = yc.NoiSuCo,
                ngayTao = yc.NgayTao,
                chiPhiDuKien = yc.ChiPhiDuKien,
                phiDichVu = yc.PhiDichVu,
                tenKhachHang = yc.IdKhachHangNavigation.IdTaiKhoanNavigation.HoTen,
                soDienThoai = yc.IdKhachHangNavigation.IdTaiKhoanNavigation.SoDienThoai,
                avatarKhachHang = yc.IdKhachHangNavigation.IdTaiKhoanNavigation.Avatar,
                idTaiKhoanKhachHang = yc.IdKhachHangNavigation.IdTaiKhoan,
                bienSo = yc.IdXeNavigation.BienSo,
                hangXe = yc.IdXeNavigation.HangXe,
                dongXe = yc.IdXeNavigation.DongXe,
                mauXe = yc.IdXeNavigation.MauXe,
                tenLoaiXe = yc.IdXeNavigation.IdLoaiXeNavigation.TenLoaiXe,
                tenDichVu = yc.IdDichVuNavigation.TenDichVu,
                tenDanhMuc = yc.IdDichVuNavigation.IdDanhMucNavigation.TenDanhMuc,
                giaCoBan = yc.IdDichVuNavigation.GiaCoBan,
                tenPhuongXa = yc.IdPhuongXaNavigation.TenPhuongXa,
                tenTinh = yc.IdPhuongXaNavigation.IdTinhThanhNavigation.TenTinh,
                kinhDo = yc.IdPhuongXaNavigation.KinhDo,
                viDo = yc.IdPhuongXaNavigation.ViDo
            });
        }

        // ═══════════════════════════════════════════════════════════════
        // GET /api/YeuCau/{id}/detail?staffId=3
        // Chi tiết 1 yêu cầu kèm lịch sử trạng thái & đánh giá
        // ═══════════════════════════════════════════════════════════════
        [HttpGet("{id}/detail")]
        public async Task<IActionResult> GetDetail(int id, [FromQuery] int staffId)
        {
            var yc = await _context.YeucauCuuhos
                .Include(y => y.IdKhachHangNavigation)
                    .ThenInclude(kh => kh.IdTaiKhoanNavigation)
                .Include(y => y.IdXeNavigation)
                    .ThenInclude(xe => xe.IdLoaiXeNavigation)
                .Include(y => y.IdDichVuNavigation)
                    .ThenInclude(dv => dv.IdDanhMucNavigation)
                .Include(y => y.IdPhuongXaNavigation)
                    .ThenInclude(px => px.IdTinhThanhNavigation)
                .FirstOrDefaultAsync(y => y.IdYeuCau == id);

            if (yc == null) return NotFound(new { message = "Không tìm thấy yêu cầu" });

            // Chỉ NV được gán hoặc đơn đang chờ được xem
            bool isAssigned = yc.IdNhanVien == staffId;
            bool isPending = yc.TrangThaiHienTai == "TiepNhan" && yc.IdNhanVien == null;
            if (!isAssigned && !isPending && staffId > 0)
                return Forbid();

            // Lịch sử trạng thái
            var lichSu = await _context.LichSuTrangThaiYeuCaus
                .Where(ls => ls.IdYeuCau == id)
                .OrderBy(ls => ls.ThoiGianCapNhat)
                .Select(ls => new
                {
                    ls.IdLichSu,
                    ls.TrangThai,
                    ls.GhiChu,
                    ls.ThoiGianCapNhat
                })
                .ToListAsync();

            // Sub-status hiện tại
            var lastSubStatus = lichSu.LastOrDefault()?.TrangThai;

            // Đánh giá từ khách hàng
            var danhGia = await _context.Danhgia
                .Where(dg => dg.IdYeuCau == id)
                .Select(dg => new { dg.SoSao, dg.NhanXet, dg.ThoiGian })
                .FirstOrDefaultAsync();

            return Ok(new
            {
                id = yc.IdYeuCau,
                trangThaiHienTai = yc.TrangThaiHienTai,
                subStatus = lastSubStatus,
                moTaSuCo = yc.MoTaSuCo,
                noiSuCo = yc.NoiSuCo,
                ngayTao = yc.NgayTao,
                ngayHoanThanh = yc.NgayHoanThanh,
                lyDoHuy = yc.LyDoHuy,
                chiPhiDuKien = yc.ChiPhiDuKien,
                chiPhiThucTe = yc.ChiPhiThucTe,
                phiDichVu = yc.PhiDichVu,
                tenKhachHang = yc.IdKhachHangNavigation.IdTaiKhoanNavigation.HoTen,
                soDienThoai = yc.IdKhachHangNavigation.IdTaiKhoanNavigation.SoDienThoai,
                avatarKhachHang = yc.IdKhachHangNavigation.IdTaiKhoanNavigation.Avatar,
                idTaiKhoanKhachHang = yc.IdKhachHangNavigation.IdTaiKhoan,
                bienSo = yc.IdXeNavigation.BienSo,
                hangXe = yc.IdXeNavigation.HangXe,
                dongXe = yc.IdXeNavigation.DongXe,
                mauXe = yc.IdXeNavigation.MauXe,
                tenLoaiXe = yc.IdXeNavigation.IdLoaiXeNavigation.TenLoaiXe,
                tenDichVu = yc.IdDichVuNavigation.TenDichVu,
                tenDanhMuc = yc.IdDichVuNavigation.IdDanhMucNavigation.TenDanhMuc,
                giaCoBan = yc.IdDichVuNavigation.GiaCoBan,
                tenPhuongXa = yc.IdPhuongXaNavigation.TenPhuongXa,
                tenTinh = yc.IdPhuongXaNavigation.IdTinhThanhNavigation.TenTinh,
                kinhDo = yc.IdPhuongXaNavigation.KinhDo,
                viDo = yc.IdPhuongXaNavigation.ViDo,
                lichSuTrangThai = lichSu,
                danhGia
            });
        }

        // ═══════════════════════════════════════════════════════════════
        // UC-22  POST /api/YeuCau/{id}/accept
        // Body: { "idNhanVien": 3 }
        // ═══════════════════════════════════════════════════════════════
        [HttpPost("{id}/accept")]
        public async Task<IActionResult> Accept(int id, [FromBody] AcceptDto dto)
        {
            // --- Lấy yêu cầu ---
            var yc = await _context.YeucauCuuhos
                .Include(y => y.IdKhachHangNavigation)
                    .ThenInclude(kh => kh.IdTaiKhoanNavigation)
                .FirstOrDefaultAsync(y => y.IdYeuCau == id);

            if (yc == null) return NotFound(new { message = "Không tìm thấy yêu cầu" });

            // --- Kiểm tra trạng thái ---
            if (yc.TrangThaiHienTai != "TiepNhan")
                return BadRequest(new { message = "Yêu cầu không còn ở trạng thái chờ nhận" });

            if (yc.IdNhanVien != null)
                return BadRequest(new { message = "Yêu cầu này đã có nhân viên khác nhận rồi" });

            // --- Kiểm tra nhân viên có kỹ năng & khu vực phù hợp ---
            var nhanVien = await _context.NhanvienCuuhos
                .Include(nv => nv.IdTaiKhoanNavigation)
                .Include(nv => nv.IdDichVus)
                .Include(nv => nv.IdPhuongXas)
                .FirstOrDefaultAsync(nv => nv.IdNhanVien == dto.IdNhanVien);

            if (nhanVien == null)
                return NotFound(new { message = "Không tìm thấy thông tin nhân viên" });

            bool coKyNang = nhanVien.IdDichVus.Any(d => d.IdDichVu == yc.IdDichVu);
            if (!coKyNang)
                return BadRequest(new { message = "Bạn không cung cấp dịch vụ phù hợp với yêu cầu này" });

            bool coKhuVuc = nhanVien.IdPhuongXas.Any(p => p.IdPhuongXa == yc.IdPhuongXa);
            if (!coKhuVuc)
                return BadRequest(new { message = "Khu vực sự cố nằm ngoài vùng phục vụ của bạn" });

            // --- Gán nhân viên + đổi trạng thái (trigger trg_UpdateTrangThaiYeuCau tự ghi lịch sử) ---
            yc.IdNhanVien = dto.IdNhanVien;
            yc.TrangThaiHienTai = "DangXuLy";

            // --- Thông báo khách hàng ---
            var tenNV = nhanVien.IdTaiKhoanNavigation?.HoTen ?? "Nhân viên cứu hộ";
            _context.Thongbaos.Add(new Thongbao
            {
                IdTaiKhoanNhan = yc.IdKhachHangNavigation.IdTaiKhoan,
                TieuDe = "Đã có nhân viên nhận đơn",
                NoiDung = $"Nhân viên {tenNV} đã nhận yêu cầu cứu hộ và đang di chuyển đến vị trí của bạn.",
                Loai = "CongViec",
                RefType = "YeuCau",
                ThoiGian = DateTime.Now
            });

            await _context.SaveChangesAsync();
            return Ok(new { message = "Nhận yêu cầu thành công!", idYeuCau = id });
        }

        // ═══════════════════════════════════════════════════════════════
        // UC-23  PUT /api/YeuCau/{id}/status
        // Body: { "idNhanVien": 3, "trangThai": "DangDen", "ghiChu": "..." }
        // Ghi sub-status vào LICH_SU, KHÔNG đổi TrangThaiHienTai chính
        // ═══════════════════════════════════════════════════════════════
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusDto dto)
        {
            var validStatus = new[] { "DangDen", "DangSua", "DangKiemTra" };
            if (!validStatus.Contains(dto.TrangThai))
                return BadRequest(new { message = "Chỉ chấp nhận: DangDen | DangSua | DangKiemTra" });

            var yc = await _context.YeucauCuuhos
                .Include(y => y.IdKhachHangNavigation)
                    .ThenInclude(kh => kh.IdTaiKhoanNavigation)
                .FirstOrDefaultAsync(y => y.IdYeuCau == id);

            if (yc == null) return NotFound(new { message = "Không tìm thấy yêu cầu" });
            if (yc.IdNhanVien != dto.IdNhanVien)
                return Forbid();
            if (yc.TrangThaiHienTai != "DangXuLy")
                return BadRequest(new { message = "Chỉ cập nhật khi đơn đang ở trạng thái DangXuLy" });

            // Ghi lịch sử sub-status
            _context.LichSuTrangThaiYeuCaus.Add(new LichSuTrangThaiYeuCau
            {
                IdYeuCau = id,
                IdNhanVien = dto.IdNhanVien,
                TrangThai = dto.TrangThai,
                GhiChu = dto.GhiChu ?? $"Cập nhật: {dto.TrangThai}",
                ThoiGianCapNhat = DateTime.Now
            });

            // Thông báo khách hàng
            var noiDungTB = dto.TrangThai switch
            {
                "DangDen" => "Nhân viên đang trên đường đến vị trí của bạn.",
                "DangSua" => "Nhân viên đang tiến hành sửa chữa / cứu hộ.",
                "DangKiemTra" => "Nhân viên đang kiểm tra và chuẩn bị hoàn thành.",
                _ => "Trạng thái cứu hộ đã được cập nhật."
            };
            _context.Thongbaos.Add(new Thongbao
            {
                IdTaiKhoanNhan = yc.IdKhachHangNavigation.IdTaiKhoan,
                TieuDe = "Cập nhật tiến trình cứu hộ",
                NoiDung = noiDungTB,
                Loai = "CongViec",
                RefType = "YeuCau",
                ThoiGian = DateTime.Now
            });

            await _context.SaveChangesAsync();
            return Ok(new { message = "Cập nhật thành công", trangThai = dto.TrangThai });
        }

        // ═══════════════════════════════════════════════════════════════
        // UC-24  POST /api/YeuCau/{id}/complete
        // Body: { "idNhanVien": 3, "chiPhiThucTe": 350000, "ghiChu": "..." }
        // ═══════════════════════════════════════════════════════════════
        [HttpPost("{id}/complete")]
        public async Task<IActionResult> Complete(int id, [FromBody] CompleteDto dto)
        {
            if (dto.ChiPhiThucTe < 0)
                return BadRequest(new { message = "Chi phí thực tế không được âm" });

            var yc = await _context.YeucauCuuhos
                .Include(y => y.IdKhachHangNavigation)
                    .ThenInclude(kh => kh.IdTaiKhoanNavigation)
                .FirstOrDefaultAsync(y => y.IdYeuCau == id);

            if (yc == null) return NotFound(new { message = "Không tìm thấy yêu cầu" });
            if (yc.IdNhanVien != dto.IdNhanVien) return Forbid();
            if (yc.TrangThaiHienTai != "DangXuLy")
                return BadRequest(new { message = "Chỉ hoàn thành được khi đơn đang xử lý" });

            // Cập nhật — trigger trg_UpdateTrangThaiYeuCau sẽ tự ghi lịch sử HoanThanh
            yc.TrangThaiHienTai = "HoanThanh";
            yc.ChiPhiThucTe = dto.ChiPhiThucTe;
            yc.NgayHoanThanh = DateTime.Now;

            // Thông báo khách hàng thanh toán + đánh giá
            _context.Thongbaos.Add(new Thongbao
            {
                IdTaiKhoanNhan = yc.IdKhachHangNavigation.IdTaiKhoan,
                TieuDe = "Cứu hộ hoàn thành! 🎉",
                NoiDung = $"Dịch vụ đã hoàn thành. Chi phí thực tế: {dto.ChiPhiThucTe:N0} đ. Vui lòng thanh toán và đánh giá.",
                Loai = "CongViec",
                RefType = "YeuCau",
                ThoiGian = DateTime.Now
            });

            await _context.SaveChangesAsync();
            return Ok(new
            {
                message = "Hoàn thành thành công!",
                idYeuCau = id,
                chiPhiThucTe = dto.ChiPhiThucTe,
                ngayHoanThanh = yc.NgayHoanThanh
            });
        }
    }

    // ─── DTOs ──────────────────────────────────────────────────────────────────
    public class AcceptDto
    {
        public int IdNhanVien { get; set; }
    }

    public class UpdateStatusDto
    {
        public int IdNhanVien { get; set; }
        /// <summary>DangDen | DangSua | DangKiemTra</summary>
        public string TrangThai { get; set; } = string.Empty;
        public string? GhiChu { get; set; }
    }

    public class CompleteDto
    {
        public int IdNhanVien { get; set; }
        public decimal ChiPhiThucTe { get; set; }
        public string? GhiChu { get; set; }
    }
}