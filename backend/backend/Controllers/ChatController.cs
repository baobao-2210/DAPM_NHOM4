using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Controllers
{
    /// <summary>UC-25: Nhắn tin giữa nhân viên và khách hàng</summary>
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly DataContext _context;
        public ChatController(DataContext context) { _context = context; }

        // ═══════════════════════════════════════════════════════════════
        // GET /api/Chat/{requestId}?idTaiKhoan=4
        // Lấy toàn bộ tin nhắn của yêu cầu
        // ═══════════════════════════════════════════════════════════════
        [HttpGet("{requestId}")]
        public async Task<IActionResult> GetMessages(int requestId, [FromQuery] int idTaiKhoan)
        {
            // Xác nhận quyền — chỉ KH hoặc NV của yêu cầu được xem
            var yc = await _context.YeucauCuuhos
                .Include(y => y.IdKhachHangNavigation)
                .Include(y => y.IdNhanVienNavigation)
                    .ThenInclude(nv => nv!.IdTaiKhoanNavigation)
                .FirstOrDefaultAsync(y => y.IdYeuCau == requestId);

            if (yc == null) return NotFound(new { message = "Không tìm thấy yêu cầu" });

            bool isKH = yc.IdKhachHangNavigation.IdTaiKhoan == idTaiKhoan;
            bool isNV = yc.IdNhanVienNavigation?.IdTaiKhoan == idTaiKhoan;
            if (!isKH && !isNV) return Forbid();

            var messages = await _context.Tinnhans
                .Include(t => t.IdTaiKhoanGuiNavigation)
                .Where(t => t.IdYeuCau == requestId)
                .OrderBy(t => t.ThoiGianGui)
                .Select(t => new
                {
                    id = t.IdTinNhan,
                    noiDung = t.NoiDung,
                    loai = t.Loai,
                    fileUrl = t.FileUrl,
                    thoiGianGui = t.ThoiGianGui,
                    idTaiKhoanGui = t.IdTaiKhoanGui,
                    tenNguoiGui = t.IdTaiKhoanGuiNavigation.HoTen,
                    avatarNguoiGui = t.IdTaiKhoanGuiNavigation.Avatar,
                    isMyMessage = t.IdTaiKhoanGui == idTaiKhoan
                })
                .ToListAsync();

            return Ok(messages);
        }

        // ═══════════════════════════════════════════════════════════════
        // POST /api/Chat/{requestId}/send
        // Body: { "idTaiKhoanGui": 4, "message": "..." }
        // ═══════════════════════════════════════════════════════════════
        [HttpPost("{requestId}/send")]
        public async Task<IActionResult> SendMessage(int requestId, [FromBody] SendMessageDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Message) && string.IsNullOrWhiteSpace(dto.FileUrl))
                return BadRequest(new { message = "Tin nhắn không được để trống" });

            var yc = await _context.YeucauCuuhos
                .Include(y => y.IdKhachHangNavigation)
                    .ThenInclude(kh => kh.IdTaiKhoanNavigation)
                .Include(y => y.IdNhanVienNavigation)
                    .ThenInclude(nv => nv!.IdTaiKhoanNavigation)
                .FirstOrDefaultAsync(y => y.IdYeuCau == requestId);

            if (yc == null) return NotFound(new { message = "Không tìm thấy yêu cầu" });
            if (yc.TrangThaiHienTai == "DaHuy")
                return BadRequest(new { message = "Không thể nhắn tin trong yêu cầu đã hủy" });

            bool isKH = yc.IdKhachHangNavigation.IdTaiKhoan == dto.IdTaiKhoanGui;
            bool isNV = yc.IdNhanVienNavigation?.IdTaiKhoan == dto.IdTaiKhoanGui;
            if (!isKH && !isNV) return Forbid();

            var tinNhan = new Tinnhan
            {
                IdYeuCau = requestId,
                IdTaiKhoanGui = dto.IdTaiKhoanGui,
                NoiDung = dto.Message,
                Loai = string.IsNullOrEmpty(dto.FileUrl) ? "Text" : "Image",
                FileUrl = dto.FileUrl,
                ThoiGianGui = DateTime.Now
            };
            _context.Tinnhans.Add(tinNhan);

            // Gửi thông báo cho người còn lại
            int idNguoiNhan = isKH
                ? (yc.IdNhanVienNavigation?.IdTaiKhoan ?? 0)
                : yc.IdKhachHangNavigation.IdTaiKhoan;
            string tenGui = isKH
                ? (yc.IdKhachHangNavigation.IdTaiKhoanNavigation.HoTen ?? "Khách hàng")
                : (yc.IdNhanVienNavigation?.IdTaiKhoanNavigation?.HoTen ?? "Nhân viên");

            if (idNguoiNhan > 0)
            {
                _context.Thongbaos.Add(new Thongbao
                {
                    IdTaiKhoanNhan = idNguoiNhan,
                    TieuDe = $"Tin nhắn từ {tenGui}",
                    NoiDung = dto.Message != null && dto.Message.Length > 60
                               ? dto.Message[..60] + "..." : dto.Message,
                    Loai = "TinNhan",
                    RefType = "YeuCau",
                    ThoiGian = DateTime.Now
                });
            }

            await _context.SaveChangesAsync();

            // Trả về tin nhắn vừa gửi cùng tên người gửi
            var nguoiGui = await _context.Taikhoans.FindAsync(dto.IdTaiKhoanGui);
            return Ok(new
            {
                id = tinNhan.IdTinNhan,
                noiDung = tinNhan.NoiDung,
                loai = tinNhan.Loai,
                fileUrl = tinNhan.FileUrl,
                thoiGianGui = tinNhan.ThoiGianGui,
                idTaiKhoanGui = tinNhan.IdTaiKhoanGui,
                tenNguoiGui = nguoiGui?.HoTen,
                avatarNguoiGui = nguoiGui?.Avatar,
                isMyMessage = true
            });
        }
    }

    public class SendMessageDto
    {
        public int IdTaiKhoanGui { get; set; }
        public string? Message { get; set; }
        public string? FileUrl { get; set; }
    }
}