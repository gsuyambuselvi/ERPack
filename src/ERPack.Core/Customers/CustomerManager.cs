using Abp.Domain.Repositories;
using Abp.UI;
using ERPack.Departments;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPack.Customers
{
    public class CustomerManager : ICustomerManager
    {
        private readonly IRepository<Customer, long> _customerRepository;

        public CustomerManager(
            IRepository<Customer, long> customerRepository)
        {
            _customerRepository = customerRepository;
        }

        public async Task<long> CreateAsync(Customer customer)
        {
            var existingCustomer = await _customerRepository.GetAll().FirstOrDefaultAsync(c => c.EmailAddress == customer.EmailAddress && c.Id != customer.Id);
            if (existingCustomer != null)
            {
                throw new UserFriendlyException("A customer with this email already exists.");
            }
            return await _customerRepository.InsertAndGetIdAsync(customer);
        }
        public async Task<Customer> UpdateAsync(Customer customer)
        {
            var existingCustomer = await _customerRepository.GetAll().FirstOrDefaultAsync(c => c.EmailAddress == customer.EmailAddress && c.Id != customer.Id);
            if (existingCustomer != null)
            {
                throw new UserFriendlyException("A customer with this email already exists.");
            }
            return await _customerRepository.UpdateAsync(customer);
        }

        public async Task<Customer> GetAsync(long id)
        {
            var cusotmer = await _customerRepository.GetAll().Where(x => x.Id == id).FirstOrDefaultAsync();

            if (cusotmer == null)
            {
                throw new UserFriendlyException("Could not found the cusotmer, maybe it's deleted!");
            }
            return cusotmer;

        }

        public async Task<Customer> GetByIdAsync(long id)
        {
            var cusotmer = await _customerRepository.GetAll().Where(x => x.Id == id).FirstOrDefaultAsync();
            return cusotmer;

        }

        public async Task<List<Customer>> GetAllAsync()
        {
            var customers = await _customerRepository.GetAll().ToListAsync();

            if (customers == null)
            {
                throw new UserFriendlyException("No customer found, please contact admin!");
            }
            return customers;

        }

        public async Task<List<Customer>> SearchCustomersByNameAsync(string name)
        {
            var customers = await _customerRepository.GetAll().
                 Where(r =>r.Name.Contains(name))
                .ToListAsync();

            if (customers == null)
            {
                throw new UserFriendlyException("No customer found, please contact admin!");
            }
            return customers;

        }

        public void Cancel(Customer customer)
        {
            _customerRepository.Delete(customer);
        }
    }
}
