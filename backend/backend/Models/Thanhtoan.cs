using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Thanhtoan
{
    public int IdThanhToan { get; set; }

    public int IdYeuCau { get; set; }

    public decimal? SoTien { get; set; }

    public string? PhuongThuc { get; set; }

    public string? TrangThai { get; set; }

    public string? MaGiaoDich { get; set; }

    public string? LoaiGiaoDich { get; set; }

    public DateTime? ThoiGian { get; set; }

    public virtual YeucauCuuho IdYeuCauNavigation { get; set; } = null!;
}
