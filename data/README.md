# Description des aides calculées par Mes Aides

Une aide est décrite par un dossier nommé par son identifiant dans OpenFisca.

Chacun de ces dossiers doit contenir un fichier `index.yaml` qui décrit l'aide comme un objet au format YAML.


## Propriétés obligatoires

- `name` : intitulé de la prestation.
- **`acronym`** : version courte de l'intitulé, à maintenir en dessous de **XXX caractères**.
- `prefix` : déterminant à préfixer à la version courte de l'intitulé.
- `url` : une URL absolue pointant vers une référence officielle (de l'organisme liquidateur ou de service-public.fr) présentant la prestation et ses enjeux. **Cette URL devra être maintenue et sera régulièrement vérifiée**.


## Propriétés optionnelles

- `conditions` : un tableau de conditions textuelles au format HTML, affichées sous la forme d'une liste en fin de simulation en cas d'éligibilité à la prestation décrite.
- `uncomputability` : un objet décrivant les cas dans lesquels la prestation décrite pourrait ne pas être calculable par un logiciel. Cet objet est constitué par des clés correspondant aux identifiants de raisons d'incalculabilité renvoyés par OpenFisca, pointant vers des objets constitués de :
  - `reason` : un morceau de phrase justifiant l'incalculabilité. Rester le plus concis possible, **sans majuscule ni point**. Exemple : `vous avez des revenus en tant qu’indépendant·e`
  - `solution` : un texte libre qui sera présenté à l'utilisateur au format HTML
