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

### In production

[upstart](http://upstart.ubuntu.com/index.html) and [foreman](http://theforeman.org/) are used to run the production server for [mes-aides.gouv.fr](https://mes-aides.gouv.fr/).

[foreverjs](https://github.com/foreverjs/forever) is used to run the server for staging feature branches versions of mes-aides. It needs to be installed before running the deployment scripts: `npm install --global forever`.

The production Mongo server can be (re)started with `ssh root@mes-aides.gouv.fr "service mongod (re)start"`.

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

Commiter et pousser l'état des différents sous-modules dans `sgmap/openfisca`.



Déploiement
-----------

Une clé SSH autorisée à se connecter au serveur de production `mes-aides.gouv.fr` doit être disponible sur la machine qui lance le déploiement.


### mes-aides

```sh
ssh deploy@mes-aides.gouv.fr
```

L'utilisateur `deploy` est utilisé comme un endpoint pour lancer le script de déploiement `~/deploy.sh`. Aucune autre action n'est possible avec cet utilisateur. Pour modifier la procédure de déploiement, se connecter en tant que `root`.

### OpenFisca

```sh
ssh openfisca-mes-aides@mes-aides.gouv.fr ./deploy
```

### Déployer une feature branch

Chaque feature branch est déployée sur le serveur de production par un utilisateur spécifique `mes-aides-$BRANCH`. Lorsque cet utilisateur exécute le script de déploiement `deploy.sh`, les branches `$BRANCH` de mes-aides-ui et [openfisca](https://github.com/sgmap/openfisca) sont déployées. Si cette branche n'existe pas sur le dépôt openfisca, la branche `master` est déployée.

> La taille du nom d'utilisateur étant limitée à 32 caractères sur le serveur de production, le nom de la feature branch ne doit pas dépasser 22 caractères.


#### Ajouter un utilisateur capable de déployer sur le serveur de production

En se connectant en tant que `root`.

```sh
BRANCH=ppa

# Créer l'utilisateur
adduser mes-aides-$BRANCH --disabled-password --gecos ""

# Rendre l'utilisateur accessible depuis l'extérieur
mkdir /home/mes-aides-$BRANCH/.ssh/
curl https://github.com/mesaides-bot.keys > /home/mes-aides-$BRANCH/.ssh/authorized_keys

# Récupérer le script de déploiement
curl https://raw.githubusercontent.com/sgmap/mes-aides-ui/master/deploy.sh > /home/mes-aides-$BRANCH/deploy.sh
chown mes-aides-$BRANCH:mes-aides-$BRANCH /home/mes-aides-$BRANCH/deploy.sh
chmod u+x /home/mes-aides-$BRANCH/deploy.sh
```

#### Sur le poste de développement

- Premier déploiement
```sh
ssh-add ~/.ssh/mes-aides-bot
ssh mes-aides-$BRANCH@mes-aides.gouv.fr "PORT=8200 OPENFISCA_PORT=12200 ./deploy.sh"
ssh root@mes-aides.gouv.fr "service nginx reload"
```

- Redéploiements
```sh
ssh mes-aides-$BRANCH@mes-aides.gouv.fr "./deploy.sh"
```

### Supprimer une instance de feature branch

```sh
ssh mes-aides-$BRANCH@mes-aides.gouv.fr 'forever stopall; rm /etc/nginx/conf.d/$(whoami).conf'
ssh root@mes-aides.gouv.fr "userdel mes-aides-$BRANCH --remove"
```
