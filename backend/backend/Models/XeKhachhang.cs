using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class XeKhachhang
{
    public int IdXe { get; set; }

    public int IdKhachHang { get; set; }

    public int IdLoaiXe { get; set; }

    public string BienSo { get; set; } = null!;

    public string? HangXe { get; set; }

    public string? DongXe { get; set; }

    public string? MauXe { get; set; }

    public string? GhiChu { get; set; }

    public DateTime? NgayTao { get; set; }

    public virtual Khachhang IdKhachHangNavigation { get; set; } = null!;

    public virtual LoaiXe IdLoaiXeNavigation { get; set; } = null!;

    public virtual ICollection<YeucauCuuho> YeucauCuuhos { get; set; } = new List<YeucauCuuho>();
}
