using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.IdentityFramework;
using Abp.Linq.Extensions;
using Abp.MultiTenancy;
using Abp.Runtime.Security;
using DocumentFormat.OpenXml.Wordprocessing;
using ERPack.Authorization;
using ERPack.Authorization.Roles;
using ERPack.Authorization.Users;
using ERPack.Editions;
using ERPack.MultiTenancy.Dto;
using ERPack.Users.Dto;
using Microsoft.AspNetCore.Identity;

namespace ERPack.MultiTenancy
{
    public class TenantAppService : AsyncCrudAppService<Tenant, TenantDto, int, PagedTenantResultRequestDto, CreateTenantDto, TenantDto>, ITenantAppService
    {
        private readonly TenantManager _tenantManager;
        private readonly HostTenantManager _hostTenantManager;
        private readonly EditionManager _editionManager;
        private readonly UserManager _userManager;
        private readonly RoleManager _roleManager;
        private readonly IAbpZeroDbMigrator _abpZeroDbMigrator;

        public TenantAppService(
            IRepository<Tenant, int> repository,
            TenantManager tenantManager,
            HostTenantManager hostTenantManager,
            EditionManager editionManager,
            UserManager userManager,
            RoleManager roleManager,
            IAbpZeroDbMigrator abpZeroDbMigrator)
            : base(repository)
        {
            _tenantManager = tenantManager;
            _hostTenantManager = hostTenantManager;
            _editionManager = editionManager;
            _userManager = userManager;
            _roleManager = roleManager;
            _abpZeroDbMigrator = abpZeroDbMigrator;
        }

        [AbpAuthorize(PermissionNames.Pages_Tenants)]
        public override async Task<TenantDto> CreateAsync(CreateTenantDto input)
        {
            CheckCreatePermission();

            // Create tenant
            var tenant = ObjectMapper.Map<Tenant>(input);
            tenant.ConnectionString = input.ConnectionString.IsNullOrEmpty()
                ? null
                : SimpleStringCipher.Instance.Encrypt(input.ConnectionString);

            var defaultEdition = await _editionManager.FindByNameAsync(EditionManager.DefaultEditionName);
            if (defaultEdition != null)
            {
                tenant.EditionId = defaultEdition.Id;
            }

            await _tenantManager.CreateAsync(tenant);
            await CurrentUnitOfWork.SaveChangesAsync(); // To get new tenant's id.

            // Create tenant database
            _abpZeroDbMigrator.CreateOrMigrateForTenant(tenant);

            // We are working entities of new tenant, so changing tenant filter
            using (CurrentUnitOfWork.SetTenantId(tenant.Id))
            {
                // Create static roles for new tenant
                CheckErrors(await _roleManager.CreateStaticRoles(tenant.Id));

                await CurrentUnitOfWork.SaveChangesAsync(); // To get static role ids

                // Grant all permissions to admin role
                var adminRole = _roleManager.Roles.Single(r => r.Name == StaticRoleNames.Tenants.Admin);
                await _roleManager.GrantAllPermissionsAsync(adminRole);

                // Create admin user for the tenant
                var adminUser = User.CreateTenantAdminUser(tenant.Id, input.AdminEmailAddress);
                await _userManager.InitializeOptionsAsync(tenant.Id);
                CheckErrors(await _userManager.CreateAsync(adminUser, User.DefaultPassword));
                await CurrentUnitOfWork.SaveChangesAsync(); // To get admin user's id

                // Assign admin user to role!
                CheckErrors(await _userManager.AddToRoleAsync(adminUser, adminRole.Name));
                await CurrentUnitOfWork.SaveChangesAsync();
            }

            return MapToEntityDto(tenant);
        }

        protected override IQueryable<Tenant> CreateFilteredQuery(PagedTenantResultRequestDto input)
        {
            return Repository.GetAll()
                .WhereIf(!input.Keyword.IsNullOrWhiteSpace(), x => x.TenancyName.Contains(input.Keyword) || x.Name.Contains(input.Keyword))
                .WhereIf(input.IsActive.HasValue, x => x.IsActive == input.IsActive);
        }

        protected override void MapToEntity(TenantDto updateInput, Tenant entity)
        {
            // Manually mapped since TenantDto contains non-editable properties too.
            entity.Name = updateInput.Name;
            entity.TenancyName = updateInput.TenancyName;
            entity.IsActive = updateInput.IsActive;
            entity.Address1 = updateInput.Address1;
            entity.Address2 = updateInput.Address2;
            entity.City = updateInput.City;
            entity.State = updateInput.State;
            entity.Country = updateInput.Country;
            entity.PinCode = updateInput.PinCode;
            entity.Logo = updateInput.Logo;
            entity.IsActive = true;
        }

        [AbpAuthorize(PermissionNames.Pages_EditCompany)]
        [AbpAuthorize(PermissionNames.Pages_Tenants)]
        public override async Task<TenantDto> UpdateAsync(TenantDto input)
        {
            try
            {
                CheckUpdatePermission();
                var entity = await _hostTenantManager.GetAsync();

                MapToEntity(input, entity);

                await _hostTenantManager.UpdateAsync(entity);

                return await GetAsync(input);
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        protected void MapToEntity(TenantDto updateInput, HostTenantInfo entity)
        {
            // Manually mapped since TenantDto contains non-editable properties too.
            entity.Address1 = updateInput.Address1;
            entity.Address2 = updateInput.Address2;
            entity.City = updateInput.City;
            entity.State = updateInput.State;
            entity.Country = updateInput.Country;
            entity.PinCode = updateInput.PinCode;           
            entity.Logo = updateInput.Logo;
            entity.BankName = updateInput.BankName;
            entity.AccountNumber = updateInput.AccountNumber;
            entity.Branch = updateInput.Branch;
            entity.IFSCCode = updateInput.IFSCCode;
            entity.GSTNumber = updateInput.GSTNumber;
            entity.PANNumber = updateInput.PANNumber;
        }
        public async Task<TenantDto> GetAsync(EntityDto<int> input)
        {
            CheckGetPermission();

            var entity = await GetEntityByIdAsync(input.Id);
            return MapToEntityDto(entity);
        }

        [AbpAuthorize(PermissionNames.Pages_Tenants)]
        public async Task<HostTenantInfo> GetHostTenantInfoAsync()
        {
            var entity = await _hostTenantManager.GetAllAsync();
             return entity.FirstOrDefault();
        }

        [AbpAuthorize(PermissionNames.Pages_Tenants)]
        public override async Task DeleteAsync(EntityDto<int> input)
        {
            CheckDeletePermission();

            var tenant = await _tenantManager.GetByIdAsync(input.Id);
            await _tenantManager.DeleteAsync(tenant);
        }

        private void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }
    }
}

