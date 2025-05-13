# Guide de déploiement du simulateur d'aides sociales pour MAAS Group

Ce document explique comment déployer le simulateur d'aides sociales sur Netlify pour le projet MAAS Group.

## Prérequis

- Un compte Netlify
- Un fork du dépôt GitHub [betagouv/aides-jeunes](https://github.com/betagouv/aides-jeunes)

## Configuration pour le déploiement sur Netlify

Nous avons déjà configuré les fichiers suivants pour faciliter le déploiement sur Netlify :

1. **package.json** : Modification du script de build pour éviter les erreurs avec concurrently
2. **netlify.toml** : Configuration du déploiement avec les variables d'environnement nécessaires

## Étapes de déploiement

### 1. Connectez-vous à Netlify

Allez sur [Netlify](https://app.netlify.com/) et connectez-vous à votre compte.

### 2. Créez un nouveau site

1. Cliquez sur "Add new site" > "Import an existing project"
2. Sélectionnez GitHub comme fournisseur
3. Autorisez Netlify à accéder à vos dépôts si nécessaire
4. Sélectionnez votre fork du dépôt aides-jeunes

### 3. Configurez les paramètres de déploiement

Les paramètres sont déjà configurés dans le fichier `netlify.toml`, mais vous pouvez les vérifier :

- **Branch to deploy**: `main` (ou votre branche personnalisée)
- **Build command**: `npm run build:netlify`
- **Publish directory**: `dist`

### 4. Variables d'environnement

Les variables d'environnement sont déjà configurées dans le fichier `netlify.toml`, mais vous pouvez les modifier si nécessaire :

```
NODE_ENV=production
MES_AIDES_ROOT_URL=https://votre-domaine-netlify.netlify.app
OPENFISCA_INTERNAL_ROOT_URL=https://openfisca.mes-aides.1jeune1solution.gouv.fr
OPENFISCA_PUBLIC_ROOT_URL=https://openfisca.mes-aides.1jeune1solution.gouv.fr
SESSION_SECRET=maas-group-secret-key
SMS_SERVICE_SHOW=false
```

### 5. Lancez le déploiement

Cliquez sur "Deploy site" pour lancer le déploiement.

## Personnalisation de l'interface graphique

Une fois le site déployé, vous pouvez personnaliser l'interface graphique pour l'adapter à la charte MAAS Group :

1. Clonez votre fork sur votre machine locale
2. Créez une nouvelle branche pour vos modifications
3. Modifiez les fichiers CSS pour adapter l'interface à la charte graphique MAAS Group
4. Testez vos modifications localement
5. Poussez vos modifications vers votre fork
6. Netlify déploiera automatiquement les modifications

## Mise à jour depuis le dépôt officiel

Pour maintenir votre fork à jour avec le dépôt officiel :

1. Ajoutez le dépôt officiel comme remote :
   ```bash
   git remote add upstream https://github.com/betagouv/aides-jeunes.git
   ```

2. Récupérez les dernières modifications :
   ```bash
   git fetch upstream
   ```

3. Fusionnez les modifications dans votre branche principale :
   ```bash
   git merge upstream/main
   ```

4. Poussez les modifications vers votre fork :
   ```bash
   git push origin main
   ```

## Résolution des problèmes courants

### Erreur de build avec concurrently

Si vous rencontrez une erreur avec concurrently, vérifiez que le script de build dans package.json est correctement configuré :

```json
"build": "npm run build:server && npm run build:iframes && npm run build:front && npm run copy:templates",
"build:netlify": "npm install concurrently -g && npm run build",
```

### Problèmes avec les variables d'environnement

Assurez-vous que toutes les variables d'environnement nécessaires sont correctement configurées dans le fichier `netlify.toml` ou dans les paramètres de déploiement de Netlify.

## Support

Pour toute question ou problème, veuillez contacter l'équipe de développement MAAS Group.
