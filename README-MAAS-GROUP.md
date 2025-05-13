# Simulateur d'aides sociales MAAS Group

Ce projet est un simulateur d'aides sociales personnalisé pour MAAS Group, basé sur le simulateur officiel du gouvernement [mes-aides.1jeune1solution.beta.gouv.fr](https://mes-aides.1jeune1solution.beta.gouv.fr).

## Fonctionnalités

- Interface utilisateur personnalisée aux couleurs de MAAS Group
- Calcul des aides sociales basé sur le moteur OpenFisca
- Sauvegarde des simulations pour les utilisateurs
- Redirection vers les sites officiels pour les demandes d'aides

## Déploiement sur Netlify

Le simulateur est configuré pour être déployé facilement sur Netlify.

### Prérequis

- Un compte Netlify
- Git installé sur votre machine

### Étapes de déploiement

1. Clonez ce dépôt sur votre machine locale :
   ```bash
   git clone https://github.com/Arote68/aides-jeunes.git
   cd aides-jeunes
   ```

2. Connectez-vous à Netlify et créez un nouveau site à partir de Git :
   - Sélectionnez le dépôt GitHub contenant le code du simulateur
   - Configurez les paramètres de build :
     - Build command: `npm ci && npm run build:front && mkdir -p dist-server/backend/lib/mes-aides/emails/templates`
     - Publish directory: `dist`

3. Configurez les variables d'environnement suivantes dans les paramètres du site Netlify :
   - `NODE_VERSION`: 18.16.1
   - `NODE_ENV`: production
   - `OPENFISCA_INTERNAL_ROOT_URL`: https://openfisca.mes-aides.1jeune1solution.gouv.fr
   - `OPENFISCA_PUBLIC_ROOT_URL`: https://openfisca.mes-aides.1jeune1solution.gouv.fr
   - `SESSION_SECRET`: maas-group-secret-key
   - `SMS_SERVICE_SHOW`: false

4. Déployez le site :
   - Le déploiement se fera automatiquement après avoir poussé les modifications sur la branche principale
   - Vous pouvez également déclencher un déploiement manuel depuis le tableau de bord Netlify

## Personnalisation

Le simulateur a été personnalisé pour MAAS Group avec :

- Une palette de couleurs personnalisée (bleu MAAS Group)
- Un logo et une identité visuelle propres à MAAS Group
- Des textes et descriptions adaptés aux services de MAAS Group
- Une section de sauvegarde des simulations pour les utilisateurs

## Maintenance

Pour mettre à jour le simulateur :

1. Modifiez les fichiers source selon vos besoins
2. Testez localement avec `npm run dev`
3. Poussez vos modifications sur GitHub
4. Netlify déploiera automatiquement les changements

## Développement local

Pour exécuter le simulateur localement :

```bash
# Installer les dépendances
npm ci

# Lancer le serveur de développement
npm run dev
```

Le simulateur sera accessible à l'adresse http://localhost:8080

## Licence

Ce projet est basé sur le simulateur d'aides sociales du gouvernement français, sous licence Etalab 2.0.
