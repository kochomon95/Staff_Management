using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Staff_Management.Models;

namespace Staff_Management.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StaffController : ControllerBase
    {
        private readonly StaffDBContext _staffDBContext;

        public StaffController(StaffDBContext staffDBContext)
        {
            _staffDBContext = staffDBContext;   
        }

        [HttpGet]
        [Route("GetStaffData")]
        public async Task<IEnumerable<Staff>> GetStaffs()
        {
            return await _staffDBContext.Staff.ToListAsync();
        }

        [HttpPost]
        [Route("AddStaffData")]
        public async Task<Staff> AddStaffData(Staff objStaff)
        {
           _staffDBContext.Staff.Add(objStaff);
            await _staffDBContext.SaveChangesAsync();   
            return objStaff;
        }

        [HttpPatch]
        [Route("UpdateStaffData/{id}")]
        public async Task<Staff> UpdateStaffData(Staff objStaff)
        {
            _staffDBContext.Entry(objStaff).State = EntityState.Modified;
            await _staffDBContext.SaveChangesAsync();
            return objStaff;
        }

        [HttpDelete]
        [Route("DeleteStaffData/{id}")]
        public bool DeleteStaffData(string id)
        {
            bool a = false;
            var staff = _staffDBContext.Staff.Find(id);
            if (staff != null)
            {
                a = true;
                _staffDBContext.Entry(staff).State = EntityState.Deleted;
                _staffDBContext.SaveChanges();
            }
            else
            {
                a = false;
            }
            return a;
        }
    }
}
