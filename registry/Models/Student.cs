using System;

namespace registry.Models
{
  // Partial. The rest of it is in DataClasses.designer.cs.
  public partial class Student
  {
    public Student(StudentViewModel model)
    {
      Id = model.Id;
      FirstName = model.FirstName;
      LastName = model.LastName;
      GPA = model.GPA;
      IsEnrolled = model.IsEnrolled;
      Version = Convert.FromBase64String(model.Version);
    }
  }
}