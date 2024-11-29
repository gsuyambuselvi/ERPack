using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System;
using Microsoft.Extensions.DependencyInjection;
using System.IO;

namespace ERPack.Web.Helpers
{
    public static class PdfGenerator
    {

        public static async Task<IActionResult> GenerateAndDownloadPdf<T>(
            PageModel pageModel,
            string viewName,
            T model,
            string fileName = "kundli.pdf")
        {
            try
            {
                // Get services
                var viewEngine = pageModel.HttpContext.RequestServices.GetRequiredService<ICompositeViewEngine>();

                // Generate HTML from view
                var html = await RenderViewToString(pageModel, viewEngine, viewName, model);

                // Generate PDF
                byte[] pdfBytes = PdfUtil.GeneratePdf(html);

                // Return file
                return pageModel.File(pdfBytes, "application/pdf", fileName);
            }
            catch (Exception ex)
            {
                // Log the error here if you have logging configured
                return pageModel.StatusCode(500, $"Error generating PDF: {ex.Message}");
            }
        }

        public static async Task<IActionResult> GenerateAndDownloadPdf<T>(
            Controller controller,
            string viewName,
            T model,
            string fileName = "{0}_{1}.pdf")
        {
            try
            {

                if (fileName == "{0}_{1}.pdf")
                {
                    fileName = string.Format("{0}_{1}.pdf", viewName.Replace("_", ""), DateTime.Now.ToString("yyyyMMdd"));
                }

                // Get the view engine
                var viewEngine = controller.HttpContext.RequestServices
                    .GetRequiredService<ICompositeViewEngine>();

                // Generate HTML from view
                var html = await RenderViewToString(controller, viewEngine, viewName, model);

                // Generate PDF
                byte[] pdfBytes = PdfUtil.GeneratePdf(html);

                // Return file
                return controller.File(pdfBytes, "application/pdf", fileName);
            }
            catch (Exception ex)
            {
                // Log the error here if you have logging configured
                return controller.StatusCode(500, $"Error generating PDF: {ex.Message}");
            }
        }

        private static async Task<string> RenderViewToString<T>(
            PageModel pageModel,
            ICompositeViewEngine viewEngine,
            string viewName,
            T model)
        {
            var actionContext = new ActionContext(
                pageModel.HttpContext,
                pageModel.RouteData,
                pageModel.PageContext.ActionDescriptor);

            var viewResult = viewEngine.FindView(actionContext, viewName, false);

            if (!viewResult.Success)
            {
                throw new InvalidOperationException($"Couldn't find view '{viewName}'");
            }

            using (var sw = new StringWriter())
            {
                var viewContext = new ViewContext(
                    actionContext,
                    viewResult.View,
                    new ViewDataDictionary<T>(
                        metadataProvider: new EmptyModelMetadataProvider(),
                        modelState: new ModelStateDictionary())
                    {
                        Model = model
                    },
                    new TempDataDictionary(
                        actionContext.HttpContext,
                        pageModel.HttpContext.RequestServices.GetRequiredService<ITempDataProvider>()),
                    sw,
                    new HtmlHelperOptions());

                await viewResult.View.RenderAsync(viewContext);
                return sw.ToString();
            }
        }

        private static async Task<string> RenderViewToString<T>(
            Controller controller,
            ICompositeViewEngine viewEngine,
            string viewName,
            T model)
        {
            var actionContext = new ActionContext(
                controller.HttpContext,
                controller.RouteData,
                controller.ControllerContext.ActionDescriptor);

            var viewResult = viewEngine.FindView(actionContext, viewName, false);

            if (!viewResult.Success)
            {
                throw new InvalidOperationException($"Couldn't find view '{viewName}'");
            }

            using (var sw = new StringWriter())
            {
                var viewContext = new ViewContext(
                    actionContext,
                    viewResult.View,
                    new ViewDataDictionary<T>(
                        metadataProvider: new EmptyModelMetadataProvider(),
                        modelState: new ModelStateDictionary())
                    {
                        Model = model
                    },
                    new TempDataDictionary(
                        actionContext.HttpContext,
                        controller.HttpContext.RequestServices.GetRequiredService<ITempDataProvider>()),
                    sw,
                    new HtmlHelperOptions());

                await viewResult.View.RenderAsync(viewContext);
                return sw.ToString();
            }
        }
    }
}
