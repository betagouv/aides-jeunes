Suivi de l'avancement
=====================

Langue
------

Par souci de lisibilité pour les partenaires, notamment administratifs, la langue utilisée pour la description et le suivi de fonctionnalités est le français.


Stockage
--------

Toutes les évolutions de l'outil, espérées, planifiées ou réalisées, sont représentées par des [_issues_ GitHub](https://help.github.com/articles/about-issues/). L'ensemble des _issues_ sur tous les dépôts composant les différents modules de l'application mes-aides est donc la seule source de vérité sur ses évolutions.

L'état d'avancement de la fonctionnalité représentée par l'_issue_ est donné par un _tag_.


Représentation
--------------

Pour faciliter la lecture du processus et regrouper les _issues_ ouvertes sur tous les différents dépôts, nous utilisons [Waffle](https://waffle.io/sgmap/mes-aides-api).


Processus
---------

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
