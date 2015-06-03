**Préparation du déploiement**
==========


API
--------

Pour publier une nouvelle version de l'API, il est nécéssaire de créer un nouveau tag de version sur `sgmap/mes-aides-api#master`

```sh
cd mes-aides-api
npm version patch
git push
git push --tags
```

Dans le répertoire UI, mettre à jour la référence à l'API dans le fichier `Package.json` :
```json
"sgmap-mes-aides-api": "sgmap/mes-aides-api#vx.y.z",
```

UI
--------
Pousser sur `sgmap/mes-aides-ui#master` la version du code à déployer (y compris la mise à jour de la version de l'API si nécessaire)



OPENFISCA
--------
Pousser sur `sgmap/openfisca-france#prod`, `sgmap/openfisca-core#prod`, `sgmap/openfisca-parsers#prod` et `sgmap/openfisca-web-api#prod` la version du code à déployer

Pour faciliter le rollback, commiter et pousser l'état des différents sous modules dans `sgmap/openfisca`



**Déploiement**
==========

mes-aides
--------
```sh
ssh deploy@sgmap.fr
./deploy
```

OPENFISCA
--------
```sh
ssh openfisca-mes-aides@sgmap.fr
./deploy
```
