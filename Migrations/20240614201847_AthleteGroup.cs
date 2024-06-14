using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjectOlympia.Migrations
{
    /// <inheritdoc />
    public partial class AthleteGroup : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Group",
                table: "Athletes",
                type: "int",
                nullable: false,
                defaultValue: -1);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Group",
                table: "Athletes");
        }
    }
}
