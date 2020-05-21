import { env } from 'settings/env'

const mongourl = env.APP_MONGODB_HOST

if (!mongourl) {
  throw new Error('ENV `APP_MONGODB_HOST` is not defined')
}

export const settings = {
  mongourl,
}
