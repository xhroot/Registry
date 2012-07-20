using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using registry.Models;
using registry.Services;
using SignalR.Client.Hubs;
using System.Web;

namespace registry
{
  [ServiceContract]
  [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
  public class RegistryService
  {
    readonly StudentService _studentService;

    public RegistryService()
    {
      var req = HttpContext.Current.Request;
      var path = req.Url.Scheme + "://" + req.Url.Authority + req.ApplicationPath;

      _studentService = new StudentService(new DataClassesDataContext(), 
        new HubConnection(path));
    }

    [OperationContract]
    [WebInvoke(Method = "GET", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
    public StatusTransport<StudentViewModel> Fetch(int studentId)
    {
      return _studentService.GetStudentById(studentId);
    }

    [OperationContract]
    [WebInvoke(Method = "PUT", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
    public StatusTransport<StudentViewModel> Save(StudentViewModel model)
    {
      return _studentService.SaveStudent(model);
    }
  }
}
