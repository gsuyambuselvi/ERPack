using System;
using System.ComponentModel.DataAnnotations;
using Abp.Application.Services.Dto;
using Abp.Authorization.Users;
using Abp.AutoMapper;
using ERPack.Authorization.Users;
using Microsoft.AspNetCore.Http;

namespace ERPack.Customers.Dto
{
    [AutoMap(typeof(Customer))]
    public class CustomerDto : EntityDto<long>
    {
        public string CustomerId { get; set; }
        [Required]
        public string Name { get; set; }

        public string Address1 { get; set; }
        public string Address2 { get; set; }
        [StringLength(170)]
        public string City { get; set; }
        [StringLength(50)]
        public string State { get; set; }
        [StringLength(10)]
        public string PinCode { get; set; }
        [StringLength(100)]
        public string Country { get; set; }
        [StringLength(15)]
        public string Mobile { get; set; }
        [StringLength(100)]
        public string ContactPerson { get; set; }
        [StringLength(100)]
        public string Designation { get; set; }
        [StringLength(20)]
        public string PAN { get; set; }
        [StringLength(20)]
        public string GSTNo { get; set; }
        [StringLength(100)]
        public string EmailAddress { get; set; }
        [StringLength(100)]
        public string Website { get; set; }
        [StringLength(15)]
        public string ContactNo { get; set; }
        public IFormFile ImageDoc { get; set; }
        public int CategoryId { get; set; }
        public string Industry { get; set; }
        public int? TenantId { get; set; }
    }
}
