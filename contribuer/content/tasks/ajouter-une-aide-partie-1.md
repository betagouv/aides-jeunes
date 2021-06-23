---
title: 🛠 Ajouter une aide 1ère partie
duration: 30
prerequisites:
  - ajouter-une-institution
---

L'objectif de cette contribution est d'ajouter une première aide dans le simulateur.

Il s'agira d'une version simplifiée par rapport à la réalité mais qui constituera déjà une première étape. La complexité de cette aide sera intégrée et mise en compte progressivement.

## Choisir une aide - 5 minutes grand max

Il va falloir déterminer l'aide que vous souhaitez intégrer. Pour une première aide, il faut essayer d'en choisir une **simple**, pour laquelle vous avez à votre disposition des **documents de référence** (règlement intérieur, annexes de délibération, etc.) dans lesquels sont détaillées les règles permettant de la calculer. Enfin, il faut aussi que les **ressources** permettant aux usagers des **faire les démarches** soient **accessibles** (page d'information, formulaire en ligne, téléservice, etc.).

![Schéma des étapes entre la contribution et le bénéfice de l'aide](/img/ajouter-une-aide/schema.svg)

Dans un premier temps, seule l'éligibilité à cette aide sera indiquée. Si un montant peut être calculé (forfaitaire ou en fonction du foyer) il le sera plus tard. En effet de tels calculs augmentent la complexité et cette contribution n'en serait que plus difficile.

## Lister les critères - 10 minutes max

Les documents de référence étant précis mais difficiles à comprendre par le plus grand nombre, la rédaction d'une liste de critère est un premier travail de simplification.

Il s'agit de remplir le paragraphe suivant :

Pour bénéficier de l'aide, il faut :

- ... **et**
- ... **et**
- ... **et**
- ... **et**

Voilà quelques exemples de critères :

- Résider dans la ville de Canéjan
- Résider dans le département du Bas-Rhin
- Être âgé de plus de 65 ans
- Être bénéficiaire du RSA
- Être parent isolé
- Avoir un taux d'incapacité supérieur à 80%
- Avoir des ressources mensuelles inférieures au SMIC

Il arrive que certains critères soient plus complexes, _être âgé de plus de 65 ans ou de plus de 60 avec un taux d'incapacité de plus de 50%_ en est un exemple.

Il arrive aussi que des critères puissent être regroupés en un critère moins précis mais qui évite de faire une longue énumération. Par exemple, _Avoir signé un CDD de plus de 3 mois ou un CDI ou être entrée dans une formation de plus de 6 mois_ peut être résumée par _Avoir repris une activité_.

Cette liste sera un point de départ pour coder les règles de votre aide dans le moteur de calculs.

## Renseigner les informations relatives à l'aide - 10 minutes max

En vous connectant à <a href="https://contribuer-aides-jeunes.netlify.app/admin/#/collections/benefits/new" target="_blank" rel="noopener">l'outil de contribution</a>, vous pouvez ajouter les informations de votre aide. Les informations recueillies jusqu'à présent vont vous faciliter la saisie des informations demandées.

La liste des critères tout juste établies devra être indiquée dans « Conditions non prises ne comptent par le simulateur » en ajoutant les critères un par un à partir du bouton « add condition non prise ne comptent par le simulateur ».

Une fois les informations saisies, il faut les « Enregistrer » à partir du bouton en haut à gauche.

Avec cet enregistrement, une version de démonstration va être mise à disposition pour vous permettre de constater la présence de votre aide. Comme cela prend quelques minutes, vous pouvez continuer et nous y reviendrons plus tard.

# 👏 C'est fini - Merci beaucoup&nbsp;! 🎉

> Prochaine étape : Coder un autre critère de l'aide 📈
