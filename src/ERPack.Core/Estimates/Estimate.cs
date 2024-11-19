using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using ERPack.Designs;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace ERPack.Estimates
{
    public class Estimate : FullAuditedEntity<long>, IMayHaveTenant
    {
        public long DesignId { get; set; }
        public string EstimateId { get; set; }
        public string Description { get; set; }

        [Precision(18, 2)]
        public decimal CGSTAmount { get; set; }
        [Precision(18, 2)]
        public decimal IGSTAmount { get; set; }
        [Precision(18, 2)]
        public decimal SGSTAmount { get; set; }
        [Precision(18, 2)]
        public decimal GrossAmount { get; set; }
        [Precision(18, 2)]
        public decimal? TotalAmount { get; set; }

        [StringLength(50)]
        public string Status { get; set; }
        public virtual int? TenantId { get; set; }
        public bool? IsEstimateApproved { get; set; }
        public bool IsKit { get; set; } = false;
        public bool IsIncludeImage { get; set; } = false;
        public bool IsIncludeMaterial { get; set; } = false;
        public virtual Design Design { get; set; }
    }
}
