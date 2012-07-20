$(function () {
  // Set up RPC with service path.
  var rpc = new Rpc(serviceUrl);

  // Set up event bindings between DOM and RPC.
  var view = new View(rpc);

  // Load initial record by id;
  $.proxy(rpc.fetch, rpc, 1)();
});
