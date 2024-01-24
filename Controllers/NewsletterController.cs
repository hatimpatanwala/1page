using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OnePageOnlineUI.Controllers
{
    public class NewsletterController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
