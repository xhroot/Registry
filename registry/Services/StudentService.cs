using System;
using System.Linq;
using registry.Models;
using SignalR.Client.Hubs;
using System.Data.Linq;

namespace registry.Services
{
  public class StudentService
  {
    readonly DataClassesDataContext _context;
    readonly HubConnection _hubConn;

    public StudentService(DataClassesDataContext context, HubConnection hubConn)
    {
      if (context == null) 
        throw new ArgumentNullException("`context` cannot be null.");
      if (hubConn == null) 
        throw new ArgumentNullException("`hubConn` cannot be null.");

      _context = context;
      _hubConn = hubConn;
    }

    public StatusTransport<StudentViewModel> GetStudentById(int id)
    {
      var transport = new StatusTransport<StudentViewModel>();
      var student = _context.Students.Single(x => x.Id == id);
      transport.ViewModel = new StudentViewModel(student);
      transport.SetSuccess();
      return transport;
    }

    public StatusTransport<StudentViewModel> SaveStudent(StudentViewModel model)
    {
      var transport = new StatusTransport<StudentViewModel>();
      var student = new Student(model);
      _context.Students.Attach(student, true);
      try
      {
        _context.SubmitChanges();
        // Retrieve most recent version.
        _context.Refresh(RefreshMode.OverwriteCurrentValues, student);
        transport.ViewModel = new StudentViewModel(student) 
          { ClientId = model.ClientId };
        transport.SetSuccess();

        // Update all connected clients. Comment this line out to test
        // normal conflict resolution.
        BroadcastStudent(transport);
      }
      catch (ChangeConflictException exConflict)
      {
        // Retrieve most recent version.
        _context.Refresh(RefreshMode.OverwriteCurrentValues, student);
        transport.ViewModel = new StudentViewModel(student);

        // Mark result as stale.
        transport.SetStale(exConflict);
      }
      return transport;
    }

    private void BroadcastStudent(StatusTransport<StudentViewModel> transport)
    {
      var hub = _hubConn.CreateProxy(typeof(StudentHub).Name);
      _hubConn
          .Start()
          .ContinueWith(_ => hub.Invoke("BroadcastUpdatedStudent", transport));
    }
  }
}