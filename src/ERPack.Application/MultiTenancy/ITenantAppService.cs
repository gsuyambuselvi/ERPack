using Abp.Application.Services;
using ERPack.MultiTenancy.Dto;
using System.Threading.Tasks;

namespace ERPack.MultiTenancy
{
    public interface ITenantAppService : IAsyncCrudAppService<TenantDto, int, PagedTenantResultRequestDto, CreateTenantDto, TenantDto>
    {
        Task<HostTenantInfo> GetHostTenantInfoAsync();
    }
}

