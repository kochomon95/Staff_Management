using Microsoft.EntityFrameworkCore;
using Staff_Management.Controllers;
using Staff_Management.Models;
using System.Collections.Generic;
using System.Linq;
using Xunit;

namespace Staff_Management.Tests
{
    public class StaffControllerTests
    {
        private StaffDBContext GetTestDbContext(string databaseName)
        {
            var options = new DbContextOptionsBuilder<StaffDBContext>()
                .UseInMemoryDatabase(databaseName)
                .Options;
            var dbContext = new StaffDBContext(options);

            dbContext.Staff.AddRange(new List<Staff>
            {
                new Staff { StaffID = "1", FullName = "John Doe", Birthday = new DateTime(2025, 01, 25), Gender = 1 }
            });

            dbContext.SaveChanges();
            return dbContext;
        }

        [Fact]
        public async Task GetStaffs_ReturnsAllStaff()
        {
            // Arrange
            var dbContext = GetTestDbContext("GetStaffs_ReturnsAllStaff");
            var controller = new StaffController(dbContext);

            // Act
            var result = await controller.GetStaffs();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());
        }

        [Fact]
        public async Task AddStaffData_ReturnsAddedStaff()
        {
            // Arrange
            var dbContext = GetTestDbContext("AddStaffData_ReturnsAddedStaff");
            var controller = new StaffController(dbContext);
            var newStaff = new Staff { StaffID = "3", FullName = "New Staff", Birthday = DateTime.Today, Gender = 1 };


            // Act
            var result = await controller.AddStaffData(newStaff);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(newStaff.StaffID, result.StaffID);
            Assert.Equal(newStaff.FullName, result.FullName);
            Assert.Equal(newStaff.Birthday, result.Birthday);
            Assert.Equal(newStaff.Gender, result.Gender);

        }

        [Fact]
        public async Task UpdateStaffData_ReturnsUpdatedStaff()
        {
            // Arrange
            var dbContext = GetTestDbContext("UpdateStaffData_ReturnsUpdatedStaff");
            var controller = new StaffController(dbContext);
            var updatedStaff = new Staff { StaffID = "1", FullName = "Updated John Doe", Birthday = DateTime.Today, Gender = 1 };

            // Act
            var result = await controller.UpdateStaffData(updatedStaff);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(updatedStaff.StaffID, result.StaffID);
            Assert.Equal(updatedStaff.FullName, result.FullName);
            Assert.Equal(updatedStaff.Birthday, result.Birthday);
            Assert.Equal(updatedStaff.Gender, result.Gender);
        }

        [Fact]
        public void DeleteStaffData_ReturnsTrueForExistingStaff()
        {
            // Arrange
            var dbContext = GetTestDbContext("DeleteStaffData_ReturnsTrueForExistingStaff");
            var controller = new StaffController(dbContext);
            var staffIdToDelete = "1";

            // Act
            var result = controller.DeleteStaffData(staffIdToDelete);

            // Assert
            Assert.True(result);
            // You can add additional assertions here if needed.
        }

        [Fact]
        public void DeleteStaffData_ReturnsFalseForNonExistingStaff()
        {
            // Arrange
            var dbContext = GetTestDbContext("DeleteStaffData_ReturnsFalseForNonExistingStaff");
            var controller = new StaffController(dbContext);
            var nonExistingStaffIdToDelete = "100";

            // Act
            var result = controller.DeleteStaffData(nonExistingStaffIdToDelete);

            // Assert
            Assert.False(result);
        }

    }
}