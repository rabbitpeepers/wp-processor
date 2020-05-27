import { IDE_NAMESPACE } from 'settings/k8s'
import { InstanceDocument } from 'models/Instance'
import { instanceToHelmName } from 'utils/instance-to-helm-name'
import { instanceToDBName } from 'utils/instance-to-db-name'
import { settings } from 'settings/settings'
import { generate } from 'generate-password'

export const wordpressManifest = (instance: InstanceDocument): object => {
  const helmName = instanceToHelmName(instance)
  const dbName = instanceToDBName(instance)
  const dbPassword = generate({ length: 10 })

  return {
    apiVersion: 'helm.fluxcd.io/v1',
    kind: 'HelmRelease',
    metadata: {
      name: helmName,
      namespace: IDE_NAMESPACE,
    },
    spec: {
      chart: {
        repository: 'https://charts.bitnami.com/bitnami',
        name: 'wordpress',
        version: '9.3.3',
      },
      values: {
        // Blog/Site Info
        wordpressUsername: instance.meta.username,
        wordpressPassword: instance.meta.password,
        wordpressEmail: instance.meta.email,
        wordpressFirstName: instance.meta.firstName,
        wordpressLastName: instance.meta.lastName,
        wordpressBlogName: instance.meta.blogName,
        wordpressScheme: 'https',
        healthcheckHttps: true,
        readinessProbeHeaders: [{
          name: "X-Forwarded-Proto",
          value: "https"
        }],
        livenessProbeHeaders: [{
          name: "X-Forwarded-Proto",
          value: "https"
        }],
        // Database Settings
        externalDatabase: {
          host: settings.mariaDb.host,
          user: dbName,
          password: dbPassword,
          database: dbName,
        },
        // ingress section
        ingress: {
          enabled: true,
          hostname: `${instance.subdomain}.${instance.domain}`,
          annotations: {
            'kubernetes.io/ingress.class': 'public',
          },
        },
        extraEnv: [{
          name: 'MARIADB_ROOT_USER',
          value: settings.mariaDb.user,
        }, {
          name: 'MARIADB_ROOT_PASSWORD',
          value: settings.mariaDb.password,
        }, {
          name: 'MARIADB_HOST',
          value: settings.mariaDb.host,
        }, {
          name: 'MYSQL_CLIENT_CREATE_DATABASE_NAME',
          value: dbName,
        }, {
          name: 'MYSQL_CLIENT_CREATE_DATABASE_USER',
          value: dbName,
        }, {
          name: 'MYSQL_CLIENT_CREATE_DATABASE_PASSWORD',
          value: dbPassword,
        }],
        // Disabling MariaDB
        mariadb: {
          enabled: false,
        },
      },
    }
  }
}
