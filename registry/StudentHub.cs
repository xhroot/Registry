using SignalR.Hubs;
using registry.Models;

namespace registry
{
  public class StudentHub : Hub
  {
    public void BroadcastUpdatedStudent(StatusTransport<StudentViewModel> 
      transport)
    {
      Clients.updateStudent(transport);
    }
  }
}