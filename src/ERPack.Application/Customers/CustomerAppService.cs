using Abp.Application.Services.Dto;
using Abp.Collections.Extensions;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.Logging;
using Abp.ObjectMapping;
using Abp.UI;
using Castle.Core.Resource;
using ERPack.Authorization.Users;
using ERPack.Common.Dto;
using ERPack.Customers.CustomerMaterialPrices;
using ERPack.Customers.Dto;
using ERPack.Stores;
using ERPack.Stores.Dto;
using ERPack.Users.Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace ERPack.Customers
{
    public class CustomerAppService : ERPackAppServiceBase, ICustomerAppService
    {
        private readonly IRepository<Customer, long> _customerRepository;
        private readonly CustomerManager _customerManager;
        private readonly CustomerMaterialPriceManager _customerMaterialPriceManager;
        private readonly IHostEnvironment _env;

        public CustomerAppService(IRepository<Customer, long> customerRepository,
            CustomerManager customerManager,
            CustomerMaterialPriceManager customerMaterialPriceManager,
            IHostEnvironment env)
        {
            _customerRepository = customerRepository;
            _customerManager = customerManager;
            _customerMaterialPriceManager = customerMaterialPriceManager;
            _env = env;
        }

        #region Customers Methods

        public async Task<(long, string)> CreateAsync(CustomerDto input)
        {
            try
            {
                var customer = ObjectMapper.Map<Customer>(input);

                if (input.ImageDoc != null)
                {
                    customer.Image = await SaveFile(input.ImageDoc);
                }

                long customerId = await _customerManager.CreateAsync(customer);

                return (customerId, string.Empty);
            }
            catch (Exception ex)
            {
                Logger.Log(LogSeverity.Error, ex.Message);
                return (0, ex.Message);
            }
        }
        public async Task<(CustomerDto, string)> UpdateAsync(CustomerDto input)
        {
            var customer = new CustomerDto();
            try
            {
                var entity = await _customerRepository.GetAsync(input.Id);
                MapToEntity(input, entity);
                var result = await _customerManager.UpdateAsync(entity);

                await CurrentUnitOfWork.SaveChangesAsync();

                customer = ObjectMapper.Map<CustomerDto>(result);

                return (customer, string.Empty);
            }
            catch (Exception ex)
            {
                Logger.Log(LogSeverity.Error, ex.Message);
                return (customer, ex.Message);
            }
        }
        public async Task<CustomerDto> GetAsync(long cusotmerId)
        {
            var entity = await _customerManager.GetAsync(cusotmerId);
            var customer = ObjectMapper.Map<CustomerDto>(entity);
            return customer;
        }
        public async Task<CustomerDto> GetByIdAsync(long cusotmerId)
        {
            var entity = await _customerManager.GetByIdAsync(cusotmerId);
            var customer = ObjectMapper.Map<CustomerDto>(entity);
            return customer;
        }
        public Task<PagedResultDto<CustomerDto>> GetAllAsync(PagedUserResultRequestDto input)
        {
            var customers = new List<Customer>();

            var query = CreateFilteredQuery(input);

            query = ApplySorting(query, input);

            customers = query
                .Skip(input.SkipCount)
               // .Take(input.MaxResultCount)
                .ToList();

            var result = new PagedResultDto<CustomerDto>(query.Count(), ObjectMapper.Map<List<CustomerDto>>(customers));
            return Task.FromResult(result);
        }
        public async Task<PagedResultDto<CustomerDto>> GetCustomersListAsync()
        {
            var customers = await _customerRepository.GetAllListAsync();
            var customersList = new List<CustomerDto>(ObjectMapper.Map<List<CustomerDto>>(customers));

            return new PagedResultDto<CustomerDto>(
               totalCount: customersList.Count,
               items: customersList
           );
        }
        public async Task<List<CustomerNameOutput>> GetCustomersNamesAsync(string name)
        {
            try
            {
                var customers = await _customerManager.SearchCustomersByNameAsync(name);

                var customerNames = customers.Select(x => new CustomerNameOutput { Id = x.Id, Name = x.Name }).ToList();

                return customerNames;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException(ex.Message.ToString());
            }
        }
        public async Task DeleteAsync(EntityDto<long> input)
        {
            try
            {
                var customer = await _customerManager.GetAsync(input.Id);
                _customerManager.Cancel(customer);
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException(ex.Message.ToString());
            }

        }

        #endregion

        #region Customer Materials Price Methods

        public async Task<long> CreateCustomerMaterialPriceAsync(CustomerMaterialPriceDto input)
        {
            try
            {
                var customerMaterialPrice = ObjectMapper.Map<CustomerMaterialPrice>(input);

                long customerMaterialPriceId = await _customerMaterialPriceManager.CreateAsync(customerMaterialPrice);

                return customerMaterialPriceId;
            }
            catch (Exception ex)
            {
                Logger.Log(LogSeverity.Error, ex.Message);
                return 0;
            }
        }
        public async Task<List<CustomerMaterialPriceDto>> GetCustomerMaterialPricesAsync(long customerId)
        {
            var entity = await _customerMaterialPriceManager.GetAllByCustomerIdAsync(customerId);
            var customerMaterialPrices = ObjectMapper.Map<List<CustomerMaterialPriceDto>>(entity);
            return customerMaterialPrices;
        }
        public async Task DeleteCustomerMaterialPriceAsync(EntityDto<long> input)
        {
            try
            {
                var customerMaterialPrice = await _customerMaterialPriceManager.GetAsync(input.Id);
                _customerMaterialPriceManager.Cancel(customerMaterialPrice);
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException(ex.Message.ToString());
            }

        }

        #endregion
        #region Protected Methods
        protected IQueryable<Customer> CreateFilteredQuery(PagedUserResultRequestDto input)
        {
            return _customerRepository.GetAll()
                .WhereIf(!input.Keyword.IsNullOrWhiteSpace(), x => x.Name.Contains(input.Keyword) || x.EmailAddress.Contains(input.Keyword)).AsQueryable();
        }

        protected IQueryable<Customer> ApplySorting(IQueryable<Customer> query, PagedUserResultRequestDto input)
        {
            return query.OrderBy(r => r.Name);
        }

        private string GetUniqueFileName(string fileName)
        {
            fileName = Path.GetFileName(fileName);
            return Path.GetFileNameWithoutExtension(fileName)
                   + "_"
                   + Guid.NewGuid().ToString().Substring(0, 4)
                   + Path.GetExtension(fileName);
        }
        private async Task<string> SaveFile(IFormFile file)
        {
            var uniqueFileName = GetUniqueFileName(file.FileName);
            var dir = Path.Combine(_env.ContentRootPath, "Images");
            if (!Directory.Exists(dir))
            {
                Directory.CreateDirectory(dir);
            }
            var filePath = Path.Combine(dir, uniqueFileName);
            await file.CopyToAsync(new FileStream(filePath, FileMode.Create));
            return filePath;
        }
        protected void MapToEntity(CustomerDto input, Customer customer)
        {
            ObjectMapper.Map(input, customer);
        }

        #endregion
    }
}
