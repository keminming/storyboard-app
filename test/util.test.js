const myUtils = require('../utils.js');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('Utils', () => {
  it('testing write file', () => {
    var text = "Hello World";
    var filePath = path.join(process.cwd(), "sample-test.txt");
    var status = myUtils.writeTextToFile(text, filePath);
    assert.strictEqual(status, true);
  });

  it('testing read file', () => {
    var filePath = path.join(process.cwd(), "sample-test.txt");
    var contents = myUtils.readTextFromFile(filePath);
    assert.strictEqual(contents == "Hello World", true);
  });
});
