import { KubeConfig, CustomObjectsApi } from '@kubernetes/client-node'

const kc = new KubeConfig()
kc.loadFromDefault()

export const k8sClient = kc.makeApiClient(CustomObjectsApi)
