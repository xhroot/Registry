using System;
using System.Runtime.Serialization;

namespace registry.Models
{
  [DataContract]
  public class StudentViewModel
  {
    [DataMember]
    public int Id { get; set; }

    [DataMember]
    public string FirstName { get; set; }

    [DataMember]
    public string LastName { get; set; }

    [DataMember]
    public decimal GPA { get; set; }

    [DataMember]
    public bool IsEnrolled { get; set; }

    [DataMember]
    public string Version { get; set; }

    [DataMember]
    public string ClientId { get; set; }

    public StudentViewModel() { }

    public StudentViewModel(Student student)
    {
      Id = student.Id;
      FirstName = student.FirstName;
      LastName = student.LastName;
      GPA = student.GPA;
      IsEnrolled = student.IsEnrolled;
      Version = Convert.ToBase64String((student.Version ?? new byte[] { }).ToArray());
    }
  }
}