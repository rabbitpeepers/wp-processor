import { DomainTaskDocument } from 'models/DomainTask'
import { Instance } from 'models/Instance'
import { InstanceStatus } from 'types/Instance'

export const updateTaskStatus = async (task: DomainTaskDocument, status: InstanceStatus): Promise<void> => {
  const instance = await Instance.findById(task.instanceId)
  await Promise.all([
    instance.updateOne({ status }),
    task.updateOne({ status }),
  ])
}
