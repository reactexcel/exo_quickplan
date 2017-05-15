import superagent from 'superagent';
import _ from 'lodash';

// require('superagent-proxy')(superagent);

// npm start -- --proxy

// Proxy ip
// const ENABLE_PROXY = _.includes(process.argv, '--proxy') || false;
// const proxy = 'http://localhost:8080';

// HTTP Methods
export const GET = 'get';
export const POST = 'post';
export const PUT = 'put';
export const DELETE = 'del';
export const PATCH = 'patch';

export default (url, method, data) => {
  const initConnection = superagent[method](url);
  // if (ENABLE_PROXY) {
  //   initConnection.proxy(proxy);
  // }

  return new Promise((resolve, reject) => {
    initConnection.send(data)
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err || !res.ok || !res.body) return reject(err);
        return resolve(res.body);
      });
  });
};
