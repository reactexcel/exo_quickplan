import _ from 'lodash';

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 8530,
  graphql: {
    port: 8000
  }
};

export default _.extend(config, require(`./${config.env}`).default);
