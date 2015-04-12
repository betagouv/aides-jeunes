mes-aides-ui
============

Installation
===================

Prerequisites
-------------
_Note : This procedure has been checked on a clean ubuntu 12 machine. Please adapt according to your OS_

Make sure build-essential, mongodb, node 0.10, grunt and bower are installed on your machine

```sh
sudo apt-get install mongodb
sudo apt-get install build-essential
```
To install node, you can follow up-to-date instructions on https://github.com/creationix/nvm
```sh
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.24.1/install.sh | bash
source ~/.bashrc
nvm install 0.10
nvm alias default v0.10.38
```
```sh
npm install grunt-cli -g
npm install bower -g
```

Installation
-------------
Clone both `mes-aides-ui` and `mes-aides-api` (https://github.com/sgmap/mes-aides-api.git)

First install the api in the  `mes-aides-api` directory :
```sh
npm link
```

Then install the ui in the  `mes-aides-ui` directory :
```sh
bower install
npm link sgmap-mes-aides-api 
npm install
grunt build
```

Usage
-------------
To start the server : 
```sh
npm start
```


[![Build Status](https://secure.travis-ci.org/sgmap/mes-aides-ui.svg)](http://travis-ci.org/sgmap/mes-aides-ui) [![Dependency Status](https://david-dm.org/sgmap/mes-aides-ui.svg)](https://david-dm.org/sgmap/mes-aides-ui)
[![Dev Dependency status](https://david-dm.org/sgmap/mes-aides-ui/dev-status.svg)](https://david-dm.org/sgmap/mes-aides-ui#info=devDependencies&view=table)
[![Code Climate](https://codeclimate.com/github/sgmap/mes-aides-ui/badges/gpa.svg)](https://codeclimate.com/github/sgmap/mes-aides-ui)
[![Test Coverage](https://codeclimate.com/github/sgmap/mes-aides-ui/badges/coverage.svg)](https://codeclimate.com/github/sgmap/mes-aides-ui)
