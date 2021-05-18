**Si vous lisez ce fichier, c'est que vous pensez pouvoir nous aider d’une manière ou d’une autre, et nous vous en remercions d'ores et déjà ! :)**

Notre objectif est évidemment d’élargir l’étendue des aides simulées en une seule fois. Pour dépasser la limite de nos ressources, nous cherchons à ouvrir au maximum cet outil à la contribution. Ainsi, tout le code du [moteur de calcul](https://github.com/openfisca/openfisca-france) comme de l’[interface utilisateur](https://github.com/sgmap/mes-aides-ui) est sous [licence libre](http://fr.wikipedia.org/wiki/Logiciel_libre), et toute forme de contribution peut aider à l’intégration de nouvelles aides : recherche législative préalable et rédaction des règles à implémenter, ajout de [tests](https://mes-aides.gouv.fr/tests/) pour valider le calcul de prestations…

# Suggérer de nouvelles aides

**Pour suggérer l'ajout d'aides supplémentaires, créez une _issue_** pour chacune d'entre elles, avec la référence la plus officielle possible vers le descriptif de l'aide. Nous cherchons les conditions d'attributions et les modalités de calcul.

Pour faciliter le suivi des demandes, chaque aide demandée est représentée par une [_issue_](https://github.com/sgmap/mes-aides-ui/labels/nouvelle%20aide) identifiée par le _tag_ « [nouvelle aide](https://github.com/sgmap/mes-aides-ui/labels/nouvelle%20aide) », afin que toute personne se sentant concernée puisse appuyer la demande, et en suivre l'évolution.

# Suivre l'avancement

## Langue

Par souci de lisibilité pour les partenaires, notamment administratifs, la langue utilisée pour la description et le suivi de fonctionnalités est le français.

En revanche, pour éviter le coût du changement de contexte, les discussions techniques peuvent se faire en anglais, la langue la plus utilisée dans le cadre du développement logiciel.

## Stockage

Toutes les évolutions de l'outil, espérées, planifiées ou réalisées, sont représentées par des [_issues_ GitHub](https://help.github.com/articles/about-issues/). L'ensemble des _issues_ sur tous les dépôts composant les différents modules de l'application mes-aides est donc la seule source de vérité sur ses évolutions.

L'état d'avancement de la fonctionnalité représentée par l'_issue_ est donné par un _tag_.

## Représentation

Pour faciliter la lecture du processus et regrouper les _issues_ ouvertes sur tous les différents dépôts, nous utilisons [Waffle](https://waffle.io/sgmap/mes-aides-api).

## Processus

Le passage d'une étape du processus est rendu possible par la validation des conditions suivantes.

### À trier → Définition

Décision informelle sur la base de l'analyse des besoins des usagers, des partenaires, des opportunités et contraintes techniques.

### Définition → Implémentation

- [x] Validation de la définition de l'_issue_ par le demandeur.
- [x] Validation de la définition de l'_issue_ par l'équipe technique.
- [x] Création d'un test invalide (selon la modalité la plus indiquée : unitaire pour l'API, via Ludwig pour une prestation, d'intégration pour l'interface…).

### Implémentation → Déploiement

- [x] Passage du (ou des) test(s) associé(s) à la définition.
- [x] Aucune régression n'est détectée par les tests.
- [x] Pour les forks de dépôts externes (notamment OpenFisca), une pull request proposant nos modifications a été ouverte.
- [x] Une revue de code a été faite sur les modifications.

### Déploiement → Communication

- [x] Aucune régression n'est détectée sur les tests applicables en production (Ludwig, test d'intégration pour le moment manuel).

### Communication → Fait

- [x] Le wiki a été mis à jour pour notifier de l'implémentation.
- [x] Si la fonctionnalité touche les utilisateurs, un tweet l'a annoncée.

# Ajouter une aide

Vous êtes un organisme liquidateur ? Lisez plutôt [comment intégrer une nouvelle aide dans Mes Aides](https://github.com/sgmap/mes-aides-ui/wiki/Integrer-une-nouvelle-aide-dans-mes-aides). La documentation ci-dessous est technique.

- Décrire l'organisme liquidateur et l'aide à ajouter dans `app/js/constants/droits.js` (voir plus bas).
- Décrire le type de données dans `lib/simulation/openfisca/prestations.js` du module [`mes-aides-api`](https://github.com/sgmap/mes-aides-api).
- Mettre à jour les données de réponse attendue dans `test/openfisca/mapping/reverse.coffee` du module [`mes-aides-api`](https://github.com/sgmap/mes-aides-api).
- [Coder l'aide dans OpenFisca](https://github.com/sgmap/mes-aides-ui/wiki/Ajouter-une-aide-locale-dans-OpenFisca).

### Description d'une aide

Une aide est décrite dans `app/js/constants/droits.js` par les champs suivants :

- `label` : nom de l'aide. Utiliser le plus officiel possible, sinon, celui validé par l'organisme ; attention aux majuscules.
- `shortLabel` : acronyme de l'aide. Bien vérifier les majuscules et les minuscules.
- `description` : présentation des objectifs et enjeux de l'aide. Entre 280 et 420 caractères (entre 2 et 3 tweets) ; la description commence par le nom de l'aide en sujet d'une phrase active ; ne pas citer Mes Aides ; préférer la 3e personne ; [neutralité de genre](https://github.com/sgmap/beta.gouv.fr/wiki/Publier#syntaxe).
- `link` : URL d'une description de l'aide. Préférer un lien vers `service-public.fr` pour la stabilité. À défaut, vers le site officiel de l'organisme attributeur.

Et l'un des champs suivants :

- `form` : URL d'un formulaire téléchargeable et imprimable. Préférer un lien vers `service-public.fr` pour la stabilité. À défaut, vers le site officiel de l'organisme attributeur.
- `teleservice` : URL d'un téléservice permettant la demande de l'aide.

Tous ces champs sont obligatoires.
