---
title: 🛠 Ajouter une aide 2ème partie
duration: 60
prerequisites:
  - ajouter-une-institution
  - ajouter-une-aide-partie-1
---

L'objectif de cette contribution est d'ajouter une première aide dans le simulateur.

Il s'agira d'une version simplifiée par rapport à la réalité mais qui constituera déjà une première étape. La complexité de cette aide sera intégrée et mise en compte progressivement.

## Préparer l'environnement de travail - 10 minutes max

Avec cette contribution, vous allez écrire de premières règles dans un moteur de calculs. Le moteur de calculs que nous utilisons s'appelle OpenFisca. Pour vous faciliter la tâche, nous avons indiqué comment obtenir un environnement de travail en quelques minutes.

### Se créer un compte sur GitHub - 3 minutes max

GitHub est une plateforme qui facilite la collaboration autour des codes sources.

En développant en code ouvert, de nombreux outils facilitant la collaboration sont mis à disposition gratuitement.

Nous vous conseillons de vous créer un compte **personnel**, en effet, l'activité d'un compte GitHub est à valoriser pour les personnes qui travaillent dans le numérique.

Pour vous inscrire, c'est [ici](https://github.com/join).

- Username/Email/Mot de passe
- « Verifier » pour valider que vous n'êtes pas un robot
- « Join a free plan »
- Validez votre email à partir du lien dans l'email que vous avez reçu
- « Skip this for now »

Vous devriez arriver sur une page qui ressemble à ça :

![Page d'accueil de GitHub](/img/ajouter-une-aide/github.png)

### Lancer un environnement de travail en ligne - 4 minutes max

Les travaux que nous réalisons sont dans leur grande majorité accessible à tous en ligne. Les règles de calculs des aides ajoutées par ou avec des partenaires sont regroupées dans ce que l'on appelle un dépôt. Il est accessible à la page [https://github.com/openfisca/openfisca-france-local](https://github.com/openfisca/openfisca-france-local) sur GitHub.

Un dépôt (ici _openfisca/openfisca-france-local_) sur GitHub regroupe :

- des dossiers et des fichiers, en l'occurence de la documentation et les fichiers OpenFisca contenant les règles de calculs (_Code_ - cf. n°1 sur la capture d'écran)
- des discussions sur ces fichiers, leur limitation, leur améliorations potentielles (_Issues_ - n°2)
- des suggestions d'amélioration, des nouvelles contributions (_Pull requests_ - n°3).

![Page du dépôt openfisca-france-local avec les parties importantes numérotées](/img/ajouter-une-aide/github-openfisca-france-local.png)

Pour continuer, vous aller dupliquer/cloner/_fork_ notre dépôt pour en créer un à vous et à vous seul. Dans ce nouveau dépôt vous pourrez faire ce que bon vous semble. Vous pourrez ajouter le nécessaire pour votre nouvelle aide et ensuite nous proposer de l'ajouter dans notre dépôt. Pour cela vous devez utiliser le bouton en haut à droite « _Fork_ » (cf. n°4) avec le symbole en forme de Y.

Après quelques instants vous devriez vous retrouver sur une page très similaire mais cela sera votre espace à vous. Le nom du dépôt n'est plus _openfisca/openfisca-france-local_ (cf. n°5) mais _XXXX/openfisca-france-local_ où XXXX est votre nom d'utilisateur sur GitHub.

Avec ce nouveau dépôt, vous allez pouvoir créer un environnement de travail fonctionnel en quelques clic en utilisant GitPod.

GitPod est un service en ligne qui permet de créer un tel environnement dans votre navigateur sans avoir à installer quoi que ce soit. Ce n'est pas une solution pour le long terme mais c'est extrêmement pratique lorsque l'on souhaite expérimenter.

Pour cela vous pouvez cliquer le bouton « Open in GitPod » au début du texte juste en dessous de la liste des fichiers et des dossiers (cf. n°6).

- « Login with GitHub and start coding »
- « Username/Password » si vous n'êtes plus connecté à GitHub
- « Authorize gitpod-io » une ou deux fois (les permissions demandées par GitPod évoluent)
- Cochez « I agree to the terms of service » et validez

Après environ une minute d'installation, vous devriez arriver sur l'interface suivante :

