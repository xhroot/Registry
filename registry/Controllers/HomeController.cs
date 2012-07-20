using System.Web.Mvc;
using SignalR.Client.Hubs;
using registry.Models;
using registry.Services;

namespace registry.Controllers
{
  public class HomeController : Controller
  {
    readonly StudentService _studentService;

    public HomeController()
    {
      var req = System.Web.HttpContext.Current.Request;
      var path = req.Url.Scheme + "://" + req.Url.Authority + 
        req.ApplicationPath;

      _studentService = new StudentService(new DataClassesDataContext(), 
        new HubConnection(path));
    }

    public ActionResult Index()
    {
      return View();
    }

    [HttpGet]
    public JsonResult Fetch(int studentId)
    {
      return new JsonResult
      {
        Data = _studentService.GetStudentById(studentId),
        JsonRequestBehavior = JsonRequestBehavior.AllowGet,
      };
    }

    [HttpPut]
    public JsonResult Save(StudentViewModel model)
    {
      return new JsonResult { Data = _studentService.SaveStudent(model) };
    }
  }
}
