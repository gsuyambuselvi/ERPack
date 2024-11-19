using Abp.Application.Services;
using Abp.Application.Services.Dto;
using ERPack.Customers.Dto;
using ERPack.Departments.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPack.Customers
{
    public interface ICustomerAppService : IApplicationService
    {
        Task<(long, string)> CreateAsync(CustomerDto input);
        Task<(CustomerDto, string)> UpdateAsync(CustomerDto input);
        Task<CustomerDto> GetAsync(long cusotmerId);
        Task<CustomerDto> GetByIdAsync(long cusotmerId);
        Task<PagedResultDto<CustomerDto>> GetCustomersListAsync();
        Task DeleteAsync(EntityDto<long> input);
        Task<List<CustomerNameOutput>> GetCustomersNamesAsync(string name);
        Task<long> CreateCustomerMaterialPriceAsync(CustomerMaterialPriceDto input);
        Task<List<CustomerMaterialPriceDto>> GetCustomerMaterialPricesAsync(long customerId);
        Task DeleteCustomerMaterialPriceAsync(EntityDto<long> input);
    }
}
