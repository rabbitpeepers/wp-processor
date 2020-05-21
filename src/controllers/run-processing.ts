import { DomainTaskDocument } from 'models/DomainTask'
import { updateTaskStatus } from 'controllers/update-task-status'
import { logTask } from 'controllers/log-task'
import { createInstance } from 'helm-api/create-instance'
import { Instance } from 'models/Instance'

export const runProcessing = async (task: DomainTaskDocument): Promise<void> => {
  await updateTaskStatus(task, 'processing')
  await task.updateOne({ startedAt: new Date() })

  /* SEND TO HELM */
  await logTask(task, 'Sending to HELM operator...')

  const instance = await Instance.findById(task.instanceId)
  await createInstance(instance)

  await Promise.all([
    updateTaskStatus(task, 'processing'),
    task.updateOne({ startedAt: new Date() }),
    logTask(task, 'Sent to HELM operator!')
  ])
}
