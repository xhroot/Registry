using System.Collections.Generic;
using System.Data.Linq;
using System.Runtime.Serialization;

namespace registry.Models
{
  [DataContract]
  public class StatusTransport<T>
  {
    [DataMember]
    public T ViewModel { get; set; }

    bool _isStale;
    [DataMember]
    public bool IsStale { get { return _isStale; } set { } }

    bool _isSuccess;
    [DataMember]
    public bool IsSuccess { get { return _isSuccess; } set { } }

    [DataMember]
    public List<string> Errors { get; set; }

    public StatusTransport()
    {
      _isStale = false;
      _isSuccess = false;
      Errors = new List<string>();
    }

    public void SetStale(ChangeConflictException ex)
    {
      _isStale = true;
      _isSuccess = false;
      Errors.Add(ex.Message);
    }

    public void SetSuccess()
    {
      _isStale = false;
      _isSuccess = true;
    }
  }
}