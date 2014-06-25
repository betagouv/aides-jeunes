'use strict';

module.exports = {
  env: 'production',
  ip:   process.env.IP ||
        '0.0.0.0',
  port: process.env.PORT,
  mongo: {
    uri: process.env.MONGOHQ_URL ||
         'mongodb://localhost/dds-dev'
  }
};
