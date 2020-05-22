import { logTask } from 'controllers/log-task'
import { updateTaskStatus } from 'controllers/update-task-status'
import { settings } from 'settings/settings'
import { DomainTask } from 'models/DomainTask'
import { Instance } from 'models/Instance'
import { isInstanceDeployed } from 'helm-api/is-instance-deployed'

const checkForDeployed = async (): Promise<void> => {
  const processingItems = await DomainTask.find({ status: 'processing' })

  if (!processingItems.length) {
    return
  }

  await Promise.all(processingItems.map(async (processing) => {
    await logTask(processing, 'Requesting instance deployment status from HELM...')

    const instanceDoc = await Instance.findById(processing.instanceId)
    const isDeployed = await isInstanceDeployed(instanceDoc)

    if (isDeployed) {
      await Promise.all([
        updateTaskStatus(processing, 'deployed'),
        logTask(processing, 'HELM has confirmed: instance deployed!')
      ])
    } else {
      await logTask(processing, 'HELM Response: Instance is not deployed yet.')
    }
  }))
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
