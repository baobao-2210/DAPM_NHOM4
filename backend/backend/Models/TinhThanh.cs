using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class TinhThanh
{
    public int IdTinhThanh { get; set; }

    public string MaTinh { get; set; } = null!;

    public string TenTinh { get; set; } = null!;

    public virtual ICollection<PhuongXa> PhuongXas { get; set; } = new List<PhuongXa>();
}
