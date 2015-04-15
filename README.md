Installing
==========

System dependencies
-------------------

### Ubuntu

Make sure `build-essential`, `mongodb`, `node` v0.10, `grunt` and `bower` are installed on your machine

```sh
sudo apt-get install build-essential
sudo apt-get install mongodb
```

### For all platforms

The runtime is Node 0.10.

You can for example use [`nvm`](https://github.com/creationix/nvm) to install this specific version.

Once you have Node and npm installed, run:

```sh
npm install --global grunt-cli bower
```


Application
-----------

```sh
git clone https://github.com/sgmap/mes-aides-ui.git
cd mes-aides-ui
npm install
bower install
grunt build
```

### Development mode

If you need to add features to the API, the best is to [`npm link`](https://docs.npmjs.com/cli/link) `sgmap/mes-aides-api` into `mes-aides-ui`, to avoid depending on the published version.


Usage
-----

To start the server :

```sh
npm start
```


[![Build Status](https://secure.travis-ci.org/sgmap/mes-aides-ui.svg)](http://travis-ci.org/sgmap/mes-aides-ui) [![Dependency Status](https://david-dm.org/sgmap/mes-aides-ui.svg)](https://david-dm.org/sgmap/mes-aides-ui)
[![Dev Dependency status](https://david-dm.org/sgmap/mes-aides-ui/dev-status.svg)](https://david-dm.org/sgmap/mes-aides-ui#info=devDependencies&view=table)
[![Code Climate](https://codeclimate.com/github/sgmap/mes-aides-ui/badges/gpa.svg)](https://codeclimate.com/github/sgmap/mes-aides-ui)
[![Test Coverage](https://codeclimate.com/github/sgmap/mes-aides-ui/badges/coverage.svg)](https://codeclimate.com/github/sgmap/mes-aides-ui)
