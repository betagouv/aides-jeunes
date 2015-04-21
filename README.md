The user interface (and main server) for [mes-aides](https://mes-aides.gouv.fr), a French benefits simulation application for citizens.

> L'interface utilisateur (et le serveur principal) de [mes-aides](https://mes-aides.gouv.fr), un estimateur des prestations sociales françaises pour les particuliers.


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
