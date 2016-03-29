// Very useful extendable timer snippet:
// Modified to reset by x ms rather than extend
// http://stackoverflow.com/a/1957205/319499
export default setAdvancedTimeout;

function setAdvancedTimeout(f, delay) {
  var obj = {
    firetime: delay + (+new Date()), // the extra + turns the date into an int
    called: false,
    canceled: false,
    callback: f
  };
  var callfunc = function() { obj.called = true; f(); };
  obj.reset = function(ms) {
    if (obj.called || obj.canceled) { return false; }
    clearTimeout(obj.timeout);
    obj.timeout = setTimeout(callfunc, ms);
    return obj;
  };
  obj.cancel = function() {
    obj.canceled = true;
    clearTimeout(obj.timeout);
  };
  obj.timeout = setTimeout(callfunc, delay);
  return obj;
}
