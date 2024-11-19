using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;

namespace ERPack.Common
{
    public class CountryMaster : FullAuditedEntity<int>, IMayHaveTenant
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CountryId { get; set; }

        [Required]
        [StringLength(250)]
        public string CountryName { get; set; }

        [Required]
        [StringLength(10)]
        public string CountryCode { get; set; }

        public int? TenantId { get; set; }
    }
}
