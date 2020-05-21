import { DomainTaskDocument } from 'models/DomainTask'

export const logTask = async (task: DomainTaskDocument, text: string): Promise<void> => {
  return task.updateOne({
    $push: { logs: { text } } 
  })
}
