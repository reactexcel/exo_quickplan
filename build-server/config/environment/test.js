'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  arango: {
    url: 'http://' + (process.env.DB_PORT_8529_TCP_ADDR || 'localhost') + ':8529',
    databaseName: 'exo-test'
  }
};