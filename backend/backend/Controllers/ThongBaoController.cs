using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ThongBaoController : ControllerBase
    {
        private readonly DataContext _context;

        public ThongBaoController(DataContext context)
        {
            _context = context;
        }

        // =========================================================================
        // 1. LẤY DANH SÁCH THÔNG BÁO THEO ID TÀI KHOẢN
        // GET /api/ThongBao/tai-khoan/{idTaiKhoan}
        // =========================================================================
        [HttpGet("tai-khoan/{idTaiKhoan}")]
        public async Task<IActionResult> GetByTaiKhoan(int idTaiKhoan)
        {
            try
            {
                var list = await _context.Thongbaos
                    .Where(x => x.IdTaiKhoanNhan == idTaiKhoan)
                    .OrderByDescending(x => x.ThoiGian)
                    .Select(x => new
                    {
                        id = x.IdThongBao,
                        tieuDe = x.TieuDe,
                        noiDung = x.NoiDung,
                        type = x.Loai ?? "system", // THÊM DÒNG NÀY ĐỂ REACT HIỂN THỊ ICON
                        trangThai = x.DaDoc == true ? "DaDoc" : "ChuaDoc",
                        ngayTao = x.ThoiGian
                    })
                    .ToListAsync();

                return Ok(list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi truy vấn thông báo", error = ex.Message });
            }
        }

        // =========================================================================
        // 2. ĐÁNH DẤU MỘT THÔNG BÁO LÀ ĐÃ ĐỌC
        // PUT /api/ThongBao/{id}/read
        // =========================================================================
        [HttpPut("{id}/read")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            try
            {
                var notif = await _context.Thongbaos.FindAsync(id);
                if (notif == null)
                    return NotFound(new { message = "Không tìm thấy thông báo tương ứng" });

                // Sửa thành kiểm tra biến bool DaDoc
                if (notif.DaDoc == false || notif.DaDoc == null)
                {
                    notif.DaDoc = true;
                    await _context.SaveChangesAsync();
                }

                return Ok(new { message = "Cập nhật thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi cập nhật trạng thái đọc", error = ex.Message });
            }
        }

        // =========================================================================
        // 3. ĐÁNH DẤU TẤT CẢ THÔNG BÁO LÀ ĐÃ ĐỌC
        // PUT /api/ThongBao/read-all/{idTaiKhoan}
        // =========================================================================
        [HttpPut("read-all/{idTaiKhoan}")]
        public async Task<IActionResult> MarkAllAsRead(int idTaiKhoan)
        {
            try
            {
                var unreadList = await _context.Thongbaos
                    .Where(x => x.IdTaiKhoanNhan == idTaiKhoan && (x.DaDoc == false || x.DaDoc == null)) // Sửa thành DaDoc
                    .ToListAsync();

                foreach (var notif in unreadList)
                {
                    notif.DaDoc = true;
                }

                await _context.SaveChangesAsync();
                return Ok(new { message = "Đã đánh dấu đọc toàn bộ thông báo hệ thống" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi xử lý hàng loạt thông báo", error = ex.Message });
            }
        }

        // =========================================================================
        // 4. TẠO THÔNG BÁO MỚI (Dùng cho Admin/Hệ thống đẩy thông báo xuống)
        // POST /api/ThongBao
        // =========================================================================
        [HttpPost]
        public async Task<IActionResult> CreateThongBao([FromBody] CreateThongBaoDto dto)
        {
            if (dto == null || string.IsNullOrEmpty(dto.TieuDe) || string.IsNullOrEmpty(dto.NoiDung))
            {
                return BadRequest(new { message = "Dữ liệu JSON truyền lên không hợp lệ hoặc thiếu trường bắt buộc" });
            }

            try
            {
                var newNotif = new Thongbao
                {
                    IdTaiKhoanNhan = dto.IdTaiKhoan, // Sửa thành IdTaiKhoanNhan
                    TieuDe = dto.TieuDe,
                    NoiDung = dto.NoiDung,
                    DaDoc = false,                   // Sửa thành DaDoc kiểu bool
                    ThoiGian = DateTime.Now,         // Sửa thành ThoiGian
                    Loai = "HeThong",                // Cung cấp giá trị mặc định tránh lỗi DB
                    RefType = "ThongBao"
                };

                _context.Thongbaos.Add(newNotif);
                await _context.SaveChangesAsync();

                return Ok(newNotif);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lưu thông báo mới vào cơ sở dữ liệu", error = ex.Message });
            }
        }
    }

    // Lớp DTO nhận dữ liệu thô từ Swagger/Frontend gửi lên
    public class CreateThongBaoDto
    {
        public int IdTaiKhoan { get; set; }
        public string TieuDe { get; set; } = string.Empty;
        public string NoiDung { get; set; } = string.Empty;
    }
}