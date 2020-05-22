import { InstanceDocument } from 'models/Instance'
import { k8sClient } from 'init/k8s-client'

const CRD_GROUP = 'helm.fluxcd.io'
const CRD_VERSION = 'v1'
const IDE_NAMESPACE = 'test'
const CRD_PLURAL = 'helmreleases'

const manifest = {
  apiVersion: 'helm.fluxcd.io/v1',
  kind: 'HelmRelease',
  metadata: {
    name: 'podinfo',
    namespace: 'test',
  },
  spec: {
    chart: {
      repository: 'https://stefanprodan.github.io/podinfo',
      name: 'podinfo',
      version: '3.2.0'
    }
  }
}

export const createInstance = async (instance: InstanceDocument): Promise<void> => {
  await k8sClient.createNamespacedCustomObject(CRD_GROUP, CRD_VERSION, IDE_NAMESPACE, CRD_PLURAL, manifest)
}
