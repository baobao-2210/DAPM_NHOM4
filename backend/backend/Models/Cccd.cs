using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Cccd
{
    public string IdCccd { get; set; } = null!;

    public DateOnly? NgayCap { get; set; }

    public string? NoiCap { get; set; }

    public string? TrangThaiXacMinh { get; set; }

    public virtual ICollection<Taikhoan> Taikhoans { get; set; } = new List<Taikhoan>();
}
