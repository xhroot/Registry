
// Check if server version is more recent than local version.
var isDirty = function (student) {
  return $('#Version').val() != student.Version;
};

// Extract student info from page.
var studentFromHtml = function () {
  return {
    Id: $('#Id').val(),
    Version: $('#Version').val(),

    FirstName: $('#FirstName').val(),
    LastName: $('#LastName').val(),
    IsEnrolled: $('#IsEnrolled').is(':checked'),
    GPA: $('#GPA').val()
  };
};

// Write/render student info to page.
var studentToHtml = function (student, isServerView) {
  var prefix = isServerView ? '#svr' : '#';
  $(prefix + 'Id').val(student.Id);
  $(prefix + 'Version').val(student.Version);

  $(prefix + 'FirstName').val(student.FirstName);
  $(prefix + 'LastName').val(student.LastName);
  $(prefix + 'IsEnrolled').attr('checked', student.IsEnrolled);
  $(prefix + 'GPA').val(student.GPA);
};

// Save button.
$('#Save').click(function () {
  // If student has been updated by someone else, confirm overwrite.
  if (isDirty(_serverStudent) && !confirm('Overwrite server version?')) {
    alert('Save canceled.');
    return;
  }

  // Get updated student info.
  var model = studentFromHtml();
  model.Version = _serverStudent.Version;
  model.ClientId = _clientId;

  // Call save method asynchronously.
  $.ajax(serviceUrl + 'Save', {
    type: 'PUT',
    contentType: 'application/json',
    data: JSON.stringify(model),
    success: function (result) {
      if (result.IsStale) {
        alert('Concurrency violation: ' + result.Errors[0] + 
            '\nReloading data.');
      }
      _serverStudent = result.ViewModel;
      // Fill edit view.
      studentToHtml(_serverStudent, false);
      // Fill server view.
      studentToHtml(_serverStudent, true);
    }
  });
});

// Define the callback that allows the server to send data.
var _studentHub = $.connection.studentHub;
_studentHub.updateStudent = function (result) {
  // Ignore broadcasts resulting from own save.
  if (result.ViewModel.ClientId == _clientId) {
    return;
  }

  // Extract model from StatusTransport.
  _serverStudent = result.ViewModel;
  studentToHtml(_serverStudent, true);

  if (confirm('Student updated. Refresh?')) {
    studentToHtml(_serverStudent, false);
  }
};

// Globals.
var _serverStudent;
var _clientId;

$(function () {
  // Start hub; load clientId when started.
  $.connection.hub.start(function () {
    _clientId = $.connection.hub.id;
  });

  $.get(serviceUrl + 'Fetch', { studentId: 1 }, function (result) {
    _serverStudent = result.ViewModel;
    // Fill edit view.
    studentToHtml(_serverStudent, false);
    // Fill server view.
    studentToHtml(_serverStudent, true);
  });
});

