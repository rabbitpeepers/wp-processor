import { InstanceDocument } from 'models/Instance'
import { k8sClient } from 'init/k8s-client'
import { CRD_GROUP, CRD_VERSION, IDE_NAMESPACE, CRD_PLURAL } from 'settings/k8s'
import { wordpressManifest } from 'chart/wordpress'

export const createInstance = async (instance: InstanceDocument): Promise<void> => {
  await k8sClient.createNamespacedCustomObject(
    CRD_GROUP,
    CRD_VERSION,
    IDE_NAMESPACE,
    CRD_PLURAL,
    wordpressManifest(instance),
  )
}
