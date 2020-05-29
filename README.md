# WP Processor

Admin panel for creating new WP instances.

## Folder structure

```shell
  / - ROOT dir
```

## QUICK START

### Copy example env

```shell
cp example-env .env
```

if you don't have plans to use docker-compose - change ENV's

### Kubernetes cluster

create secrets with your own parameter

```yaml
---
apiVersion: v1
kind: Secret
metadata:
  name: wp-processor
  namespace: wp-manager
type: Opaque
stringData:
  env: |
    APP_MONGODB_HOST=mongodb://wp-mongodb:27017/wp
    APP_SMTP_URL=smtp://user:pass@maildev:25
    APP_EMAIL_FROM=support@wp-processor.com
    APP_MARIADB_DB_HOST=dbhost
    APP_MARIADB_ROOT_USER=rootuser
    APP_MARIADB_ROOT_PASSWORD=rootpass
    APP_CRD_IDE_NAMESPACE=test
```

after you can create additional resources via

```shell
  kubectl apply -f kubernetes/wp-processor/
  #if you wish - maildev
  kubectl apply -f kubernetes/maildev/
```

#### mongodb admin

```js
use wp;
db.users.find()
db.users.find().pretty()
db.users.update({username: 'dzirg44'}, {$set : {role: 'admin'}})
```

#### show tasks

```js
use wp;
db.getCollection("domaintasks").find({}).pretty();
```

#### show instances

```js
use wp;
db.getCollection("instances").find({}).pretty();
```

#### remove failed tasks

```js
use wp;
db.domaintasks.deleteMany({status: "failed"})
db.instances.deleteMany({status: "failed"})
```
