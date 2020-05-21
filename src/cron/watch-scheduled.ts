import { DomainTask } from 'models/DomainTask'
import { settings } from 'settings/settings'
import { updateTaskStatus } from 'controllers/update-task-status'
import { runProcessing } from 'controllers/run-processing'
import { InstanceStatus } from 'types/Instance'
import { logTask } from 'controllers/log-task'

const next = async (): Promise<void> => {
  const n = await DomainTask.findOne({ status: 'scheduled' }).sort({ 'createdAt': 'asc' })

  if (!n) {
    console.log('System is waiting for scheduled item')
    return
  }

  console.log(`Start processing ${n.id}`)
  return runProcessing(n)
}

const checkTimedOut = async (): Promise<boolean> => {
  const d = new Date()
  d.setSeconds(d.getSeconds() - settings.timeouts.isTimedOutSec)

  const timedout = await DomainTask.find({
    startedAt: { $lte: d.toISOString() },
    status: 'processing',
  })

  if (timedout.length) {
    await Promise.all(timedout.map(async (i) => {
      await updateTaskStatus(i, 'failed')
      await logTask(i, 'Task is timed out')
    }))
    return true
  }

  return false
}

const checkForStatus = async (status: InstanceStatus): Promise<boolean> => {
  return !!(await DomainTask.findOne({ status }))
}

const checkForScheduled = async (): Promise<void> => {
  if (await checkForStatus('failed')) {
    console.log('System is failed')
    return
  }

  if (await checkTimedOut()) {
    console.log('Processing task is timed out')
    return
  }

  if (await checkForStatus('processing')) {
    console.log('System is busy')
    return
  }

  next()
}

/**
 * Watch if there's any scheduled task
 * @returns {function} Cancel watching
 */
export const watchScheduled = (): () => void => {
  const timer = setInterval(checkForScheduled, settings.timeouts.checkForScheduledEverySec * 1000)
  checkForScheduled()
  return (): void => clearInterval(timer)
}
