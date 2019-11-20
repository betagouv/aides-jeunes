## Cette documentation est technique. Pour plus d'informations sur [Mes Aides](https://mes-aides.gouv.fr), regardez notre [wiki](https://github.com/sgmap/mes-aides-ui/wiki).

L'interface utilisateur (et le serveur principal) de [mes-aides](https://mes-aides.gouv.fr), un estimateur des prestations sociales françaises pour les particuliers. Il est basé sur simulateur socio-fiscal libre [Openfisca](https://www.openfisca.fr/).


Installing
==========

System dependencies
-------------------

### Ubuntu

Make sure `build-essential`, `mongodb` and `node` 8.x are installed on your machine:

```sh
sudo apt-get install build-essential
sudo apt-get install mongodb
```

### For all platforms

The runtime is Node 8.x for the web application, and Python 3.7 for Openfisca.

You can for example use [`nvm`](https://github.com/creationix/nvm) to install this specific version.

You will need [`pip`](https://pip.pypa.io/) to install Openfisca.


Application
-----------

```sh
git clone https://github.com/sgmap/mes-aides-ui.git
cd mes-aides-ui
npm install
```

Openfisca
---------

Openfisca is compatible with Python 3. So far, Mes Aides relies on Python 3.7. You should [install it in a `virtualenv`](https://virtualenv.pypa.io/en/stable/) to prevent yourself from messing with your main python installation. You can either create the `virtualenv` yourself or rely on tools such as [virtualenvwrapper](https://virtualenvwrapper.readthedocs.io/en/latest/) or [pew](https://github.com/berdario/pew):

```bash
cd mes-aides-ui
virtualenv  --python=python3.7 .venv # To create your virtualenv in ./.venv (a hidden folder)
source .venv/bin/activate # To activate your virtualenv
pip install pip --upgrade # To make sure you're using pip latest version
```

`virtualenv  --python=python3.7 .venv` will fail if your python executable is not `python3.7`. If it does, make sure that `python3.7` is installed and in your path.

Each time you want to run OpenFisca, you have to `source .venv/bin/activate` to get a working OpenFisca environment. Then you can:
```sh
npm run install-openfisca
npm run openfisca
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

Then, start the Openfisca server (in your virtualenv):
```sh
source .venv/bin/activate
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

You can specify ports to run multiple instances

```sh
PORT=9001 WEBPACK_DEV_PORT=8081 LIVERELOAD_PORT=35728 DEBUG_PORT=9230 npm run dev
```
Those ports are the default ones incremented by 1.

WIP - Migration to VueJS
-----
We are currently working on a new front-end based on VueJS instead of AngularJS.
To contribute, you should follow the instructions above (MongoDB and Openfisca are used the exact same way), except the following:

- Checkout to the corresponding branch:
```sh
git checkout origin/vue
```

- Install the corresponding dependencies:
```sh
npm install
```

- Start the VueJS instance instead of the AngularJS one:
```sh
npm run serve
```


Testing
=======

_Disclaimer: the information below is valid for the AngularJS front-end. For the VueJS front-end (WIP), testing will soon be implemented and documented._  

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

_Cette section est uniquement destinée aux administrateurs du serveur de production.
Si vous souhaitez déployer votre propre version de Mes Aides, n'hésitez pas à [nous contacter](mailto:bonjour@mes-aides.gouv.fr)._

Préparation
-----------

En plus de l'intégration continue, ce dépôt est configuré pour avoir du déploiement continu. À l'ajout de commits sur `betagouv/mes-aides-ui#master` les tests sont relancés puis la production mise à jour.

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
