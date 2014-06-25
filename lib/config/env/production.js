'use strict';

module.exports = {
  env: 'production',
  ip:   process.env.IP ||
        '0.0.0.0',
  port: process.env.PORT,
  sessionSecret: process.env.SESSION_SECRET ||
        'fghjdfjkdf785a-jreu',
  mongo: {
    uri: process.env.MONGOHQ_URL ||
         'mongodb://localhost/dds-dev'
  }
};
