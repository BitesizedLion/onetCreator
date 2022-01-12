const md5 = require('md5');

module.exports = () => { return md5(Math.random().toString(15).substr(10, 20)); }