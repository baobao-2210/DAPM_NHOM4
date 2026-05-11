using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Tinnhan
{
    public int IdTinNhan { get; set; }

    public int IdYeuCau { get; set; }

    public int IdTaiKhoanGui { get; set; }

    public string? NoiDung { get; set; }

    public string? Loai { get; set; }

    public string? FileUrl { get; set; }

    public DateTime? ThoiGianGui { get; set; }

    public virtual Taikhoan IdTaiKhoanGuiNavigation { get; set; } = null!;

    public virtual YeucauCuuho IdYeuCauNavigation { get; set; } = null!;
}
