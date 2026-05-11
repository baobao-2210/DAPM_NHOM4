using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class LoaiXe
{
    public int IdLoaiXe { get; set; }

    public string TenLoaiXe { get; set; } = null!;

    public string? MoTa { get; set; }

    public string? TrangThai { get; set; }

    public virtual ICollection<XeKhachhang> XeKhachhangs { get; set; } = new List<XeKhachhang>();
}
