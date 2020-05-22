import { InstanceDocument } from 'models/Instance'

export const instanceToHelmName = (instance: InstanceDocument): string => (
  `${instance.id}`
)
