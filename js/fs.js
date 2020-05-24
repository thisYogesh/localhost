const fs = require("fs");
const detectEncoding = require("detect-character-encoding");

module.exports = {
  fetch({ path, encode }, { onDir, onFile, onError }) {
    const stat = this.statSync(path);
    if (stat.$error) {
      onError(stat.$error);
    } else if (stat.isDirectory()) {
      this.readDir(path, encode, onDir);
    } else {
      this.readFile(path, encode, function(err, content){
        const encoding = detectEncoding(content).encoding
        onFile(err, content, encoding)
      });
    }
  },

  readFile(path, encode, cb) {
    fs.readFile(path, encode, function(err, content) {
      cb(err, content, fs);
    });
  },

  readFileSync(path, encode) {
    return fs.readFileSync(path, encode);
  },

  readDir(path, encode, cb) {
    fs.readdir(path, encode, function(err, list) {
      cb(err, list, fs);
    });
  },

  statSync(path) {
    let stat;
    try {
      stat = fs.statSync(path);
    } catch (e) {
      stat = { $error: e };
    }

    return stat;
  }
};