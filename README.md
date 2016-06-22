
ac-exec-stream
===============

Execute a promise-returning function on matching (or all) data in a stream.

Install
-------

```sh
npm install ac-exec-stream --save
```

Usage
-----

### Example

```js

// Simulate async data on a stream
var stream = new (require('stream').PassThrough);
var max = 10;
var count = 0;
function writeSomething() {
  stream.write(JSON.stringify({
    type: 'counter'
    count: ++count
  })+'\n');
  setTimeout(resolve, Math.round()*1000);
}

// A function that does something with data and resolves the returned promise when done.
function runSomething(data){
  return new Promise(function(resolve, reject) {
    console.log(data.type, data.count); // prints 'counter X'
    // Simulates async data-processing
    setTimeout(resolve, Math.round()*1000);
  });
}

// Execute that function for 'good enough' data streamed from somewhere else
var execStream = require('ac-exec-stream');

execStream(runSomething, stream, {
  // Limit the number of simultaneously running promises
  maxRunning: 3, // falsy or <=0 for unlimited
  // Execute only on certain data-sets.
  requiredFields: [ 'count' ], // != null
  requiredFieldValues: {
    type: 'counter' // strict
  }
})
  .then(function(){
    // Stream did end.
  })
;

```

MIT License
-----------

Copyright (c) 2016 Oliver Leics <oliver.leics@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
