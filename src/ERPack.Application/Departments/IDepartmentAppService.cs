using Abp.Application.Services;
using ERPack.Departments.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPack.Departments
{
    public interface IDepartmentAppService : IApplicationService
    {
        Task<List<DepartmentOutput>> GetDepartmentsAsync();
        Task<int> CreateDepartmentAsync(DepartmentDto input);
        Task<DepartmentOutput> GetDepartmentByNameAsync(string name);
    }
}
