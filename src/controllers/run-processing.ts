import { DomainTaskDocument } from 'models/DomainTask'
import { updateTaskStatus } from 'controllers/update-task-status'
import { logTask } from 'controllers/log-task'

export const runProcessing = async (task: DomainTaskDocument): Promise<void> => {
  await updateTaskStatus(task, 'processing')
  await task.updateOne({ startedAt: new Date() })

  await Promise.all([
    updateTaskStatus(task, 'processing'),
    task.updateOne({ startedAt: new Date() }),
    logTask(task, 'Sent to HELM operator')
  ])
}
