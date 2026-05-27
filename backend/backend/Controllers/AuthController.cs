using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend.Models;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(DataContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _context.Taikhoans.FirstOrDefaultAsync(u => u.Email == request.Email);
            
            // Note: In production, use BCrypt or similar for password hashing!
            // Currently using plaintext 'hash123' as per seed data or plain string comparison
            if (user == null || user.MatKhauHash != request.Password)
            {
                return Unauthorized(new { message = "Email hoặc mật khẩu không đúng" });
            }

            if (user.TrangThai != "HoatDong")
            {
                return Unauthorized(new { message = "Tài khoản của bạn đã bị khóa hoặc chưa kích hoạt" });
            }

            var token = GenerateJwtToken(user);

            return Ok(new
            {
                token,
                user = new
                {
                    _id = user.IdTaiKhoan,
                    name = user.HoTen,
                    email = user.Email,
                    phone = user.SoDienThoai,
                    role = user.VaiTro.ToLower() // "admin", "nhanvien" (staff), "khachhang" (customer)
                }
            });
        }

        [HttpPost("register-customer")]
        public async Task<IActionResult> RegisterCustomer([FromBody] RegisterCustomerRequest request)
        {
            if (await _context.Taikhoans.AnyAsync(u => u.Email == request.Email))
            {
                return BadRequest(new { message = "Email này đã được sử dụng" });
            }

            var newAccount = new Taikhoan
            {
                Email = request.Email,
                MatKhauHash = request.Password, // Remember to hash in real app
                HoTen = request.Name,
                SoDienThoai = request.Phone ?? "",
                VaiTro = "KhachHang",
                TrangThai = "HoatDong",
                NgayTao = DateTime.Now
            };

            _context.Taikhoans.Add(newAccount);
            await _context.SaveChangesAsync();

            // Create customer profile
            // Note: Currently defaulting to Id_Phuong_Xa = 1 since it's required in KhachHang table
            var customer = new Khachhang
            {
                IdTaiKhoan = newAccount.IdTaiKhoan,
                IdPhuongXa = 1 
            };
            
            _context.Khachhangs.Add(customer);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đăng ký thành công" });
        }

        private string GenerateJwtToken(Taikhoan user)
        {
            var jwtKey = _configuration["Jwt:Key"] ?? "ThisIsASecretKeyForJwtAuthenticationMustBeLongEnough123456!";
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.IdTaiKhoan.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(ClaimTypes.Role, user.VaiTro), // Admin, NhanVien, KhachHang
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(Convert.ToDouble(_configuration["Jwt:ExpireDays"] ?? "30")),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterCustomerRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Phone { get; set; }
    }
}
