using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;

        public UploadController(IWebHostEnvironment env)
        {
            _env = env;
        }

        [HttpPost("image")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("Không có file nào được chọn.");
            }

            // Kiểm tra định dạng
            var extension = Path.GetExtension(file.FileName).ToLower();
            if (extension != ".jpg" && extension != ".jpeg" && extension != ".png")
            {
                return BadRequest("Chỉ chấp nhận file ảnh định dạng JPG, JPEG, PNG.");
            }

            // Giới hạn dung lượng (ví dụ 5MB)
            if (file.Length > 5 * 1024 * 1024)
            {
                return BadRequest("Dung lượng file không được vượt quá 5MB.");
            }

            // Tạo tên file duy nhất
            var fileName = Guid.NewGuid().ToString() + extension;
            var uploadsFolder = Path.Combine(_env.ContentRootPath, "wwwroot", "uploads");
            
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Trả về đường dẫn tương đối để lưu vào database
            var fileUrl = $"/uploads/{fileName}";

            return Ok(new { Url = fileUrl });
        }
    }
}
