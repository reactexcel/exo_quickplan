/* eslint-disable no-console */
import path from 'path';
import webpack from 'webpack';
import express from 'express';
import jwt from 'express-jwt';
import cors from 'cors';
import graphQLHTTP from 'express-graphql';
import proxy from 'express-http-proxy';
import webpackConfig from '../webpack.config';
import config from './config/environment';
import schema from './data/schema';
import { connect } from './data/database';


(async () => {
  // Connect to ArangoDB
  await connect();

  // Populate databases with mock up data
  if (config.seed) {
    require(`./config/seed/${config.env}`);
  }

  if (config.env === 'development') {
    const WebpackDevServer = require('webpack-dev-server'); // eslint-disable-line

    // Launch GraphQL
    const graphql = express();
    app.use(cors())
    const authenticate = jwt({
      secret: new Buffer(config.auth.secret, 'base64'),
      audience: config.auth.clientId
    });
    if (config.auth.requireAuth) {
      graphql.use('/', authenticate, graphQLHTTP({
        graphiql: true,
        pretty: true,
        schema
      }));
    } else {
      graphql.use('/', graphQLHTTP({
        graphiql: true,
        pretty: true,
        schema
      }));
    }
    graphql.listen(config.graphql.port, () => console.log(`GraphQL is listening on port ${config.graphql.port}`));

    // Launch Relay by using webpack.config.js
    const app = new WebpackDevServer(webpack(webpackConfig), {
      contentBase: '/build/',
      proxy: {
        '/graphql': `http://localhost:${config.graphql.port}`
      },
      stats: {
        colors: true
      },
      hot: true,
      historyApiFallback: true,
      disableHostCheck: true
    });

    // Serve static resources
    app.use('/assets/docs', express.static('../../docs/'));
    app.use('/', express.static(path.join(__dirname, '../build')));
    app.listen(config.port, () => console.log(`Relay is listening on port ${config.port}`));
  } else if (config.env === 'production') {
    const graphql = express();
    graphql.use('/', graphQLHTTP({
      graphiql: true,
      pretty: true,
      schema
    }));

    graphql.listen(config.graphql.port, () => console.log(`GraphQL is listening on port ${config.graphql.port}`));

    // Launch Relay by creating a normal express server
    const app = express();
    app.use(cors())
    app.use('/assets/docs', express.static('../../docs/'));
    app.use('/', express.static(path.join(__dirname, '../build')));
    app.use('/graphql', proxy('localhost:8000'));
    app.listen(config.port, () => console.log(`App is listening on port ${config.port}`));
  }
})();
