import { cleanEnv, bool, str, port, url } from 'envalid';

module.exports = cleanEnv(
  process.env,
  {
    SERVER_PORT: port({ default: 6969 }),
    SERVER_HOST: str({ default: 'localhost' }),
    DAEMON_URL: url()
  },
  { dotEnvPath: null }
);
