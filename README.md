## Cette documentation est technique. Pour plus d'informations sur le [simulateur d'aides pour les jeunes](https://mes-aides.1jeune1solution.beta.gouv.fr), regardez notre [wiki](https://github.com/betagouv/aides-jeunes/wiki).

> L'interface utilisateur (et le serveur principal) du [simulateur d'aides et de prestations sociales pour les jeunes](https://mes-aides.1jeune1solution.beta.gouv.fr). Il est basé sur simulateur socio-fiscal libre [Openfisca](https://www.openfisca.fr/).

# Setup

## Stack

- VueJS
- NodeJS
- MongoDB
- OpenFisca (Python, numpy)
- NetlifyCMS ([config](https://github.com/betagouv/aides-jeunes/blob/master/contribuer/public/admin/config.yml))
  - [website](https://contribuer-aides-jeunes.netlify.app)
- Fabric ([fabfile](https://github.com/betagouv/aides-jeunes-ops/blob/main/fabric.yml))

## 3rd parties

- Github Actions ([config](https://github.com/betagouv/aides-jeunes/blob/master/.github/workflows/))
  - Continuous integration and deployment
- Netlify
  - Deloy previews
- SendInBlue
- Matomo ([stats.data.gouv.fr](https://stats.data.gouv.fr/index.php?module=CoreHome&action=index&idSite=165&period=range&date=previous30))
  - [Dedicated site for usage data and impac][https://betagouv.github.io/mes-aides-analytics/] [source](https://github.com/betagouv/mes-aides-analytics)
- Sentry
  - [backend](https://sentry.io/organizations/betagouv-f7/projects/aides-jeunes-node/?project=5709109)
  - [frontend](https://sentry.io/organizations/betagouv-f7/projects/aides-jeunes-front/?project=5709078)

# Front only install

If you want to play with the UI, you can be set up very quickly:

```bash
npm ci
npm run front
```

Cf. `package.json` for more on the underlying commands.

The application should be accessible at `localhost:8080`.

# Full install

## System dependencies

### Ubuntu

Make sure `build-essential`, `mongodb` and `node` 16.x are installed on your machine:

```sh
sudo apt-get install build-essential
sudo apt-get install mongodb
```

### For all platforms

The runtime is Node 16.x for the web application, and Python 3.7 for Openfisca.

You can for example use [`nvm`](https://github.com/creationix/nvm) to install this specific version.

You will need [`pip`](https://pip.pypa.io/) to install Openfisca.

## Application

Run the following from the root of the project to install the dependencies

```sh
npm ci
```

## Openfisca

`Warning MacOS :` go to next section

:warning: As of now, python3.9 is not yet compatible with all python packages used in Openfisca. It is recommend to use a lower version such as `3.8.13`.

You should [install Python 3 in a virtual environment](https://virtualenv.pypa.io/en/stable/) to prevent yourself from messing with your main python installation. The instructions below rely on the built-in `venv` module so that there are no additional external dependencies:

```bash
python3 -m venv .venv   # create the virtual environment in the .venv folder
source .venv/bin/activate  # activate the virtual environment
pip install pip --upgrade  # make sure we're using the latest pip version
npm run install-openfisca  # install dependencies
```

Then, to start the OpenFisca server, simply run `source .venv/bin/activate` followed by `npm run openfisca`.

OpenFisca dependencies are specified in [openfisca/requirements.txt](https://github.com/betagouv/aides-jeunes/blob/master/openfisca/requirements.txt), a basic [Python requirements file](https://pip.pypa.io/en/stable/reference/pip_install/#example-requirements-file). It is possible to refer to non-production commit hashs but is prefered to use _main-merged_ commits.

### Openfisca MacOs install and run

For both intel and apple silicon

```bash
#Check the terminal isn't in rosetta mode. arch should return "arm64"
arch
brew install pyenv
brew install pyenv-virtualenv
brew install openssl
#install proper python's version
pyenv install 3.8.12
pyenv global 3.8.12
#inside project folder
python -m venv .venv   # create the virtual environment in the .venv folder
source .venv/bin/activate  # activate the virtual environment
```

⚠️ Mac M1 `pip install -r openfisca/requirements-m1.txt --no-deps pandas`

⚠️ Mac intel : `npm run install-openfisca`

Then, to start the OpenFisca server, simply run source .venv/bin/activate followed by npm run openfisca

⚠️ if you want to switch from rosetta to Arm, you have to reinstall everything (pyenv, python...) delete .venv and recreate it

### Development mode

If you are working on `openfisca-france` and want to use your local version:

```
cd (...)/openfisca-france
pip install --editable .
```

## Test in production mode

If you want to test locally the app in production mode:

```sh
npm run build
npm run start
```

## Usage

First, start a Mongo server:

```sh
npm run db
```

Then, in another shell (you will have to run `source .venv/bin/activate`), start the Openfisca server:

```sh
OPENFISCA_WORKERS=1 npm run openfisca
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

## Email

We use the framework [MJML](https://mjml.io/) to design and integrate the templates. [Sendinblue](https://fr.sendinblue.com/) is our service to send emails.

The development server for emails can be easily start with: `npm run tools:serve-mail`

If you want to verify the email sending, the variable `SEND_IN_BLUE_PRIVATE_KEY=API_SECRET` should be configured in your `.env` file.
You can create a free account [here](https://app.sendinblue.com/account/register/profile) or request one on the mattermost channel.

## Linting and format

We use [ESLint](https://eslint.org/) as a linter and [Prettier](https://prettier.io/) to format the codebase.
We also utilize some ESLint plugins, such as [vue-eslint](https://eslint.vuejs.org/user-guide/) and [eslint-plugin-cypress](https://github.com/cypress-io/eslint-plugin-cypress), to provide a support for tests and framework.

# Continuous deployment

SSHs keys were generated to [run scripts](http://man.openbsd.org/sshd#command=%22command%22) on the production server.

With the `deploy` key at hand, linked to the deploment script it is possible kick of a now deployment thanks to:

```sh
ssh root@solstice.mes-aides.1jeune1solution.beta.gouv.fr -i deploy
```

For more, a normal/manual root connection is required.

```sh
ssh root@solstice.mes-aides.1jeune1solution.beta.gouv.fr
```

# Other tools scripts & tips

In order to use those tools you need to build the server at least once using the command `npm run build:server`.

- `npm run husky` installs git hooks used to facilitate development and reduce the CI running time.

- `npm run tools:check-links-validity` validates links to 3rd parties in benefits files.

- `npm run tools:cleaner` cleans simulations data older than 31 days.

- `npm run tools:evaluate-benefits <simulationId>` evaluates benefits linked to a simulation id.

- `npm run tools:generate-missing-institutions-aides-velo` generates missing institutions for the package `aides-velo`.

- `npm run tools:geographical-benefits-details` gets the relevant benefits for each commune.

- `npm run tools:get-all-steps` gets all the steps and substeps of a simulation.

- `npm run tools:serve-mail` generates emails which contain the result of a simulation or a survey.

- `npm run tools:test-benefits-geographical-constraint-consistency` validates geographical constraint consistency of benefits.

- `npm run tools:test-definition-periods`validates the periods of openfisca requested variables.

- [Locally](http://localhost:8080/simulation/resultats?debug) or on [production](https://mes-aides.1jeune1solution.beta.gouv.fr/simulation/resultats?debug), it is possible to visualize all the available benefits of the simulator. It is done by adding `debug` as a parameter. It is also possible to set `debug=ppa,rsa` to choose which benefits are listed.

- Adding `debug=parcours` as a parameter, show a debug version of all the steps in the simulator, [locally](https://localhost:8080/simulation/individu/demandeur/date_naissance?debug=parcours) and [production](https://mes-aides.1jeune1solution.beta.gouv.fr/simulation/individu/demandeur/date_naissance?debug=parcours).

- [OpenFisca tracer](https://openfisca.github.io/tracer/) allows you to debug OpenFisca computations. ([source](https://github.com/openfisca/tracer))

# Export simulations data from database

Mongo export to csv.

How to use:
`mongo --quiet db_aides_jeunes --eval "var headers='month,depcom100kp,departement';" tools/mongo-query.js > export.csv`

The `headers`parameter must contains desired headers.

Possible variables:

- `activite`
- `age`
- `avecRessources`
- `departement`
- `depcom`
- `depcom100kp`
- `epci`
- `region`
- `logement`
- `month`
- `+ possible fieldName values in the answers`

## NetlifyCMS development

It is possible to locally debug changes in NetlifyCMS configuration.

- First, [contribuer/public/admin/config.yml#L15](https://github.com/betagouv/aides-jeunes/blob/master/contribuer/public/admin/config.yml#L15) must be uncommented;
- `npx netlify-cms-proxy-server` should be ran from `.` and
- `npm ci` and `npm run dev` should be ran from `contribuer`.
- Netlify CMS should now be accessible at `http://localhost:3000/admin/index.html`

Changes made will be reflected locally instead of generating pull requests in production.
