using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class DanhmucDichvu
{
    public int IdDanhMuc { get; set; }

    public string TenDanhMuc { get; set; } = null!;

    public string? MoTa { get; set; }

    public string? TrangThai { get; set; }

    public virtual ICollection<DichvuCuuho> DichvuCuuhos { get; set; } = new List<DichvuCuuho>();
}
