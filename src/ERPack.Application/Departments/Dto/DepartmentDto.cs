using Abp.AutoMapper;
using Abp.Runtime.Validation;
using ERPack.Authorization.Users;


namespace ERPack.Departments.Dto
{
    [AutoMapTo(typeof(Department))]
    public class DepartmentDto
    {
        public string DeptName { get; set; }
        public int? TenantId { get; set; }
        public virtual long? CreatorUserId { get; set; }
    }
}
