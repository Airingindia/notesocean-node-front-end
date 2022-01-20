var obfuscate = require('html-obfuscator');
const path = require('path');
const encode = (filepath) => {
    return obfuscate(path.join(__dirname, filepath));
}
module.exports = encode;