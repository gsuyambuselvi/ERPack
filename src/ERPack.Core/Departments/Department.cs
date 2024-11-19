using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPack.Departments
{
    public class Department : FullAuditedEntity<int> , IMayHaveTenant
    {
        public string DeptName { get; set; }
        public virtual int? TenantId { get; set; }
    }
}
