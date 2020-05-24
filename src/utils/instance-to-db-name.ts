import { InstanceDocument } from 'models/Instance'

export const instanceToDBName = (instance: InstanceDocument): string => (
  `${instance.domain.replace(/\./gi, '_')}_${instance.subdomain}`
)
