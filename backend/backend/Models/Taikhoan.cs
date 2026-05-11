using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Taikhoan
{
    public int IdTaiKhoan { get; set; }

    public string? IdCccd { get; set; }

    public string Email { get; set; } = null!;

    public string MatKhauHash { get; set; } = null!;

    public string SoDienThoai { get; set; } = null!;

    public string VaiTro { get; set; } = null!;

    public string TrangThai { get; set; } = null!;

    public DateTime? NgayTao { get; set; }

    public DateTime? LanDangNhapCuoi { get; set; }

    public string? HoTen { get; set; }

    public DateOnly? NgaySinh { get; set; }

    public string? Avatar { get; set; }

    public virtual ICollection<HosoDangkyNhanvien> HosoDangkyNhanviens { get; set; } = new List<HosoDangkyNhanvien>();

    public virtual Cccd? IdCccdNavigation { get; set; }

    public virtual ICollection<Khachhang> Khachhangs { get; set; } = new List<Khachhang>();

    public virtual ICollection<NhanvienCuuho> NhanvienCuuhos { get; set; } = new List<NhanvienCuuho>();

    public virtual ICollection<Thongbao> Thongbaos { get; set; } = new List<Thongbao>();

    public virtual ICollection<Tinnhan> Tinnhans { get; set; } = new List<Tinnhan>();
}
