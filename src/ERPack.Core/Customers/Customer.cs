using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ERPack.Customers
{
    public class Customer : FullAuditedEntity<long>, IMayHaveTenant
    {
        [Required]
        public string CustomerId { get; set; }
        [Required]
        public string Name { get; set; }

        public string Address1 { get; set; }
        public string Address2 { get; set; }
        [StringLength(170)]
        public string City { get; set; }
        [StringLength(50)]
        public string State { get; set; }
        [StringLength(10)]
        public string PinCode { get; set; }
        [StringLength(100)]
        public string Country { get; set; }
        [StringLength(15)]
        public string Mobile { get; set; }
        [StringLength(100)]
        public string ContactPerson { get; set; }
        [StringLength(100)]
        public string Designation { get; set; }
        [StringLength(20)]
        public string PAN { get; set; }
        [StringLength(20)]
        public string GSTNo { get; set; }
        [StringLength(100)]
        public string EmailAddress { get; set; }
        [StringLength(100)]
        public string Website { get; set; }
        [StringLength(15)]
        public string ContactNo { get; set; }
        [StringLength(100)]
        public string Industry { get; set; }
        public int CategoryId { get; set; }
        public string Image { get; set; }
        public int? TenantId { get; set; }
    }
}
