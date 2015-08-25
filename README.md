[Mes Aides](https://mes-aides.gouv.fr), un estimateur des prestations sociales françaises pour les particuliers.


Installation
============

Dépendances système
-------------------

L'environnement d'exécution est Node 0.12.

> Vous pouvez par exemple utiliser [`nvm`](https://github.com/creationix/nvm) pour installer cette version spécifique.


Application
-----------

```sh
git clone https://github.com/sgmap/mes-aides-ui.git --branch=rewrite
cd mes-aides-ui
npm install
```


Usage
-----

Démarrer le serveur : `npm start`.

Arrêter le serveur : `npm stop`.

Test
----

Cette application est couverte par des tests d'intégration écrits avec [Watai](https://github.com/MattiSG/Watai) dans `test/integration`.

Pour les exécuter, lancez `npm test`.


Déploiement
===========

Le déploiement est géré par [`pm2`](https://github.com/Unitech/PM2).

Pour déployer, il suffit d'exécuter `npm run deploy` depuis une machine possédant une clé SSH autorisée à se connecter au serveur indiqué dans le fichier `ecosystem.json`. Ce fichier contient toute la configuration de l'exécution et du déploiement.

Préparation
-----------

### Premier déploiement

Au cas où le serveur de destination changerait, passer le paramètre [`setup`](https://github.com/Unitech/PM2/blob/master/ADVANCED_README.md#deployment-options) à `npm run deploy` pour initialiser le dossier de déploiement :

```sh
npm run deploy setup
```

### OpenFisca

Pousser sur `sgmap/openfisca-france#prod`, `sgmap/openfisca-core#prod`, `sgmap/openfisca-parsers#prod` et `sgmap/openfisca-web-api#prod` les versions du code à déployer.

Pour faciliter le rollback, committer et pousser l'état des différents sous-modules dans `sgmap/openfisca`.
