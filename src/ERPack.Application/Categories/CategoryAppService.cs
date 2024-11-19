using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.ObjectMapping;
using ERPack.Categories;
using ERPack.Categories.Dto;
using ERPack.Departments.Dto;
using ERPack.Materials.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ERPack.Departments
{
    [AbpAuthorize]
    public class CategoryAppService : ERPackAppServiceBase , ICategoryAppService
    {
        private readonly CategoryManager _categoryManager;

        public CategoryAppService(IRepository<Category> repository,
            CategoryManager categoryManager)
        {
            _categoryManager = categoryManager;
        }

        public  async Task<int> CreateCategoryAsync(CategoryDto input)
        {

            var category = ObjectMapper.Map<Category>(input);

            int categoryId =  await _categoryManager.CreateAsync(category);

            return categoryId;
        }

        public async Task<List<CategoryOutput>> GetAllAsync()
        {
            var categories = await _categoryManager.GetAllAsync();

            var result = ObjectMapper.Map<List<CategoryOutput>>(categories);

            return result;
        }

    }
}
