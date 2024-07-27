using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjectOlympia.Migrations
{
    /// <inheritdoc />
    public partial class AthleteOlympicId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "OlympicId",
                table: "Athletes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OlympicId",
                table: "Athletes");
        }
    }
}
