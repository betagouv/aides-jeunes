The user interface (and main server) for [mes-aides](https://mes-aides.gouv.fr), a French benefits simulation application for citizens.

> L'interface utilisateur (et le serveur principal) de [mes-aides](https://mes-aides.gouv.fr), un estimateur des prestations sociales françaises pour les particuliers.


Installing
==========

System dependencies
-------------------

### Ubuntu

Make sure `build-essential` and `libkrb5-dev` are installed on your machine:

```sh
sudo apt-get install build-essential
sudo apt-get install libkrb5-dev
```

Note : `libkrb5-dev` is needed to install `kerberos`, an optional dependency of `mongodb-core`. This is yet unclear why npm installs it.

### For all platforms

Mes Aides expects a [Mongo](http://www.mongodb.org) database to be available. If you don't have it yet, [install the Mongo database server](https://www.mongodb.org/downloads) for your platform.

The runtime is [Node 0.12](https://nodejs.org/en/).

You can for example use [`nvm`](https://github.com/creationix/nvm) to install this specific version.

Once you have Node and npm installed, run:

```sh
npm install --global grunt-cli
```


Application
-----------

```sh
git clone https://github.com/sgmap/mes-aides-ui.git
cd mes-aides-ui
npm install
grunt build
```

### Development mode

If you need to add features to the API, the best is to [`npm link`](https://docs.npmjs.com/cli/link) `sgmap/mes-aides-api` into `mes-aides-ui`, to avoid depending on the published version.


Usage
-----

First, start a Mongo server:

```sh
mongod --dbpath db
```

Then, start the server:

```sh
npm start
```

or if you want to use grunt (with livereload), you can start it with :

```sh
grunt serve
```

If you like TDD, you will probably enjoy this command which will run the tests each time a file in the tests/ folder is modified :

```sh
grunt watch
```


Testing
=======

There are several levels of tests. You can safely use `npm test` to drive your developments.

- Syntax tests are executed with `grunt jshint`.
- Unit tests are executed with `grunt test`.

Integration tests are executed in a more convoluted way.

We use [Ludwig](https://github.com/sgmap/ludwig-ui) to help users create integration tests. These tests have to be fetched and loaded in your local database so you can execute them on your development machine.
To do so, use the `import-tests.sh` script at the root of the repository. You will need to have a running Mongo database, and SSH access to the production server.


Déploiement
===========

Préparation
-----------

### API

Pour publier une nouvelle version de l'application qui inclut des modifications de l'API, il est nécessaire de publier une nouvelle version de `sgmap/mes-aides-api` et de mettre à jour la référence à cette version dans `sgmap/mes-aides-ui`.

Cette API est un module NPM, mais n'est pas publiée sur le registre public NPM. Il faut donc synchroniser les tags Git avec le numéro de version indiqué dans le `package.json`. Le plus simple est de laisser NPM effectuer cette opération, en utilisant les commandes suivantes :

```sh
cd mes-aides-api
npm version patch
git push
git push --tags
```

> Il est possible de remplacer `patch` par `minor` selon les conventions [SemVer](http://semver.org).

Dans le module `sgmap/mes-aides-ui`, mettre à jour la référence à l'API dans le fichier `package.json` :

```json
"sgmap-mes-aides-api": "sgmap/mes-aides-api#vx.y.z",
```

### UI

Pousser sur `sgmap/mes-aides-ui#master` la version du code à déployer.


### OpenFisca

Pousser sur `sgmap/openfisca-france#prod`, `sgmap/openfisca-core#prod`, `sgmap/openfisca-parsers#prod` et `sgmap/openfisca-web-api#prod` les versions du code à déployer.

Pour faciliter le rollback, commiter et pousser l'état des différents sous-modules dans `sgmap/openfisca`.



Déploiement
-----------

Une clé SSH autorisée à se connecter au serveur de production `sgmap.fr` doit être disponible sur la machine qui lance le déploiement.


### mes-aides

```sh
ssh deploy@sgmap.fr ./deploy
```

### OpenFisca

```sh
ssh openfisca-mes-aides@sgmap.fr ./deploy
```
