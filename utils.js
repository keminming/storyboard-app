const fs = require('fs');

function writeTextToFile(contents, filePath) {
  try {
    fs.writeFileSync(filePath, contents);
    console.log('Text saved');
    return true;
  } catch (err) {
    console.error('Error writing to file at path:' + filePath, err);
    return false;
  }
}

function readTextFromFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    console.log('File contents:', data);
    return data;
  } catch (err) {
    console.error('Error reading file at path:' + filePath, err);
    return null;
  };
}

module.exports = {
  writeTextToFile,
  readTextFromFile
};