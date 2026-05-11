using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Khieunai
{
    public int IdKhieuNai { get; set; }

    public int IdYeuCau { get; set; }

    public int IdKhachHang { get; set; }

    public int? IdNhanVien { get; set; }

    public string? LoaiKhieuNai { get; set; }

    public string? NoiDung { get; set; }

    public string? TrangThai { get; set; }

    public string? KetQuaXuLy { get; set; }

    public DateTime? ThoiGianTao { get; set; }

    public DateTime? ThoiGianCapNhat { get; set; }

    public virtual Khachhang IdKhachHangNavigation { get; set; } = null!;

    public virtual NhanvienCuuho? IdNhanVienNavigation { get; set; }

    public virtual YeucauCuuho IdYeuCauNavigation { get; set; } = null!;
}
