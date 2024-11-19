using Abp.AspNetCore.Mvc.Authorization;
using Abp.Logging;
using Castle.Core.Resource;
using ERPack.Authorization;
using ERPack.Categories;
using ERPack.Common;
using ERPack.Controllers;
using ERPack.Customers;
using ERPack.Customers.Dto;
using ERPack.Departments;
using ERPack.Materials;
using ERPack.Web.Models.Customers;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ERPack.Web.Controllers
{
    [AbpMvcAuthorize(PermissionNames.Pages_Customers)]
    public class CustomersController : ERPackControllerBase
    {
        private readonly ICustomerAppService _customerAppService;
        private readonly IMaterialAppService _materialAppService;
        private readonly IUnitAppService _unitAppService;
        private readonly ICategoryAppService _categoryAppService;
        private readonly ICountryMasterAppService _countryMasterAppService;
        private readonly IStateMasterAppService _stateMasterAppService;


        public CustomersController(ICustomerAppService customerAppService,
            IMaterialAppService materialAppService,
            IUnitAppService unitAppService,
            ICategoryAppService categoryAppService,
            ICountryMasterAppService countryMasterAppService, 
            IStateMasterAppService stateMasterAppService)
        {
            _customerAppService = customerAppService;
            _materialAppService = materialAppService;
            _unitAppService = unitAppService;
            _categoryAppService = categoryAppService;
            _countryMasterAppService = countryMasterAppService;
            _stateMasterAppService = stateMasterAppService;

        }

        public IActionResult Index()
        {
            return View();
        }

        public async Task<ActionResult> CreateCustomer(long customerId = 0, string returnUrl = "")
        {
            AddEditCustomerModel model = new AddEditCustomerModel();
            if (customerId > 0)
            {
                CustomerDto customer = await _customerAppService.GetAsync(customerId);

                model = ObjectMapper.Map<AddEditCustomerModel>(customer);

                model.CustomerMaterials = await _customerAppService.GetCustomerMaterialPricesAsync(customerId);
            }

            model.Units = await _unitAppService.GetUnitsAsync();
            model.Materials = await _materialAppService.GetAllMaterialsAsync();
            model.Categories = await _categoryAppService.GetAllAsync();
            
            var Countries = await _countryMasterAppService.GetCountriesAsync();
            var States = await _stateMasterAppService.GetStatesAsync();

            model.Countries = Countries;
            model.States = States;
            model.ReturnUrl = returnUrl;            
            return View(model);
        }

        [HttpPost]
        public async Task<JsonResult> CreateCustomer(AddEditCustomerModel input)
        {
            var errMsg = string.Empty;
            try
            {
                CustomerDto customerDto = ObjectMapper.Map<CustomerDto>(input);
                if (input.Id == 0)
                {
                    customerDto.TenantId = AbpSession.TenantId;

                    //var customerId = await _customerAppService.CreateAsync(customerDto);
                    (var customerId, errMsg) = await _customerAppService.CreateAsync(customerDto);

                    if (customerId == 0)
                    {
                        return Json(new
                        {
                            //msg = "ERROR",
                            msg = errMsg,
                            id = 0
                        });
                    }
                    else
                    {
                        List<CustomerMaterialPriceDto> customerMaterialPrices = ObjectMapper.Map<List<CustomerMaterialPriceDto>>(input.CustomerMaterials);

                        foreach (var item in customerMaterialPrices)
                        {
                            item.CustomerId = customerId;

                            await _customerAppService.CreateCustomerMaterialPriceAsync(item);
                        }

                        return Json(new
                        {
                            msg = "OK",
                            id = customerId,
                            returnUrl = input.ReturnUrl
                        });
                    }
                }
                else
                {
                    (var customer, errMsg) = await _customerAppService.UpdateAsync(customerDto);

                    var customerMaterials = await _customerAppService.GetCustomerMaterialPricesAsync(input.Id);

                    List<CustomerMaterialPriceDto> customerMaterialPrices = ObjectMapper.Map<List<CustomerMaterialPriceDto>>(input.CustomerMaterials);

                    foreach (var item in customerMaterials)
                    {
                        await _customerAppService.DeleteCustomerMaterialPriceAsync(item);

                        item.CustomerId = customer.Id;

                        //await _customerAppService.CreateCustomerMaterialPriceAsync(item);
                    }

                    

                    foreach (var item in customerMaterialPrices)
                    {
                        item.CustomerId = customer.Id;

                        await _customerAppService.CreateCustomerMaterialPriceAsync(item);
                    }
                    //TempData["Successmsg"] = "Customer has been updated successfully...!";
                    return Json(new
                    {
                        //msg = "OK",
                        msg = errMsg,
                        id = customer.Id
                    });
                }
                }           
            catch (Exception ex)
            {
                Logger.Log(LogSeverity.Error, "Error in creating customer", ex);
                return Json(new
                {
                    msg = errMsg,
                    id = 0
                });
            }
        }

        public async Task<JsonResult> GetCustomersNames(string name)
        {
            var customers = await _customerAppService.GetCustomersNamesAsync(name);
            if (customers != null)
            {
                string jsonData = JsonConvert.SerializeObject(customers);
                return Json(new
                {
                    msg = "OK",
                    data = jsonData
                });

            }
            else
            {
                Logger.Log(LogSeverity.Warn, "Not able to found cusotmers");
                return Json(new
                {
                    msg = "ERROR"
                });
            }
        }

        public async Task<JsonResult> GetCustomerById(long id)
        {
            var customer = await _customerAppService.GetByIdAsync(id);
            if (customer == null)
            {
                return Json(new
                {
                    msg = "ERROR"
                });
            }
            else
            {
                string jsonData = JsonConvert.SerializeObject(customer);
                return Json(new
                {
                    msg = "OK",
                    data = jsonData
                });

            }
        }
    }
}
