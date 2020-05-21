import { connect } from 'init/mongodb'
import { watchScheduled } from 'cron/watch-scheduled'
import { watchDeployed } from 'cron/watch-deployed'

const init = async (): Promise<void> => {
  await connect()
  watchScheduled()
  watchDeployed()
}

init()
