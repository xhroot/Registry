/**
 * Rpc responsible for all communication with server. Wraps hub methods and 
 * triggers events to notify of incoming data.
 * @constructor
 */
var Rpc = function (serviceUrl) {
  this.serviceUrl = serviceUrl;
  this.clientId = null;

  // Set up hub clientside.
  this.hub = $.connection.studentHub;

  // StudentHub can call Clients.updateStudent to pass data here.
  this.hub.updateStudent = $.proxy(this.hubUpdate, this);

  // Start hub; load clientId when started.
  $.connection.hub.start($.proxy(function () {
    this.clientId = $.connection.hub.id;
  }, this));
};

Rpc.prototype.hubUpdate = function (result) {
  // Ignore broadcasts resulting from own save.
  if (result.ViewModel.ClientId == this.clientId) {
    return;
  }

  // Report a new server update.
  $(this).trigger(Rpc.EventType.SYNC, [result.ViewModel, false]);
};

Rpc.prototype.save = function (student) {
  student.ClientId = this.clientId;

  // Call save method asynchronously.  Use PUT (idempotent).
  $.ajax(this.serviceUrl + 'Save', {
    type: 'PUT',
    data: JSON.stringify(student),
    contentType: 'application/json',
    success: $.proxy(function (result) {
      if (result.IsStale) {
        $(this).trigger(Rpc.EventType.STALE, [result.Errors[0]]);
      }

      // Report a server response.
      $(this).trigger(Rpc.EventType.SYNC, [result.ViewModel, true]);
    }, this)
  });
};

Rpc.prototype.fetch = function (studentId) {
  $.get(this.serviceUrl + 'Fetch', { studentId: studentId }, $.proxy(
      function (result) {
        // Report a server response.
        $(this).trigger(Rpc.EventType.SYNC, [result.ViewModel, true]);
      }, this)
  );
};

Rpc.EventType = {
  // General server update.
  SYNC: 'SYNC',
  // Concurrency violation.
  STALE: 'STALE'
};
