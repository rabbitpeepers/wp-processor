import { connect } from 'init/mongodb'
import { watchScheduled } from 'cron/watch-scheduled'

const init = async (): Promise<void> => {
  await connect()
  watchScheduled()
}

init()
