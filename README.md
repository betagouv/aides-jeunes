## Cette documentation est technique. Pour plus d'informations sur [Mes Aides](https://mes-aides.gouv.fr), regardez notre [wiki](https://github.com/sgmap/mes-aides-ui/wiki).

L'interface utilisateur (et le serveur principal) de [mes-aides](https://mes-aides.gouv.fr), un estimateur des prestations sociales françaises pour les particuliers. Il est basé sur simulateur socio-fiscal libre [Openfisca](https://www.openfisca.fr/).


# Front only install

If you want to play with the UI, you can be set up very quickly:

```bash
npm run fast-install
npm run front
```

Cf. `package.json` for more on the underlying commands.

The application should be accessible at `localhost:8080`.

# Full install

System dependencies
-------------------

### Ubuntu

Make sure `build-essential`, `mongodb` and `node` 8.x are installed on your machine:

```sh
sudo apt-get install build-essential
sudo apt-get install mongodb
```

### For all platforms

The runtime is Node 8.x for the web application, and Python 3 for Openfisca.

You can for example use [`nvm`](https://github.com/creationix/nvm) to install this specific version.

You will need [`pip`](https://pip.pypa.io/) to install Openfisca.


Application
-----------
Run the following from the root of the project to install the dependencies
```sh
npm install
```

Openfisca
---------
:warning: As of now, python3.9 is not yet compatible with all python packages used in Openfisca. It is recommend to use a lower version such as `3.8.6`.

You should [install Python 3 in a `virtualenv`](https://virtualenv.pypa.io/en/stable/) to prevent yourself from messing with your main python installation. You can either create the `virtualenv` yourself or rely on tools such as [virtualenvwrapper](https://virtualenvwrapper.readthedocs.io/en/latest/) or [pew](https://github.com/berdario/pew):

```bash
virtualenv  --python=python3 .venv # To create your virtualenv in ./.venv (a hidden folder)
source .venv/bin/activate # To activate your virtualenv
pip install pip --upgrade # To make sure you're using pip latest version
```

```sh
npm run install-openfisca
npm run openfisca
```

Each time you want to run OpenFisca, you have to `source .venv/bin/activate` to get a working OpenFisca environment.

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
npm run db
```

Then, in another shell (you will have to run `source .venv/bin/activate`), start the Openfisca server:
```sh
npm run openfisca
```

Finally, in a third shell, start the server:

```sh
npm run serve
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

En plus de l'intégration continue, ce dépôt est configuré pour avoir du déploiement continu. À l'ajout de commits sur `mes-aides/simulateur#master` les tests sont relancés puis la production mise à jour.

### OpenFisca

Éditer le fichier `openfisca/requirements.txt` en y indiquant la version d'Openfisca que vous souhaitez utiliser.

Ce fichier est au format [`requirements.txt`](https://pip.pypa.io/en/stable/reference/pip_install/#example-requirements-file) de `pip`. Généralement, vous le mettrez à jour pour faire pointer l'un des modules Openfisca vers une branche de développement en attendant la publication de ce module sur PyPI.

Déploiement
-----------

Le serveur de production est rendu opérationnel avec [Puppet](https://puppet.com/). Les fichiers de configurations et de paramétrage sur disponibles dans [un dépôt séparé](https://github.com/mes-aides/ops/).

### mes-aides

Des clés SSHs ont été générées pour [lancer des scripts à distance](http://man.openbsd.org/sshd#command=%22command%22) sur le serveur de production.

Sachant que le fichier `deploy` contient la clé privée associée au script de déploiement, ce dernier permet être lancé via la commande suivante :
```sh
ssh root@mes-aides.gouv.fr -i deploy
```

Pour effectuer des modifications plus exotiques, il est nécessaire de se connecter en tant que `root`.
