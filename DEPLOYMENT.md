**Préparation du déploiement**
==========


API
--------

Pour publier une nouvelle version de l'API, il est nécessaire de publier une nouvelle version de `sgmap/mes-aides-api`.

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

UI
--------
Pousser sur `sgmap/mes-aides-ui#master` la version du code à déployer.




OPENFISCA
--------
Pousser sur `sgmap/openfisca-france#prod`, `sgmap/openfisca-core#prod`, `sgmap/openfisca-parsers#prod` et `sgmap/openfisca-web-api#prod` les versions du code à déployer.

Pour faciliter le rollback, commiter et pousser l'état des différents sous-modules dans `sgmap/openfisca`.



**Déploiement**
==========
Une clé SSH autorisée à se connecter au serveur de production `sgmap.fr` doit être disponible sur la machine qui lance le déploiement.


mes-aides
--------
```sh
ssh deploy@sgmap.fr ./deploy
```

OPENFISCA
--------
```sh
ssh openfisca-mes-aides@sgmap.fr ./deploy
```
