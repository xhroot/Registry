/**
 * View maps UI data and events to RPC and vice-versa.
 * @constructor
 */
var View = function (rpc) {
  this.serverStudent = null;

  $('#Save').click($.proxy(this.save, this, rpc));

  // When RPC indicates a sync, only update in-memory model.
  $(rpc).on(Rpc.EventType.SYNC, $.proxy(function (e, model, isResponse) {
    this.serverStudent = model;
    // DEMO: Update server window so we can see what's in memory.
    this.studentToHtml(model, true);

    if (isResponse || confirm('Student updated. Refresh?')) {
      this.studentToHtml(model, false);
    }
  }, this));

  // When RPC triggers stale event, handle error.
  $(rpc).on(Rpc.EventType.STALE, function (e, error) {
    alert('Concurrency violation: ' + error + '\nReloading data.');
  });

};

View.prototype.save = function (rpc) {
  var newStudent = this.studentFromHtml();

  // If server version is more recent than local version, make sure user is ok
  // with overwriting.
  if (newStudent.Version != this.serverStudent.Version &&
      !confirm('Overwrite server version?')) {
    alert('Save canceled.');
    return;
  }

  // Overwrite; take most recent timestamp. Save.
  newStudent.Version = this.serverStudent.Version;
  $.proxy(rpc.save, rpc, newStudent)();
};

// Extract student info from page.
View.prototype.studentFromHtml = function () {
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
View.prototype.studentToHtml = function (student, isServerView) {
  var prefix = isServerView ? '#svr' : '#';
  $(prefix + 'Id').val(student.Id);
  $(prefix + 'Version').val(student.Version);

  $(prefix + 'FirstName').val(student.FirstName);
  $(prefix + 'LastName').val(student.LastName);
  $(prefix + 'IsEnrolled').attr('checked', student.IsEnrolled);
  $(prefix + 'GPA').val(student.GPA);
};

