import { InstanceDocument } from 'models/Instance'
import { k8sClient } from 'init/k8s-client'
import { CRD_GROUP, CRD_VERSION, IDE_NAMESPACE, CRD_PLURAL } from 'settings/k8s'
import { instanceToHelmName } from 'utils/instance-to-helm-name'

const buildManifest = (instance: InstanceDocument): object => ({
  apiVersion: 'helm.fluxcd.io/v1',
  kind: 'HelmRelease',
  metadata: {
    name: instanceToHelmName(instance),
    namespace: IDE_NAMESPACE,
  },
  spec: {
    chart: {
      repository: 'https://stefanprodan.github.io/podinfo',
      name: 'podinfo',
      version: '3.2.0',
    },
  },
})

export const createInstance = async (instance: InstanceDocument): Promise<void> => {
  await k8sClient.createNamespacedCustomObject(
    CRD_GROUP,
    CRD_VERSION,
    IDE_NAMESPACE,
    CRD_PLURAL,
    buildManifest(instance)
  )
}