![Interface de GitPod](/img/ajouter-une-aide/gitpod.png)

Nous allons commencer par décrire les 3 parties les plus importantes de cet écran :

- sur la gauche (1), il y a l'explorateur de fichiers et de dossiers.
- en centre (2), vous pouvez accéder au contenu des fichiers. Au départ, le fichier _README_ est ouvert. Généralement ce fichier contient des informations et des instructions qui permettent de se découvrir le projet.
- en bas (3), il y a ce qu'on appelle un terminal. C'est un outil qui permet de communiquer avec l'ordinateur.

### Utiliser le terminal

Pour donner un exemple :

- Cliquez dans la zone en bas (n'importe où dans la zone).
  - Le petit carré noir va devenir gris pour indiquer que nous sommes bien dans la zone.
- Écrivez « date », cela devrait aussi s'afficher dans la zone.
- Appuyez sur la touche « Entrée » de votre clavier.
  - Cela devrait faire apparaître, la date et l'heure actuelle (en anglais). Au moment de l'écriture de ce document, cela affiche `Wed 06 May 2020 02:51:06 PM UTC`.

Écrire « date » dans un terminal et appuyer sur « Entrée » est souvent appelé « lancer la commande `date` » ou encore « exécuter la commande `date` ».

> Astuce : Si vous n'écrivez que « da » puis appuyez deux fois sur la touche tabulation (↹ à gauche de la lettre A) cela doit faire apparaitre une liste de mots qui sont les commandes que comprend l'ordinateur. En rajoutant un « t » et en faisant à nouveau « tabulation », le « e » est rajouté automatiquement.

C'est bien de pouvoir demander à l'ordinateur d'afficher la date et l'heure mais ce n'est pas vraiment pour ça que vous êtes là. Continuons.

### Vérifier que votre environnement est fonctionnel - 12 minutes max

Pour cela, vous pouvez lancer la commande `openfisca_local_test tests/test_dispositif.yml`. Vous pouvez copier-coller le texte depuis ce document (en selectionnant le texte avec la souris puis avec votre clavier et les combinaisons Ctrl+C, Ctrl+V).

Cela devrait écrire dans le terminal quelque chose comme ça :

```console
====================== test session starts ======================
platform linux -- Python 3.8.2, pytest-5.4.1, py-1.8.1, pluggy-0.13.1
rootdir: /workspace/openfisca-france-local
plugins: pylama-7.7.1
collected 1 item

tests/test_dispositif.yml .

================= 2 passed in 0.02s =================
```

Revenons plus en détails sur ce que vous venez de faire.

La commande `openfisca_local_test tests/test_dispositif.yml` s'est terminée avec un message qui ressemble à

```console
--------------- 2 passed --------------------
```

Cela signifie que 2 deux [tests](<https://fr.wikipedia.org/wiki/Test_(informatique)>) ont été exécutés avec succès.

Dans le fichier `tests/test_dispositif.yml`, il y a donc deux tests. Vous pouvez utiliser l'explorateur de fichiers de gauche pour accéder à ce fichier. En cliquant sur :

- « tests » puis
- « test_dispositif.yml ».

Le contenu du fichier devrait apparaître au centre de votre fenêtre. Cela devrait ressembler à ça (avec des couleurs différentes) :

```yaml
- period: 2018-01
  input:
    age: 18
  output:
    test_dispositif: true

- period: 2018-01
  input:
    age: 0
  output:
    test_dispositif: false
```

Les deux tirets représentent le début de chaque test. Chacun comporte :

- une période
- des valeurs de variables en entrée `input` et
- des valeurs de variables en sortie `output`.

Dans le premier test, on indique `18` pour la variable `age` (c'est un âge en année) et **on s'attend en sortie** à ce que la valeur de la variable `test_dispositif` soit égale à _true_ ou _vrai_ en français.
Dans le second test, on donne un âge de 0 et on s'attend à ce que `test_dispositif` vaut _false_ ou _faux_ en français.

Afin de mieux comprendre ce qui se passe avec ces tests nous allons les modifier un peu et voir comment évoluent les résultats de la commande `openfisca_local_test tests/test_dispositif.yml`. On va remplacer la valeur de `age` dans le second test par `17`. Il faut enregistrer les modifications en cliquant sur « File » et « Save » ou avec le clavier Ctrl+S. Ensuite, lancez à nouveau la commande `openfisca_local_test tests/test_dispositif.yml`.

Cette fois-ci, le résultat ne devrait plus afficher `2 passed` mais `1 failed, 1 passed`. En regardant en détail, il est indiqué qu'il y a une erreur avec le second test. La valeur **attendue** est _false_ (ou 0) alors que la valeur **obtenue** est _vrai_ (ou 1).

Pour aller plus loin, il est nécessaire de regarder le contenu d'un second fichier `openfisca_france_local/test_dispositif.py` (vous pouvez toujours y accéder à partir de l'explorateur de fichier de gauche).

```python
 # -*- coding: utf-8 -*-
from openfisca_france.model.base import Individu, Variable, MONTH


class test_dispositif(Variable):
    value_type = bool
    entity = Individu
    definition_period = MONTH
    label = u"Variable de test pour l'extension"

    def formula(individu, period):
        return individu('age', period) > 0
```

La ligne `class test_dispositif(Variable):` indique la création d'une variable intitulée `test_dispositif`.

Les deux dernières lignes indiquent comment cette variable est calculée, `individu('age', period) > 0` indique que la valeur est _vrai_ si et seulement si l'âge est strictement supérieur à zéro. La variable vaut _faux_ dans le cas contraire.

Pour permettre au second test que nous avons modifié d'être valide, nous pourrions modifier le calcul de la variable `test_dispositif`. En remplaçant `return individu('age', period)` par `return individu('age', period) >= 18` par exemple. Dans ce cas-là, on ne s'intérresse pas à savoir si l'individu est né (âge > 0) mais si cet individu à la majorité légale (âge >= 18).

Vous pouvez en faire l'expérience, en modifiant le fichier, le sauvegardant puis en lançant la commande `openfisca_local_test tests/test_dispositif.yml`.

Normalement, le résultat finit à nouveau par `----------- 2 passed -------------`.

Cet exercice peut sembler être un détour par rapport à l'ajout d'une aide mais la compréhension des tests et de leur intérêt est primordiale.

### Supprimer les modifications apportées

Ces modifications ne doivent pas être conservées car elles constituaient un premier test pour vous familiariser avec GitPod.

Vous pouvez accéder à la liste des modifications en cliquant sur le symbole en forme de Y sur la gauche (1). Pour annuler toutes les modifications, il faut cliquer sur les trois petits points (2), choisir « Discard All Changes » (3) et confirmer la suppression avec « OK ».

En suivant ces étapes vous retrouvez votre environnement comme vous l'avez trouvé au départ.

![Étapes pour la suppression des modifications dans GitPod](/img/ajouter-une-aide/gitpod-suppression.png)

## Implémenter la première règle - 15 minutes

Maintenant que vous avez un environnement de travail fonctionnel, vous allez pouvoir commencer à coder votre règle.

### Choisir le premier critère à prendre en compte

Il va falloir choisir un critère dans la liste que vous avez rédigée précédemment. Étant donné que c'est une première, il faut choisir ce qui vous parait le plus facile.

Nous allons détaillé la suite des étapes pour 3 critères différents (1 seul pour le moment) que vous pourrez adapter à votre situation

1. Résider dans la ville de AAA
2. ~~Être âgé de plus de CCC ans~~ (À détailler)
3. ~~Être bénéficiaire de DDD~~ (À détailler)

Nous allons continuer ce guide en considérant que nous souhaitons ajouter le « [Noël des enfants](https://www.alfortville.fr/le-pole-solidarite-insertion) » mis en place par la ville d'Alfortville. Comme premier critère nous allons prendre « Résider dans la ville d'[Alfortville](https://fr.wikipedia.org/wiki/Alfortville) ».

Si votre critère est très différent, faites-nous signe à [aides-jeunes@beta.gouv.fr](mailto:aides-jeunes@beta.gouv.fr), nous nous ferons un plaisir de compléter ces informations (on a été à l'essentiel 😅).

Le critère « Résider dans la ville d'Alfortville » est facile à comprendre pour nous humains. Le moteur de calculs ne va pas utiliser le nom de la ville mais son identifiant INSEE. Cela est préférable car le nom de la ville peut être orthographié de plusieurs façon (avec le tiret, tout en majuscules, etc.) alors que l'identifiant n'a pas cet inconvéniant. Il est existe plusieurs endroits où le code INSEE peut être trouvé. Sur [la page wikipédia de Alfortville](https://fr.wikipedia.org/wiki/Alfortville) on y apprend que son code commune (où code INSEE) est 94002.

Avant d'aller plus loin, nous avons faire un dernier préparatif. Il va falloir donner un identifiant à votre aide. En voilà quelques exemples :

- `alfortville_noel_enfants`
- `cotes_d_armor_fonds_solidarite_logement_acces_maintien_plafond`
- `nouvelle_aquitaine_carte_solidaire`

### Créer un premier fichier de test

Il y a un dossier intitulé `tests` à la racine du dossier principal. En fonction de votre administration, vous pouvez choisir le meilleur sous-dossier&nbsp;:

- communes
- départements
- métropoles
- régions

Vous pouvez regarder les fichiers existants et essayer de reprendre les mêmes conventions.

- Bouton-droit sur le dossier dans lequel vous voulez créer le fichier.
- Indiquer le nom du fichier avec comme extension **`.yml`** par exemple `mon_aide.yml`.

Dans le cas que nous utilisons, nous allons créer le fichier `tests/communes/alfortville/noel_enfants.yml`.

### Décrire vos premiers tests

Dans l'espace au centre, le fichier encore vide a été créé, vous pouvez y copier le contenu suivant :

```yaml
- period: 2020-05
  input:
    depcom: 94002
  output:
    alfortville_noel_enfants: true
```

`depcom` permet d'indiquer le code INSEE de la commune. Comme annoncé précédemment, `94002` est le code commune d'Alfortville. (Depcom : c'est un raccourci pour Département/Commune car les deux premiers chiffres représentent le département et les trois derniers la commune au sein du département).

`alfortville_noel_enfants` a été utilisé car c'est l'identifiant que nous avons choisi pour le Noël des enfants mis en place par la ville.

Vous devez ajuster ces valeurs à votre aide.

Avec ce nouveau test, il est possible de lancer la commande `tests/communes/alfortville/noel_enfants.yml`. Vous devriez obtenir une erreur (`1 failed`) avec un message qui indique :

```console
You tried to calculate or to set a value for variable 'alfortville_noel_enfants',
  but it was not found in the loaded tax and benefit system (openfisca-france@48.9.5).
```

Cela signifie que la variable `alfortville_noel_enfants` n'existe pas encore. Effectivement, nous ne l'avons pas encore créée. Pour cela, il faut créer un nouveau fichier.

De notre côté, nous allons créer un ficher `openfisca_france_local/communes/alfortville/noel_enfants.py`. Pour commencer nous y copions le contenu suivant :

```python
 # -*- coding: utf-8 -*-
from openfisca_france.model.base import Menage, Variable, MONTH


class alfortville_noel_enfants(Variable):
    value_type = bool
    entity = Menage
    definition_period = MONTH
    label = u"Éligibilité au Noël des enfants d'Alfortville"

    def formula(menage, period):
        return menage('depcom', period) == b'xxxxx'
```

En lançant à nouveau la commande `openfisca_local_test openfisca_local_test tests/communes/alfortville/noel_enfants.yml`, vous devriez encore obtenir une erreur (`1 failed`) avec un message différent.

La dernière ligne `return menage('depcom', period) == b'xxxxx'` compare la valeur de `depcom` à `xxxxx`. Dans notre cas, il est nécessaire de changer `xxxxx` en `94002` pour obtenir `return menage('depcom', period) == b'94002'`.

En relançant le test, l'erreur devrait avoir disparu (`1 passed`).

Ce premier test permet de valider qu'un ménage d'Alfortville apparait éligible au dispositif.

Ajoutons-en un second pour valider qu'un ménage hors de cette ville y est effectivement pas éligible. Dans nos cas, nous ajoutons le test suivant à la suite du fichier `tests/communes/alfortville/noel_enfants.yml` :

```yaml
- period: 2020-05
  input:
    depcom: 67218
  output:
    alfortville_noel_enfants: false
```

En relançant le test (`openfisca_local_test openfisca_local_test tests/communes/alfortville/noel_enfants.yml`), aucune erreur n'apparait et l'on obtient (`2 passed`).

Vous avez rédigé votre première règle pour cette nouvelle aide.

## Partager avec nous vos premiers travaux - 5 minutes

Votre travail ne réside encore sur votre ordinateur, il est temps de le mettre en ligne pour le partager avec nous.

Pour cela, les outils que nous vous avons présenté vont continuer à nous être utiles. GitHub et GitPod ne commencent pas tous les deux par Git par hasard. [_Git_](https://fr.wikipedia.org/wiki/Git) est un [logiciel de gestion des versions](https://fr.wikipedia.org/wiki/Logiciel_de_gestion_de_versions) il permet « de stocker un ensemble de fichiers en conservant la chronologie de toutes les modifications qui ont été effectuées dessus ». Cela est devenu indispensable dans le monde du numérique.

![Interface de GitPod et zones importantes pour le partage de la contribution](/img/ajouter-une-aide/gitpod-commit.png)

Pour continuer, cliquez sur le symbôle qui ressemble à un Y à gauche (cf. n°1 sur la capture d'écran). Vous devriez voir une liste avec les deux fichiers que vous avez ajouté. Ces deux fichiers sont dans une section intitulée _Changes_ (cf. n°2). En passant la souris sur ce titre, vous allez faire apparaitre un symbole + et vous pourrez cliquer sur ce symbole. Avec cette manipulation vous indiquez vouloir enregistrer ces nouveaux fichiers, les fichiers sont passés de la section _Changes_ à _Staged changes_ (cf. n°3).

Maintenant que ces fichiers sont prêts à être enregistrés il faut donner un nom à cette première modification, à votre première contribution. Ce message permettra dans le futur de savoir à quoi correspond cette contribution. « Ajoute une première version du Noel des enfants d'Alforville » est un bon message. Il est recommandé de commencer les messages par un verbe d'action. En effet ces messages correspondent à la fin de la phrase : « Cette contribution [...] ».

Nous pouvons enfin enregistrer sur votre ordinateur cette contribution en cliquant sur le symbole ✅ (cf. n°4) en haut à gauche. Le message que vous avez choisit devrait apparaitre en bas à gauche dans la section _Head commit_ (cf. n°5).

L'enregistrement que vous venez de faire sur votre ordinateur doit être désormais partagé sur GitHub. Pour cela, vous pouvez cliquer sur le symbole de GitHub à droite (un chat sur fond blanc, cf. n°6).

Cela va faire apparaître à droite un menu. Pour envoyer votre modification, vous devez la _push_ sur GitHub à l'aide du bouton bleu « Push ». Une fois cela fait, vous pourrez créer une suggestion de modification (ou _pull request_ en anglais) en cliquant sur _Create pull request_. Enfin vous pourrez voir à quoi cela ressemble sur GitHub en cliquant sur le lien en haut à droite « #XX » où _XX_ est un nombre.

## Modifier les informations sur votre aide - 5 minutes

Normalement, le critère que vous avez codé dans le moteur de calculs est présent dans la liste rédigée initialement. Il est désormais pris en compte dans le simulateur donc ce critère devrait être supprimé de la liste des « conditions non prises en compte dans le simulateur ».

Pour cela, vous pouvez accéder à votre contribution à [la page suivante](https://contribuer-aides-jeunes.netlify.app/admin/#/workflow), cliquer sur la carte correspondante, supprimer le critère de la liste et enregistrer vos modifications.

## Demander l'ajout de l'aide dans le simulateur (1 minute)

Pour terminer, lorsque vous souhaitez ajouter cette aide au simulateur, vous pouvez nous contacter à [aides-jeunes@beta.gouv.fr](mailto:aides-jeunes@beta.gouv.fr). Vous pouvez aussi indiquer que votre contribution est prête directement dans l'outil. Pour cela, vous pouvez cliquer en haut à droite sur «&nbsp;définir le statut&nbsp;» et choisir «&nbsp;Prêt&nbsp;» ou bien déplacer [la carte de votre contribution](https://contribuer-aides-jeunes.netlify.app/admin/#/workflow) dans la colonne « Prêt ».

<style>{`
img {
  max-width: 100%;
}
`}</style>

# 👏 C'est fini - Merci beaucoup&nbsp;! 🎉

> Prochaine étape : Coder un autre critère de l'aide 📈
