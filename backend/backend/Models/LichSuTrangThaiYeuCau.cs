using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class LichSuTrangThaiYeuCau
{
    public int IdLichSu { get; set; }

    public int IdYeuCau { get; set; }

    public int? IdNhanVien { get; set; }

    public string? TrangThai { get; set; }

    public string? GhiChu { get; set; }

    public DateTime? ThoiGianCapNhat { get; set; }

    public virtual NhanvienCuuho? IdNhanVienNavigation { get; set; }

    public virtual YeucauCuuho IdYeuCauNavigation { get; set; } = null!;
}
