<template>
  <article class="text container">
    <h1>Conditions générales d'utilisation (lisibles, promis !)</h1>

    <h2 id="presentation">Présentation</h2>

    <p>Mes Aides est un calculateur d'aides sociales à destination des particuliers et de celles et ceux qui les conseillent, dans un cadre professionnel ou bénévole. Il s'agit d'une application web qui permet de décrire en quelques minutes une situation individuelle et d'obtenir immédiatement une évaluation de son éligibilité à des aides sociales, nationales (« légales ») ou territoriales (« extra-légales »).</p>

    <p>Le <a href="https://github.com/mes-aides/simulateur">code du logiciel</a> est <abbr title="Sous licence AGPL" uib-popover="Sous licence AGPL" popover-trigger="mouseenter">libre</abbr>, et peut donc être vérifié et amélioré par tout·e·s.</p>


    <h2>Vocabulaire</h2>

    <p>
      <ul>
        <li>« Nous » se réfère à l'<router-link to="cgu#mentions-legales">éditeur</router-link> de Mes Aides.</li>
        <li>« Vous » se réfère à un·e usager de Mes Aides.</li>
        <li>« Partenaires » se réfère aux organismes responsables d'attribuer les aides calculées par Mes Aides.</li>
      </ul>
    </p>


    <h2 id="absence-de-garantie">Absence de garantie</h2>

    <p>
      Les résultats calculés par ce simulateur ont une valeur informative et ne représentent en aucun cas une décision d'ouverture de droits.
      <small>Nos partenaires sont les seuls décisionnaires sur l'attribution d'un droit. Les résultats d'une simulation ne sont pas opposables en guichet.</small>
    </p>
    <p>
      Nous ne garantissons pas l'exactitude du contenu des sites externes vers lesquels nous faisons des liens.
      <small>Ces sites ne sont pas non plus régis par les mêmes conditions d'utilisation, notamment en ce qui concerne leur traitement des données à caractère personnel.</small>
    </p>
    <p>
      Nous mettons Mes Aides à disposition sans garantie sur sa disponibilité, en « <em lang="en">best effort</em> ».
      <small>Cela signifie que d'éventuelles indisponibilités n'ouvriront pas droit à compensation financière.</small>
    </p>


    <h2 id="donnees">Vos données</h2>

    <p>
      Mes Aides ne vous demande ni ne stocke d'information nominative telle que nom, prénoms ou adresse.
      <small>La seule information nominative que vous pouvez renseigner est le prénom de vos enfants. Cela permet uniquement de les distinguer. Vous êtes libre d'inscrire le prénom que vous souhaitez.</small>
    </p>
    <p>
      Pour autant, une fois réunies, les données nécessaires pour évaluer vos droits (revenus, âge, code postal…) ont un caractère personnel.<!--  Nous en avons donc déclaré le traitement auprès de la <abbr title="Commission Nationale de l'Informatique et des Libertés">CNIL</abbr>. -->
    </p>
    <p>
      Nous conservons ces données pendant deux ans à compter de la simulation pour analyser les usages, mesurer l'impact et la diffusion territoriale de Mes Aides, et améliorer le service.
      <small>Ces données nous permettent par exemple de déterminer les options les plus pertinentes à vous proposer en fonction des usages les plus fréquents.</small>
    </p>
    <p>
      Vous avez un droit d'accès, de rectification et de suppression de vos données. Pour l'exercer, envoyez-nous un courriel à l'adresse <a
      v-mail="{to: 'equipe@mes-aides.org', subject: 'Mes données', body: emailBody}">equipe@mes-aides.org</a> en précisant
      <ul>
        <li>la date et l'heure précise de simulation,</li>
        <li v-if="situation._id">l'identifiant de la simulation : <strong>{{ situation._id }}</strong>,</li>
        <li>le plus possible d'éléments renseignés au cours de votre visite : date de naissance, etc. </li>
      </ul>
      <small>Comme nous n'enregistrons pas d'éléments nominatifs, seuls ces éléments peuvent nous permettre de retrouver votre simulation.</small>
    </p>
    <p>
      Nous conservons pendant 2 mois les emails des personnes ayant demandé un récapitulatif par courrier électronique.
      <small>Nous stockons votre email dans le but de ne permettre qu'à vous seul·e d'accéder à votre situation.</small>
    </p>
    <p>
      Nous nous engageons à ne jamais exploiter les informations que vous nous transmettrez dans un but commercial ou publicitaire.
      <small>De manière générale, Mes Aides n’accepte aucune forme de publicité autre que celle que constitue la présentation des aides des partenaires.</small>
    </p>
    <p>
      Nous collectons également des données anonymes d'audience, indépendamment des simulations effectuées.
      <small>Cela nous permet par exemple de déterminer la <a href="https://beta.gouv.fr/2016/11/04/mes-aides-metriques-pirates-tunnel-conversion-public">durée d'une simulation et les pages à améliorer en priorité</a>.</small>
    </p>

    <iframe id="tracking-optout" src="https://stats.data.gouv.fr/index.php?module=CoreAdminHome&action=optOut&language=fr">
      Vous pouvez choisir de <a href="https://stats.data.gouv.fr/index.php?module=CoreAdminHome&action=optOut&language=fr">refuser ce suivi</a>.
    </iframe>

    <p>
      Nous nous engageons à prendre toutes les mesures nécessaires pour garantir la sécurité et la confidentialité des informations que vous nous fournissez.
      <small>Les situations enregistrées sont enregistrées dans un centre de données <a href="https://www.ovh.com/fr/apropos/securite.xml">sécurisé</a>. Seules nos équipes techniques et celles de nos partenaires peuvent y <abbr title="Uniquement par clé privée révocable individuellement, pas par mot de passe 😉" uib-popover="Uniquement par clé privée révocable individuellement, pas par mot de passe 😉" popover-trigger="mouseenter">accéder</abbr>.</small>
    </p>


    <h2 id="evolutions">Évolutions</h2>

    <p>
      Nous pouvons faire évoluer Mes Aides sans information préalable.
      <small>Nous ajoutons régulièrement des aides, raffinons l'interface et modifions des formulations sur la base de vos retours et des évolutions règlementaires.</small>
    </p>
    <p>
      Nous pouvons suspendre l'accès à Mes Aides sans information préalable, notamment pour des raisons de maintenance.
      <small>Nous mettons l'application à jour plusieurs fois par semaine. L'indisponibilité ne dépasse généralement pas une dizaine de secondes.</small>
    </p>
    <p>
      Nous pouvons amender ces conditions d’utilisation. En cas de changement significatif, une notification s'affichera lors de l'accès à Mes Aides au moins 30 jours avant l'entrée en vigueur des nouvelles conditions.
      <small>Tout l'<a href="https://github.com/mes-aides/simulations/commits/master/src/views/CGU.vue">historique de ces conditions</a> est librement accessible.</small>
    </p>


    <h2 id="utilisation">Utilisation</h2>

    <p>
      Mes Aides est en accès libre à l'adresse <a href="https://mes-aides.org">mes-aides.org</a>.
      <small>Son utilisation est gratuite et facultative.</small>
    </p>
    <p>
      Si vous effectuez une simulation, vous acceptez ces conditions d'utilisation.
    </p>
    <p>
      L’utilisation de Mes Aides requiert une connexion internet et un navigateur récent. L'application affichera un message si le navigateur utilisé est trop ancien pour être compatible.
      <small>En particulier, les versions d'Internet Explorer antérieures à la 11 ne sont pas compatibles. Vous pouvez installer en autonomie <a href="https://support.google.com/chrome/answer/95346?hl=fr">Chrome</a> ou <a href="https://www.mozilla.org/fr/firefox/all/?q=Fran%C3%A7ais">Firefox</a>, sans droits d'administration sur votre poste.</small>
    </p>
    <p>
      Nous nous réservons le droit de bloquer, sans information préalable ni compensation financière, les usages mettant en péril l'utilisation du logiciel par d'autres usagers.
      <small>Cela nous permet d'anticiper d'éventuelles <a href="https://fr.wikipedia.org/wiki/Attaque_par_déni_de_service">attaques par déni de service</a>.</small>
    </p>


    <h1 id="mentions-legales">Mentions légales</h1>

    <h2>Éditeur</h2>
    <p>
      <a
        v-analytics="{ action:'CGU', category:'Éditeur'}"
        v-mail="{to: 'equipe@mes-aides.org', subject:'Éditeur', body:''}">Le collectif citoyen
      </a>
    </p>

    <p>
      Direction de la publication :
      <a
        v-analytics="{ action:'CGU', category:'Direction de la publication'}"
        v-mail="{to: 'equipe@mes-aides.org', subject:'Direction de la publication', body:''}">Le collectif citoyen
      </a>
    </p>

    <h2>Hébergeur</h2>
    <p>
      <a href="https://www.ovh.com/fr/">OVH</a>.
      <small>2 rue Kellermann, 59100 Roubaix. Téléphone : +33 9 72 10 10 07.</small>
    </p>
  </article>
</template>

<script>

export default {
  name: 'cgu',
  computed: {
    situation: function() {
      return this.$store.state.situation
    },
    emailBody: function() {
      return `Bonjour,

J'ai effectué une simulation sur Mes Aides le **JJ/MM/AAAA à HH:MM:SS**.

${this.situation._id ? `La dernière simulation que j'ai effectuée porte l'identifiant **${this.situation._id}**.` : ""}
Voici quelques éléments que j'ai renseigné sur celle-ci pour vous aider à l'identifier.
- Date de naissance : **JJ/MM/AAAA**.
- Nombre d'enfants : …
- …

Je souhaite **supprimer** cette simulation de votre base de données.

Merci d'avance.
`
    }
  },
}
</script>
