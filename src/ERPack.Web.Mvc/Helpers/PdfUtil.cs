using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Mvc;
using System.Reflection.Metadata;
using iText.Kernel.Pdf;
using iText.Html2pdf;
using iText.Layout;
using Microsoft.AspNetCore.Mvc.Abstractions;
using iText.Html2pdf.Resolver.Font;
using System;
using System.IO;
namespace ERPack.Web.Helpers
{



    public static class PdfUtil
    {
        public static byte[] GeneratePdf(string html)
        {
            // Wrap HTML with proper structure if not provided
            if (!html.Trim().StartsWith("<!DOCTYPE", StringComparison.OrdinalIgnoreCase))
            {
                html = $@"<!DOCTYPE html>
                         <html>
                         <head>
                             <meta charset=""UTF-8"">
                             <style>
                                 body {{ font-family: Arial, sans-serif; margin: 20px; }}
                                 table {{ width: 100%; border-collapse: collapse; margin-bottom: 15px; }}
                                 td, th {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
                                 th {{ background-color: #f5f5f5; }}
                             </style>
                         </head>
                         <body>
                             {html}
                         </body>
                         </html>";
            }

            try
            {
                using var memoryStream = new MemoryStream();
                using var writer = new PdfWriter(memoryStream);
                using var pdf = new PdfDocument(writer);
                using var document = new iText.Layout.Document(pdf);

                // Create converter properties
                var converterProperties = new ConverterProperties();
                 
                // Convert HTML to PDF using the correct overload
                HtmlConverter.ConvertToPdf(html, pdf, converterProperties);

                document.Close();
                return memoryStream.ToArray();
            }
            catch (Exception ex)
            {
                throw new Exception($"PDF Generation failed: {ex.Message}", ex);
            }
        }
    }

}
