import { k8sClient } from 'init/k8s-client'
import { InstanceDocument } from 'models/Instance'

export const isInstanceDeployed = async (instance: InstanceDocument): Promise<boolean> => {
  const res = await k8sClient.getNamespacedCustomObjectStatus(
    'helmreleases.helm.fluxcd.io',
    'helm.fluxcd.io/v1',
    'test',
    'HelmRelease',
    'podinfo'
  )
  console.log(res)
  return false
}
