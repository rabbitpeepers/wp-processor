export type InstanceStatus = 'scheduled' | 'processing' | 'deployed' | 'failed'
export type SystemStatus = InstanceStatus | 'unknown' | 'pending'

export interface Instance {
  subdomain: string
  domain: string
  domainId: string
  status: InstanceStatus
  createdAt: string
  owner: {
    id: string
    email: string
  }
  meta: {
    username: string
    password: string
    firstName: string
    lastName: string
    blogName: string
    email: string
  }
}
