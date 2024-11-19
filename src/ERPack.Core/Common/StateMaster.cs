using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;

namespace ERPack.Common
{
    public class StateMaster : FullAuditedEntity<int>, IMayHaveTenant
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int StateId { get; set; }

        [ForeignKey("Country")]
        public int CountryId { get; set; }

        [Required]
        [StringLength(50)]
        public string StateName { get; set; }

        [Required]
        [StringLength(10)]
        public string StateCode { get; set; }

        public virtual CountryMaster Country { get; set; }

        public int? TenantId { get; set; }
    }
}
