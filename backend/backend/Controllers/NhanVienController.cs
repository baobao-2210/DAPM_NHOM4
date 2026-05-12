using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NhanVienController : ControllerBase
    {
        private readonly DataContext _context;
        public NhanVienController(DataContext context) { _context = context; }

        // UC-26: Xem lịch sử cứu hộ của 1 nhân viên
        [HttpGet("{id}/history")]
        public async Task<IActionResult> GetHistory(int id)
        {
            var history = await _context.YeucauCuuhos
                .Where(y => y.IdNhanVien == id && y.TrangThaiHienTai == "Hoàn Thành")
                .ToListAsync();
            return Ok(history);
        }

        // UC-27: Lấy thông tin cá nhân
        [HttpGet("{id}/profile")]
        public async Task<IActionResult> GetProfile(int id)
        {
            var nv = await _context.NhanvienCuuhos.FindAsync(id);
            return Ok(nv);
        }
    }
}