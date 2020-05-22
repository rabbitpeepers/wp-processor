import { k8sClient } from 'init/k8s-client'
import { InstanceDocument } from 'models/Instance'
import { CRD_GROUP, CRD_VERSION, IDE_NAMESPACE, CRD_PLURAL } from 'settings/k8s'
import { instanceToHelmName } from 'utils/instance-to-helm-name'

export const getInstanceStatus = async (instance: InstanceDocument): Promise<ChartStatus> => {
  const res = await k8sClient.getNamespacedCustomObject(
    CRD_GROUP,
    CRD_VERSION,
    IDE_NAMESPACE,
    CRD_PLURAL,
    instanceToHelmName(instance),
  ) as ChartStatusResponse
  
  return (res.body?.status?.phase) || 'Failed'
}

// @see: https://docs.fluxcd.io/projects/helm-operator/en/stable/references/helmrelease-custom-resource/
export type ChartStatus = 'ChartFetched' |
  'ChartFetchFailed' |
  'Installing' |
  'Upgrading' |
  'Succeeded' |
  'Failed' |
  'RollingBack' |
  'RolledBack' |
  'RollbackFailed'

type ChartStatusResponse = {
  body?: {
    [key: string]: string | object | null
    status?: {
      phase?: ChartStatus
      [key: string]: string | object | null
    }
  }
  [key: string]: string | object | null
}
