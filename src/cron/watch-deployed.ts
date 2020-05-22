import { logTask } from 'controllers/log-task'
import { updateTaskStatus } from 'controllers/update-task-status'
import { settings } from 'settings/settings'
import { DomainTask } from 'models/DomainTask'
import { Instance } from 'models/Instance'
import { getInstanceStatus } from 'helm-api/get-instance-status'

const checkForDeployed = async (): Promise<void> => {
  const processingItems = await DomainTask.find({ status: 'processing' })

  if (!processingItems.length) {
    return
  }

  await Promise.all(processingItems.map(async (processing) => {
    await logTask(processing, 'Requesting instance deployment status from HELM...')

    try {
      const instanceDoc = await Instance.findById(processing.instanceId)
      const status = await getInstanceStatus(instanceDoc)

      if (status === 'Succeeded') {
        await Promise.all([
          updateTaskStatus(processing, 'deployed'),
          logTask(processing, 'HELM has confirmed: instance deployed!'),
        ])
      } else if (['ChartFetchFailed', 'Failed'].indexOf(status) !== -1) {
        await Promise.all([
          updateTaskStatus(processing, 'failed'),
          logTask(processing, `HELM deployment has failed: ${status}`),
        ])
      } else {
        await logTask(processing, `HELM Response: Instance is not deployed yet. Status: ${status}`)
      }
    } catch (ex) {
      console.error(ex)
      await Promise.all([
        updateTaskStatus(processing, 'failed'),
        logTask(processing, ex?.message || 'Unknown processing checking error'),
      ])
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
