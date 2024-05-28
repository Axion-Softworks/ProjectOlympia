using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjectOlympia.Migrations
{
    /// <inheritdoc />
    public partial class PlayerToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Athletes_Players_PlayerId",
                table: "Athletes");

            migrationBuilder.DropTable(
                name: "DraftPlayer");

            migrationBuilder.DropTable(
                name: "Players");

            migrationBuilder.RenameColumn(
                name: "PlayerId",
                table: "Athletes",
                newName: "UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Athletes_PlayerId",
                table: "Athletes",
                newName: "IX_Athletes_UserId");

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Username = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Password = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DraftUser",
                columns: table => new
                {
                    DraftsId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UsersId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DraftUser", x => new { x.DraftsId, x.UsersId });
                    table.ForeignKey(
                        name: "FK_DraftUser_Drafts_DraftsId",
                        column: x => x.DraftsId,
                        principalTable: "Drafts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DraftUser_Users_UsersId",
                        column: x => x.UsersId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DraftUser_UsersId",
                table: "DraftUser",
                column: "UsersId");

            migrationBuilder.AddForeignKey(
                name: "FK_Athletes_Users_UserId",
                table: "Athletes",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Athletes_Users_UserId",
                table: "Athletes");

            migrationBuilder.DropTable(
                name: "DraftUser");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Athletes",
                newName: "PlayerId");

            migrationBuilder.RenameIndex(
                name: "IX_Athletes_UserId",
                table: "Athletes",
                newName: "IX_Athletes_PlayerId");

            migrationBuilder.CreateTable(
                name: "Players",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Password = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Username = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Players", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DraftPlayer",
                columns: table => new
                {
                    DraftsId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PlayersId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DraftPlayer", x => new { x.DraftsId, x.PlayersId });
                    table.ForeignKey(
                        name: "FK_DraftPlayer_Drafts_DraftsId",
                        column: x => x.DraftsId,
                        principalTable: "Drafts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DraftPlayer_Players_PlayersId",
                        column: x => x.PlayersId,
                        principalTable: "Players",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DraftPlayer_PlayersId",
                table: "DraftPlayer",
                column: "PlayersId");

            migrationBuilder.AddForeignKey(
                name: "FK_Athletes_Players_PlayerId",
                table: "Athletes",
                column: "PlayerId",
                principalTable: "Players",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
