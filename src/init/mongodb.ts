import mongoose from 'mongoose'
import { settings } from 'settings/settings'

export const connect = (): Promise<typeof import('mongoose')> => {
  mongoose.Promise = global.Promise

  return mongoose.connect(settings.mongourl, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
}
