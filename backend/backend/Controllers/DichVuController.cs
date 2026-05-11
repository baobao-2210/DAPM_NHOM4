using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace QL_CUUHOXE_API.Controllers
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
                .ToListAsync();

            return Ok(list);
        } 

        // GET: api/DichVu/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var dv = await _context.DichvuCuuhos
                .Include(x => x.IdDanhMucNavigation)
                .FirstOrDefaultAsync(x => x.IdDichVu == id);

            if (dv == null) return NotFound("Không tìm thấy dịch vụ");

            return Ok(dv);
        }
    }
}