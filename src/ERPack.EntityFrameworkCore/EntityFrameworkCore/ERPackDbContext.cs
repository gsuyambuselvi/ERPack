﻿using Microsoft.EntityFrameworkCore;
using Abp.Zero.EntityFrameworkCore;
using ERPack.Authorization.Roles;
using ERPack.Authorization.Users;
using ERPack.MultiTenancy;
using ERPack.Departments;
using ERPack.Customers;
using ERPack.Materials;
using ERPack.Materials.Units;
using ERPack.Materials.ItemTypes;
using ERPack.Stores;
using ERPack.Vendors;
using ERPack.Preferences;
using ERPack.Customers.CustomerMaterialPrices;
using ERPack.Inventory;
using ERPack.Materials.MaterialInventories;
using ERPack.PurchaseOrders;
using ERPack.PurchaseRecieves;
using ERPack.PurchaseIndents;
using ERPack.Designs;
using ERPack.Categories;
using ERPack.Enquiries;
using ERPack.Estimates;
using ERPack.WorkOrders;
using ERPack.Workorders;
using ERPack.Common;

namespace ERPack.EntityFrameworkCore
{
    public class ERPackDbContext : AbpZeroDbContext<Tenant, Role, User, ERPackDbContext>
    {
        /* Define a DbSet for each entity of the application */
        public virtual DbSet<HostTenantInfo> HostTenantInfo { get; set; }
        public virtual DbSet<Department> Departments { get; set; }
        public virtual DbSet<Customer> Customers { get; set; }
        public virtual DbSet<Material> Materials { get; set; }
        public virtual DbSet<ItemType> ItemTypes { get; set; }
        public virtual DbSet<ItemCategory> ItemCategories { get; set; }
        public virtual DbSet<Unit> Units { get; set; }
        public virtual DbSet<Store> Stores { get; set; }
        public virtual DbSet<Vendor> Vendors { get; set; }
        public virtual DbSet<Preference> Preferences { get; set; }
        public virtual DbSet<CustomerMaterialPrice> CustomerMaterialPrices { get; set; }
        public virtual DbSet<InventoryIssued> InventoryIssued { get; set; }
        public virtual DbSet<InventoryIssuedItem> InventoryIssuedItems { get; set; }
        public virtual DbSet<InventoryRequest> InventoryRequests { get; set; }
        public virtual DbSet<MaterialInventory> MaterialInventory { get; set; }
        public virtual DbSet<PurchaseOrder> PurchaseOrders { get; set; }
        public virtual DbSet<PurchaseOrderItem> PurchaseOrderItems { get; set; }
        public virtual DbSet<PurchaseReceive> PurchaseReceives { get; set; }
        public virtual DbSet<PurchaseReceiveItem> PurchaseReceiveItems { get; set; }
        public virtual DbSet<PurchaseIndent> PurchaseIndents { get; set; }
        public virtual DbSet<DesignSheet> DesignSheets { get; set; }
        public virtual DbSet<BoardType> BoardTypes { get; set; }
        public virtual DbSet<ToolConfiguration> ToolConfigurations { get; set; }
        public virtual DbSet<Category> Categories { get; set; }
        public virtual DbSet<Design> Designs { get; set; }
        public virtual DbSet<DesignMaterial> DesignMaterials { get; set; }
        public virtual DbSet<Enquiry> Enquiries { get; set; }
        public virtual DbSet<EnquiryMaterial> EnquiryMaterials { get; set; }
        public virtual DbSet<Estimate> Estimate { get; set; }
        public virtual DbSet<EstimateTask> EstimateTasks { get; set; }
        public virtual DbSet<Workorder> Workorders { get; set; }
        public virtual DbSet<WorkorderTask> WorkorderTasks { get; set; }
        public virtual DbSet<WorkorderSubTask> WorkorderSubTasks { get; set; }
        public virtual DbSet<CountryMaster> CountryMasters { get; set; }
        public virtual DbSet<StateMaster> StateMasters { get; set; }

        public ERPackDbContext(DbContextOptions<ERPackDbContext> options)
            : base(options)
        {
        }


    }
}
