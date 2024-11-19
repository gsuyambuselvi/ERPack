using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.ObjectMapping;
using ERPack.Departments.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ERPack.Departments
{
    [AbpAuthorize]
    public class DepartmentAppService : ERPackAppServiceBase , IDepartmentAppService
    {
        private readonly DepartmentManager _departmentManager;
        private readonly IObjectMapper _objectMapper;

        public DepartmentAppService(IRepository<Department> repository, 
            DepartmentManager departmentManager,
            IObjectMapper objectMapper)
        {
            _departmentManager = departmentManager;
            _objectMapper = objectMapper;
        }

        public  async Task<int> CreateDepartmentAsync(DepartmentDto input)
        {

            var department = ObjectMapper.Map<Department>(input);

            int departmentId =  await _departmentManager.CreateAsync(department);

            return departmentId;
        }

        public async Task<List<DepartmentOutput>> GetDepartmentsAsync()
        {
            var departments = await _departmentManager.GetAllAsync();

            var result = _objectMapper.Map<List<DepartmentOutput>>(departments);

            return result;
        }

        public async Task<DepartmentOutput> GetDepartmentByNameAsync(string name)
        {
            var department = await _departmentManager.GetByNameAsync(name);

            var result = _objectMapper.Map<DepartmentOutput>(department);

            return result;
        }

    }
}
