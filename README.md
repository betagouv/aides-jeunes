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

## System dependencies

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

## Application

Run the following from the root of the project to install the dependencies

```sh
npm install
```

## Openfisca

:warning: As of now, python3.9 is not yet compatible with all python packages used in Openfisca. It is recommend to use a lower version such as `3.8.6`.

You should [install Python 3 in a virtual environment](https://virtualenv.pypa.io/en/stable/) to prevent yourself from messing with your main python installation. The instructions below rely on the built-in `venv` module so that there are no additional external dependencies:

```bash
python3 -m venv .venv   # create the virtual environment in the .venv folder
source .venv/bin/activate  # activate the virtual environment
pip install pip --upgrade  # make sure we're using the latest pip version
npm run install-openfisca  # install dependencies
```

Then, to start the OpenFisca server, simply run `source .venv/bin/activate` followed by `npm run openfisca`.

In order to start a single worker for OpenFisca, you can run `OPENFISCA_WORKERS=1 npm run openfisca`.

### Development mode

If you are working on `openfisca-france` and want to use your local version:

```
cd (...)/openfisca-france
pip install -e .
```

## Usage

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

# Testing

There are several levels of tests:

- Unit tests are executed by [Jest](https://jestjs.io/fr/) and run with `npm test`.
- End-to-end test are executed with [Cypress](https://www.cypress.io/) with `npm run cypress`

You can safely use `npm test && npm run cypress` to drive your developments.

## Continuous Integration

We use [CircleCI](https://circleci.com/) as a continuous integration and deployment. The CI is currently configured with these jobs:

`install_openfisca`: installs the server openfisca.
`install`: installs the server and the client.
`lint`: identifies and corrects the lint problems.
`test_jest`: runs unit tests.
`test_openfisca_test_generation` : validates the openfisca tests.
`build` : builds the project.
`test_e2e`: runs the end-to-end tests.

## Email

We use the framework [MJML](https://mjml.io/) to design and integrate the templates. [Sendinblue](https://fr.sendinblue.com/) is our service to send emails.

The development server for emails can be easily start with:
`node mjml.js` or `npm run serve-mail`

If you want to verify the email sending, the variable `SEND_IN_BLUE_PRIVATE_KEY="my_private_key""` should be configured in your `.env` file.
You can create a free account(here)[https://app.sendinblue.com/account/register/profile] or request one on the mattermost channel.

## Outil de contribution

L'outil de contribution est une expérimentation permettant de modéliser des aides basées sur des critères simples, uniquement à partir d’un outil en ligne.

Initialement prévu pour le contenu éditorial (les textes, les liens, etc.), NetlifyCMS nous permet de modéliser des critères d’éligibilité et d'ajouter des aides en format YAML.

Pour faire tourner l'application en local, il suffit d'utiliser la commande `netlify dev` dans le dossier `/contribuer`. Plus d'informations sont disponibles sur la documentation : https://docs.netlify.com/cli/get-started/#netlify-dev

Pour accéder à l'outil, il est nécessaire de se connecter. En local, l'URL suivante est nécessaire afin de procéder à votre authentification : https://contribuer-aides-jeunes.netlify.app

## Linting and format

We use ESLint as a linter and Prettier to format the codebase.
We also utilize some ESLint plugins, such as vue-eslint and eslint-plugin-cypress, to provide a support for tests and framework.

More informations :
Eslint: https://eslint.org/
Prettier: https://prettier.io/
Eslint plugin Cypress: https://github.com/cypress-io/eslint-plugin-cypress
Eslint plugin Vue : https://eslint.vuejs.org/user-guide/

## Déboguer le simulateur

Il est possible de visualiser l'ensemble des aides disponibles dans le simulateur en ajoutant un paramètre optionnel dans l'URL des résultats de la simulation :
https://localhost:8080/simulation/resultats?debug

L'option debug permet également de visualiser les étapes du simulateur pendant une simulation en ajoutant `?debug=parcours` comme ceci :
https://localhost:8080/simulation/individu/demandeur/date_naissance?debug=parcours

# Déploiement

## Préparation

En plus de l'intégration continue, ce dépôt est configuré pour avoir du déploiement continu. À l'ajout de commits sur `mes-aides/simulateur#master` les tests sont relancés puis la production mise à jour.

### OpenFisca

Éditer le fichier `openfisca/requirements.txt` en y indiquant la version d'Openfisca que vous souhaitez utiliser.

Ce fichier est au format [`requirements.txt`](https://pip.pypa.io/en/stable/reference/pip_install/#example-requirements-file) de `pip`. Généralement, vous le mettrez à jour pour faire pointer l'un des modules Openfisca vers une branche de développement en attendant la publication de ce module sur PyPI.

## Déploiement

Le serveur de production est rendu opérationnel avec [Puppet](https://puppet.com/). Les fichiers de configurations et de paramétrage sur disponibles dans [un dépôt séparé](https://github.com/mes-aides/ops/).

### mes-aides

Des clés SSHs ont été générées pour [lancer des scripts à distance](http://man.openbsd.org/sshd#command=%22command%22) sur le serveur de production.

Sachant que le fichier `deploy` contient la clé privée associée au script de déploiement, ce dernier permet être lancé via la commande suivante :

```sh
ssh root@mes-aides.gouv.fr -i deploy
```

Pour effectuer des modifications plus exotiques, il est nécessaire de se connecter en tant que `root`.

# Statistiques

## Matomo

Les statistiques utilisateurs sont disponibles sur la plateforme Matomo : https://stats.data.gouv.fr/index.php?module=CoreHome&action=index&idSite=165&period=range&date=previous30#?idSite=165&period=year&date=2021-08-25&segment=&category=Dashboard_Dashboard&subcategory=1

## Graphiques

Les statistiques consolidées dans des graphes sont disponibles sur la plateforme mes-aides-analytics : https://betagouv.github.io/mes-aides-analytics/

Vous trouverez le code code source de la plateforme sur le dépot github : https://github.com/betagouv/mes-aides-analytics

# Vérifier les urls des aides

`npm run test-benefits-urls`

# Outils utiles

## Outil de monitoring et tracking d'erreur

Pour monitorer l'application aides-jeunes, nous utilisons Sentry : https://sentry.io/organizations/betagouv-f7/issues/?project=5709078

## Tracer

Tracer est un outil d'analyse des étapes de calculs Openfisca pour faciliter la résolution de bugs.
Disponible ici : https://github.com/openfisca/tracer

## Robo3t

Outil pour visualiser la base de données en local et en production :
https://robomongo.org/
