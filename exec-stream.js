
var parseStream = require('ac-parse-stream');

module.exports = execOnStream;

function execOnStream(fn, readable, options) {
  if(options == null) options = {};
  if(options.maxRunning == null) options.maxRunning = 0;
  if(options.requiredFields == null) options.requiredFields = [];
  if(options.requiredFieldValues == null) options.requiredFieldValues = {};

  var maxRunning = options.maxRunning;
  var requiredFields = options.requiredFields;
  var requiredFieldValues = options.requiredFieldValues;

  return new Promise(function(resolve, reject) {
    var queue = [];
    var running = [];

    parseStream(readable, function(data){
      if(
        ! validRequiredFields(data, requiredFields)
        || ! validRequiredFieldValues(data, requiredFieldValues)
      ) {
        // console.log('SKIP %j', data.toString());
        return;
      }
      // console.log('DATA %j', data);
      enqueue(data);
    })
      .then(function(){
        return Promise.all(running);
      })
      .then(function(){
        resolve();
      })
      .catch(reject)
    ;

    function enqueue(data) {
      queue.push(data);
      dequeue();
    }

    function dequeue() {
      if(queue.length === 0) return;
      if(maxRunning > 0 && running.length >= maxRunning) {
        return;
      }
      var promise = fn(queue.shift());
      running.push(promise);
      promise
        .then(function(){
          running.splice(running.indexOf(promise), 1);
          dequeue();
        })
      ;
    }

    function validRequiredFields(data, requiredFields) {
      return ! requiredFields.some(function(field){
        if(data[field] == null) {
          return true;
        }
      });
    }

    function validRequiredFieldValues(data, requiredFieldValues) {
      return ! Object.keys(requiredFieldValues).some(function(field){
        if(data[field] !== requiredFieldValues[field]) {
          return true;
        }
      });
    }
  });
}
