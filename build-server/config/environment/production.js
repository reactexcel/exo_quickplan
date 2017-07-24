'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var databaseName = 'exo-prod';

exports.default = {
  arango: {
    url: 'http://' + (process.env.DB_PORT_8529_TCP_ADDR || 'root:@localhost') + ':8529',
    databaseName: databaseName
  },
  foxx: {
    url: 'http://' + (process.env.DB_PORT_8529_TCP_ADDR || 'root:@localhost') + ':8529/_db/' + databaseName + '/bbt'
  },
  agent: {
    id: 'uncircled',
    password: 'kiril123'
  },
  seed: false
};