## Cette documentation est technique. Pour plus d'informations sur [Mes Aides](https://mes-aides.gouv.fr), regardez notre [wiki](https://github.com/sgmap/mes-aides-ui/wiki).

L'interface utilisateur (et le serveur principal) de [mes-aides](https://mes-aides.gouv.fr), un estimateur des prestations sociales françaises pour les particuliers. Il est basé sur simulateur socio-fiscal libre [Openfisca](https://www.openfisca.fr/).


Installing
==========

System dependencies
-------------------

### Ubuntu

Make sure `build-essential`, `mongodb` and `node` v0.10 are installed on your machine:

```sh
sudo apt-get install build-essential
sudo apt-get install mongodb
```

### For all platforms

The runtime is Node 0.10 for the web application, and Python 2.7 for Openfisca.

You can for example use [`nvm`](https://github.com/creationix/nvm) to install this specific version.

You will need [`pip`](https://pip.pypa.io/) to install Openfisca.


Application
-----------

```sh
git clone https://github.com/sgmap/mes-aides-ui.git
cd mes-aides-ui
npm install
```

### Development mode

If you need to add features to the API, the best is to [`npm link`](https://docs.npmjs.com/cli/link) `sgmap/mes-aides-api` into `mes-aides-ui`, to avoid depending on the published version.


Openfisca
---------

Openfisca relies on python 2. You should [install it in a `virtualenv`](https://doc.openfisca.fr/for_developers.html). Once activated, you can run the following commands:

```sh
cd mes-aides-ui
npm run install-openfisca
```

### Development mode

If you are working on `openfisca-france` and want to use your local version:
```
cd (...)/openfisca-france
pip install -e .
```

Usage
-----

First, start a Mongo server:

```sh
npm run db &
```

Then, start the Openfisca server:
```sh
npm run openfisca
```

Finally, start the server:

```sh
npm start
```

Or, if you want to have live reload on file changes, you can start it with:

```sh
npm run dev
```

If you like TDD, you will probably enjoy this command which will run the tests each time a file in the tests/ folder is modified :

```sh
npm install --global grunt-cli
grunt watch
```


Testing
=======

There are several levels of tests:

* Unit tests run with `npm test`.
* Integration tests run with `npm run test-integration`.
* Business tests from [Ludwig](https://github.com/sgmap/ludwig-ui).

You can safely use `npm test && npm run test-integration` to drive your developments.

Integration tests
-----------------

Integration tests are executed with [Watai](https://github.com/MattiSG/Watai) through `npm run test-integration`. These tests are **currently not run in CI** due to how complex installing all dependencies on a CI VM is.

Most integration tests do not require any business to pass. However business test integration is tested by `ludwig-suite`. Therefore that suite currently fails if business tests were not imported from `npm run db-update` as described in the next section.

Note: `ludwig-suite` can be excluded. In `test/integration/run-integration-tests.sh` you can replace `$TEST_DIR/*-suite` with `$TEST_DIR/[^l]*-suite`.

Business tests
--------------

Business tests are executed in a more convoluted way.

We use [Ludwig](https://github.com/sgmap/ludwig-ui) to help users create business tests. These tests have to be fetched and loaded in your local database so you can execute them on your development machine.
To do so, run `npm run db-update` script at the root of the repository. You will need a running Mongo database (`npm run db`) and SSH access to the production server.


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

Éditer le fichier `openfisca/requirements.txt` en y indiquant la version d'Openfisca que vous souhaitez utiliser.

Ce fichier est au format [`requirements.txt`](https://pip.pypa.io/en/stable/reference/pip_install/#example-requirements-file) de `pip`. Généralement, vous le mettrez à jour pour faire pointer l'un des modules Openfisca vers une branche de développement en attendant la publication de ce module sur PyPI.


Déploiement
-----------

Le serveur de production est rendu opérationnel avec [Puppet](https://puppet.com/). Les fichiers de configurations et de paramétrage sur disponibles dans [un dépôt séparé](https://github.com/sgmap/mes-aides-ops/).

### mes-aides

Des clés SSHs ont été générées pour [lancer des scripts à distance](http://man.openbsd.org/sshd#command=%22command%22) sur le serveur de production.

Sachant que le fichier `deploy` contient la clé privée associée au script de déploiement, ce dernier permet être lancé via la commande suivante :
```sh
ssh root@mes-aides.gouv.fr -i deploy
```

Pour effectuer des modifications plus exotiques, il est nécessaire de se connecter en tant que `root`.

### Déployer une feature branch

Le serveur de production ne permet plus le déploiement de `feature branch`. Cependant, un serveur peut être facilement provisionné pour servir une version spéficique de Mes-Aides. Des indications sont disponibles dans le dépôt de [mes-aides-ops](https://github.com/sgmap/mes-aides-ops/#initial-provisioning). Il s'agit d'initialiser le serveur en indiquant le nom de la branche à utiliser pour mes-aides-ui.

Pour utiliser dans l'instance de staging une feature branch d'`openfisca-france`, éditer le fichier [`openfisca/requirements.txt`](openfisca/requirements.txt), par exemple en remplaçant :

```
openfisca_france==4.0.5
```
par
```
git+https://github.com/sgmap/openfisca-france.git@aah#egg=openfisca-france
```
