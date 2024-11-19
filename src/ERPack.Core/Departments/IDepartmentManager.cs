using Abp.Domain.Services;
using System;
using System.Collections.Generic;
using System.Drawing.Drawing2D;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPack.Departments
{
    public interface IDepartmentManager : IDomainService
    {
        Task<Department> GetAsync(int id);
        Task<int> CreateAsync(Department @event);
        void Cancel(Department @event);
        Task<List<Department>> GetAllAsync();
        Task<Department> GetByNameAsync(string name);
    }
}
