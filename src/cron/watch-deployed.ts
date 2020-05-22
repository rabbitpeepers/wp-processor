import { logTask } from 'controllers/log-task'
import { updateTaskStatus } from 'controllers/update-task-status'
import { settings } from 'settings/settings'
import { DomainTask } from 'models/DomainTask'
import { InstanceDocument } from 'models/Instance'
import { Instance } from 'models/Instance'
import { getInstanceStatus } from 'helm-api/get-instance-status'
import { sendNotification } from 'controllers/send-notification'

const sendSuccess = async (instance: InstanceDocument): Promise<void> => {
  return sendNotification({
    text: `Wordpress instance has been deployed. Instance domain: ${instance.subdomain}.${instance.domain}`,
    subject: `WP Instance's been deployed!`,
    instance,
  })
}

const sendFailed = async (instance: InstanceDocument): Promise<void> => {
  return sendNotification({
    text: `Wordpress instance deployment is failed! Get details via WP Manager logs. Instance domain: ${instance.subdomain}.${instance.domain}.`,
    subject: `WP Instance's deployment is failed!`,
    instance,
  })
}

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
          sendSuccess(instanceDoc),
        ])
      } else if (['ChartFetchFailed', 'Failed'].indexOf(status) !== -1) {
        await Promise.all([
          updateTaskStatus(processing, 'failed'),
          logTask(processing, `HELM deployment has failed: ${status}`),
          sendFailed(instanceDoc),
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
