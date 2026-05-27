using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Thongbao
{
    public int IdThongBao { get; set; }

    public int IdTaiKhoanNhan { get; set; }

    public string? TieuDe { get; set; }

    public string? NoiDung { get; set; }

    public string? Loai { get; set; }

    public string? RefType { get; set; }

    public int? RefId { get; set; }

    public bool? DaDoc { get; set; }

    public DateTime? ThoiGian { get; set; }

    public virtual Taikhoan IdTaiKhoanNhanNavigation { get; set; } = null!;
}
