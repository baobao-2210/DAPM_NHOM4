using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class YeuCauController : ControllerBase
    {
        private readonly DataContext _context;
        public YeuCauController(DataContext context) { _context = context; }

        // UC-21: Lấy danh sách yêu cầu cứu hộ đang chờ
        [HttpGet("pending")]
        public async Task<IActionResult> GetPending()
        {
            var requests = await _context.YeucauCuuhos
                .Where(y => y.TrangThaiHienTai == "Chờ Xử Lý")
                .ToListAsync();
            return Ok(requests);
        }

        // UC-22: Nhân viên bấm nhận yêu cầu
        [HttpPost("{id}/accept")]
        public async Task<IActionResult> Accept(int id, [FromBody] int idNhanVien)
        {
            var yeuCau = await _context.YeucauCuuhos.FindAsync(id);
            if (yeuCau == null) return NotFound("Không tìm thấy yêu cầu.");

            yeuCau.IdNhanVien = idNhanVien;
            yeuCau.TrangThaiHienTai = "Đã Tiếp Nhận";
            await _context.SaveChangesAsync();
            return Ok(new { message = "Nhận cuốc thành công!" });
        }

        // UC-23: Cập nhật trạng thái (Đang đến, Đang xử lý)
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] string trangThaiMoi)
        {
            var yeuCau = await _context.YeucauCuuhos.FindAsync(id);
            if (yeuCau == null) return NotFound();

            yeuCau.TrangThaiHienTai = trangThaiMoi;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Đã cập nhật trạng thái." });
        }

        // UC-24: Hoàn thành cứu hộ
        [HttpPost("{id}/complete")]
        public async Task<IActionResult> Complete(int id, [FromBody] CompleteDto dto)
        {
            var yeuCau = await _context.YeucauCuuhos.FindAsync(id);
            if (yeuCau == null) return NotFound();

            yeuCau.TrangThaiHienTai = "Hoàn Thành";
            yeuCau.ChiPhiDuKien = dto.ChiPhiThucTe; // Tạm dùng field này nếu DB chưa có ChiPhiThucTe
            await _context.SaveChangesAsync();
            return Ok(new { message = "Đã hoàn thành!" });
        }
    }

    public class CompleteDto { public decimal ChiPhiThucTe { get; set; } public string GhiChu { get; set; } }
}