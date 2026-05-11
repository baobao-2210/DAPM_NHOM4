using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Danhgium
{
    public int IdDanhGia { get; set; }

    public int IdYeuCau { get; set; }

    public int IdKhachHang { get; set; }

    public int IdNhanVien { get; set; }

    public int? SoSao { get; set; }

    public string? NhanXet { get; set; }

    public DateTime? ThoiGian { get; set; }

    public virtual Khachhang IdKhachHangNavigation { get; set; } = null!;

    public virtual NhanvienCuuho IdNhanVienNavigation { get; set; } = null!;

    public virtual YeucauCuuho IdYeuCauNavigation { get; set; } = null!;
}
