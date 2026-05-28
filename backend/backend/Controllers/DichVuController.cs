using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DichVuController : ControllerBase
    {
        private readonly DataContext _context;

        public DichVuController(DataContext context)
        {
            _context = context;
        }

        // GET: api/DichVu
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _context.DichvuCuuhos
                .Include(x => x.IdDanhMucNavigation)
                .Where(x => x.TrangThai == "HoatDong")
                .Select(d => new
                {
                    _id = d.IdDichVu,
                    name = d.TenDichVu,
                    description = d.MoTa,
                    price = d.GiaCoBan,
                    category = d.IdDanhMucNavigation.TenDanhMuc,
                    icon = "🔧" // Default icon for all services
                })
                .ToListAsync();

            return Ok(list);
        } 

        // GET: api/DichVu/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var d = await _context.DichvuCuuhos
                .Include(x => x.IdDanhMucNavigation)
                .Where(x => x.TrangThai == "HoatDong")
                .FirstOrDefaultAsync(x => x.IdDichVu == id);

            if (d == null) return NotFound("Không tìm thấy dịch vụ");

            return Ok(new
            {
                _id = d.IdDichVu,
                name = d.TenDichVu,
                description = d.MoTa,
                price = d.GiaCoBan,
                category = d.IdDanhMucNavigation.TenDanhMuc,
                icon = "🔧"
            });
        }

        // POST: api/DichVu
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ServiceCreateDto dto)
        {
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

            return Ok(new { message = "Thêm dịch vụ thành công", id = dv.IdDichVu });
        }

        // PUT: api/DichVu/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ServiceCreateDto dto)
        {
            var dv = await _context.DichvuCuuhos.FindAsync(id);
            if (dv == null) return NotFound("Không tìm thấy dịch vụ");

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
            return Ok(new { message = "Cập nhật dịch vụ thành công" });
        }

        // DELETE: api/DichVu/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var dv = await _context.DichvuCuuhos.FindAsync(id);
            if (dv == null) return NotFound("Không tìm thấy dịch vụ");
            
            dv.TrangThai = "NgungHoatDong";
            await _context.SaveChangesAsync();
            return Ok(new { message = "Đã vô hiệu hóa dịch vụ" });
        }
    }

    public class ServiceCreateDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Category { get; set; } = string.Empty;
    }
}