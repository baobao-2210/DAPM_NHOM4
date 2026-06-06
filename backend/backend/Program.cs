using backend.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// 1. Cấu hình DbContext
builder.Services.AddDbContext<DataContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
);

// 2. Cấu hình Controller
builder.Services.AddControllers();

// 3. Cấu hình JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"] ?? "ThisIsASecretKeyForJwtAuthenticationMustBeLongEnough123456!";
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
        // Hỗ trợ gửi token qua URL cho SignalR
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];
                var path = context.HttpContext.Request.Path;
                if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/notificationHub"))
                {
                    context.Token = accessToken;
                }
                return Task.CompletedTask;
            }
        };
    });
builder.Services.AddAuthorization();

// 4. Cấu hình SignalR (WebSockets)
builder.Services.AddSignalR();

// 5. Cấu hình Swagger có hỗ trợ nhập JWT Token
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "Hệ thống Cứu Hộ API", Version = "v1" });

    // Thêm nút Authorize
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Nhập token JWT vào đây. Ví dụ: 'Bearer {token}' (Chỉ cần nhập {token} nếu UI đã tự động thêm Bearer)"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

// 6. Cấu hình CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials(); // Bắt buộc cho SignalR
        });
});

var app = builder.Build();

// Tạo thư mục uploads nếu chưa có
var uploadsFolder = Path.Combine(app.Environment.ContentRootPath, "wwwroot", "uploads");
if (!Directory.Exists(uploadsFolder))
{
    Directory.CreateDirectory(uploadsFolder);
}

// Cấu hình Middleware
app.UseSwagger();
app.UseSwaggerUI();

// Cho phép truy cập file tĩnh (Uploads)
app.UseStaticFiles();

// app.UseHttpsRedirection(); // Tắt tạm thời trong lúc dev để tránh lỗi CORS khi gọi từ localhost:5173

app.UseCors("AllowReactApp");

app.UseAuthentication(); // Auth trước
app.UseAuthorization();  // Phân quyền sau

app.MapControllers();

// Map endpoint cho SignalR
app.MapHub<backend.Hubs.NotificationHub>("/notificationHub");

app.Run();