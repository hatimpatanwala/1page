using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OnePageOnlineUI.Controllers
{
    public class ServiceController : Controller
    {
        public IActionResult Listings()
        {
            return View();
        }

        public IActionResult Details()
        {
            return View();
        }

        public IActionResult Listing(string id)
        {
            ViewBag.BusinessType = id;
            return View();
        }
    }
}
