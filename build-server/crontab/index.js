'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _nodeCron = require('node-cron');

var _nodeCron2 = _interopRequireDefault(_nodeCron);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import all crontabs
// every file in crontab/ should return json config with expression and func definition
// expression : '*/10 * * * *', // (send every 10 minutes)
// func : sendRemindEmail
function startCron() {
  _fs2.default.readdirSync(__dirname).filter(function (file) {
    return file.lastIndexOf('.js') >= 0 && file !== 'index.js';
  }).map(function (file) {
    var config = require(_path2.default.join(__dirname, file)).default;
    _nodeCron2.default.schedule(config.expression, config.func, true);
    if (config.immediateStart) {
      config.func();
    }
    return file;
  });
}

exports.default = startCron;