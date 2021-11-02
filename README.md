## Cette documentation est technique. Pour plus d'informations sur le [simulateur d'aides pour les jeunes](https://mes-aides.1jeune1solution.beta.gouv.fr), regardez notre [wiki](https://betagouv/aides-jeunes/wiki).

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

- CircleCI ([config](https://github.com/betagouv/aides-jeunes/blob/master/.circleci/config.yml#L197-L225))
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
npm run fast-install
npm run front
```

Cf. `package.json` for more on the underlying commands.

The application should be accessible at `localhost:8080`.

# Full install

## System dependencies

### Ubuntu

Make sure `build-essential`, `mongodb` and `node` 12.x are installed on your machine:

```sh
sudo apt-get install build-essential
sudo apt-get install mongodb
```

### For all platforms

The runtime is Node 12.x for the web application, and Python 3.7 for Openfisca.

You can for example use [`nvm`](https://github.com/creationix/nvm) to install this specific version.

You will need [`pip`](https://pip.pypa.io/) to install Openfisca.

## Application

Run the following from the root of the project to install the dependencies

```sh
npm ci
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


OpenFisca dependencies are specified in [openfisca/requirements.txt](https://github.com/betagouv/aides-jeunes/blob/master/openfisca/requirements.txt), a basic [Python requirements file](https://pip.pypa.io/en/stable/reference/pip_install/#example-requirements-file). It is possible to refer to non-production commit hashs but is prefered to use _main-merged_ commits.

### Development mode

If you are working on `openfisca-france` and want to use your local version:

```
cd (...)/openfisca-france
pip install --editable .
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

The development server for emails can be easily start with:
`node mjml.js` or `npm run serve-mail`

If you want to verify the email sending, the variable `SEND_IN_BLUE_PRIVATE_KEY=API_SECRET` should be configured in your `.env` file.
You can create a free account(here)[https://app.sendinblue.com/account/register/profile] or request one on the mattermost channel.

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

- `npm run test-benefits-urls` validate links to 3rd parties.

- [Locally](https://localhost:8080/simulation/resultats?debug) or on [production](https://mes-aides.1jeune1solution.beta.gouv.fr/simulation/resultats?debug), it is possible to visualize all the available benefits of the simulator. It is done by adding `debug` as a parameter. It is also possible to set `debug=ppa,rsa` to choose which benefits are listed.

- Adding `debug=parcours` as a parameter, show a debug version of all the steps in the simulator, [locally](https://localhost:8080/simulation/individu/demandeur/date_naissance?debug=parcours) and [production](https://mes-aides.1jeune1solution.beta.gouv.fr/simulation/individu/demandeur/date_naissance?debug=parcours).

- [OpenFisca tracer](https://openfisca.github.io/tracer/) can allow you to debug OpenFisca computations. ([source](https://github.com/openfisca/tracer))


## NetlifyCMS development

It is possible to locally debug changes in NetlifyCMS configuration.

- First, [contribuer/public/admin/config.yml#L15](https://github.com/betagouv/aides-jeunes/blob/master/contribuer/public/admin/config.yml#L15) must be uncommented;
- `npx netlify-cms-proxy-server` should be ran from `.` and
- `npm run dev` should be ran from `contribuer`.

Changes made will be reflected locally instead of generating pull requests in production.
