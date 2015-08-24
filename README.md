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

```sh
npm start
```

Test
----

Cette application est couverte par des tests d'intégration écrits avec [Watai](https://github.com/MattiSG/Watai) dans `test/integration`. Pour les exécuter, suivez le [guide d'installation de Watai](https://github.com/MattiSG/Watai#installing) puis exécutez `npm test`.


Déploiement
===========

Préparation
-----------

### OpenFisca

Pousser sur `sgmap/openfisca-france#prod`, `sgmap/openfisca-core#prod`, `sgmap/openfisca-parsers#prod` et `sgmap/openfisca-web-api#prod` les versions du code à déployer.

Pour faciliter le rollback, committer et pousser l'état des différents sous-modules dans `sgmap/openfisca`.
