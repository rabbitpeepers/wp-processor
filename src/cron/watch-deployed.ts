import { logTask } from 'controllers/log-task'
import { updateTaskStatus } from 'controllers/update-task-status'
import { settings } from 'settings/settings'
import { DomainTask } from 'models/DomainTask'
import { isInstanceDeployed } from 'helm-api/is-instance-deployed'

const checkForDeployed = async (): Promise<void> => {
  const processing = await DomainTask.findOne({ status: 'processing' })

  if (!processing) {
    return
  }

  await logTask(processing, 'Requesting instance deployment status from HELM...')

  const isDeployed = await isInstanceDeployed()

  if (isDeployed) {
    await Promise.all([
      updateTaskStatus(processing, 'deployed'),
      logTask(processing, 'HELM has confirmed: instance deployed!')
    ])
  } else {
    await logTask(processing, 'HELM Response: Instance is not deployed yet.')
  }
}

/**
 * Watch if there's any task has already been deployed
 * @returns {function} Cancel watching
 */
export const watchDeployed = (): () => void => {
  const timer = setInterval(checkForDeployed, settings.timeouts.checkForDeployedEverySec * 1000)
  checkForDeployed()
  return (): void => clearInterval(timer)
}
