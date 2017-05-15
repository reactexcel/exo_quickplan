export default {
  arango: {
    url: `http://${process.env.DB_PORT_8529_TCP_ADDR || 'root:@localhost'}:8529`,
    databaseName: 'exo-dev'
  },
  foxx: {
    url: `http://${process.env.DB_PORT_8529_TCP_ADDR || 'root:@localhost'}:8529/_db/exo-dev/bbt`
  },
  auth: {
    clientId: 'yAH0klQIbmMoR3AFrsnU5rRjLck8isXQ',
    domain: 'etech.auth0.com',
    callbackURL: 'http://localhost:3000',
    responseType: 'token',
    secret: 'k7LUxO1wV2DLrJSsncnrS6rwvG73or8GmA3ncmrsVJjQJuQGHi77aSbo7etiBkok',
    requireAuth: false
  },
  agent: {
    id: 'uncircled',
    password: 'kiril123'
  },
  seed: false,
  createGraph: false
};
