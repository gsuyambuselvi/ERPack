using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ERPack.Migrations
{
    /// <inheritdoc />
    public partial class update_columns_in_Estimate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Estimate_Customers_CustomerId",
                table: "Estimate");

            migrationBuilder.DropForeignKey(
                name: "FK_Estimate_Enquiries_EnquiryId",
                table: "Estimate");

            migrationBuilder.DropIndex(
                name: "IX_Estimate_CustomerId",
                table: "Estimate");

            migrationBuilder.DropIndex(
                name: "IX_Estimate_EnquiryId",
                table: "Estimate");

            migrationBuilder.DropColumn(
                name: "CustomerId",
                table: "Estimate");

            migrationBuilder.DropColumn(
                name: "EnquiryId",
                table: "Estimate");

            migrationBuilder.DropColumn(
                name: "Image",
                table: "Estimate");

            migrationBuilder.AddColumn<bool>(
                name: "IsIncludeImage",
                table: "Estimate",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsIncludeMaterial",
                table: "Estimate",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsKit",
                table: "Estimate",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_Estimate_DesignId",
                table: "Estimate",
                column: "DesignId");

            migrationBuilder.AddForeignKey(
                name: "FK_Estimate_Designs_DesignId",
                table: "Estimate",
                column: "DesignId",
                principalTable: "Designs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Estimate_Designs_DesignId",
                table: "Estimate");

            migrationBuilder.DropIndex(
                name: "IX_Estimate_DesignId",
                table: "Estimate");

            migrationBuilder.DropColumn(
                name: "IsIncludeImage",
                table: "Estimate");

            migrationBuilder.DropColumn(
                name: "IsIncludeMaterial",
                table: "Estimate");

            migrationBuilder.DropColumn(
                name: "IsKit",
                table: "Estimate");

            migrationBuilder.AddColumn<long>(
                name: "CustomerId",
                table: "Estimate",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<long>(
                name: "EnquiryId",
                table: "Estimate",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<string>(
                name: "Image",
                table: "Estimate",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Estimate_CustomerId",
                table: "Estimate",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_Estimate_EnquiryId",
                table: "Estimate",
                column: "EnquiryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Estimate_Customers_CustomerId",
                table: "Estimate",
                column: "CustomerId",
                principalTable: "Customers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Estimate_Enquiries_EnquiryId",
                table: "Estimate",
                column: "EnquiryId",
                principalTable: "Enquiries",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
