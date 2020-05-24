import { env } from 'settings/env'

const mongourl = env.APP_MONGODB_HOST

if (!mongourl) {
  throw new Error('ENV `APP_MONGODB_HOST` is not defined')
}

const smtpurl = env.APP_SMTP_URL

if (!smtpurl) {
  throw new Error('ENV `APP_SMTP_URL` is not defined')
}

export const settings = {
  mongourl,
  smtpurl,
  emailFrom: env.APP_EMAIL_FROM,
  timeouts: {
    checkForScheduledEverySec: 5,
    checkForDeployedEverySec: 5,
    isTimedOutSec: 30,
  },
  mariaDb: {
    host: env.APP_MARIADB_DB_HOST,
    user: env.APP_MARIADB_ROOT_USER,
    password: env.APP_MARIADB_ROOT_PASSWORD,
  },
  crd: {
    namespace: env.APP_CRD_IDE_NAMESPACE,
  },
}
