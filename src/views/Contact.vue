<template>
  <article class="text container">

    <h1>Qui contacter par rapport à vos aides ?</h1>

    <p>Le simulateur Mes Aides est un simulateur indépendant : nous ne sommes affiliés à aucun organisme en particulier. Aucun des renseignements que vous entrez sur notre site n’est ensuite transmis. Notre but est de faire le point avec vous sur les prestations sociales que vous pouvez demander.</p>

    <p>Pour transmettre des documents personnels, obtenir des informations sur une prestation sociale en particulier ou pour avoir des renseignements sur votre situation, adressez-vous directement auprès de l’organisme concerné : nous ne pourrons pas vous répondre.</p>

    <ul>
      <li><a href="https://assure.ameli.fr/">Caisse Primaire d’Assurance Maladie (CPAM, Ameli.fr)</a></li>
      <li><a href="http://www.caf.fr/redirect/redirect.php?page=monCompte">Caisse d'Allocations Familiales (CAF)</a></li>
      <li><a href="https://candidat.pole-emploi.fr/">Pôle Emploi</a></li>
      <li><a href="https://www.lassuranceretraite.fr/portail-services-ihm/index.html">Caisse Nationale d’Assurance Vieillesse (CNAV)</a></li>
      <li><a href="https://aides-casvp.paris.fr/">Ville de Paris</a></li>
    </ul>

    <p>En particulier, seule l'Assurance Maladie peut vous répondre par rapport à la télétransmission de votre mutuelle ou le dossier de votre CMU-C / ACS. Vous pouvez en savoir plus sur <router-link to="/ameli">la page dédiée</router-link>.</p>

    <h2>Je souhaite obtenir des conseils personnalisés</h2>

    <p>La première étape est de <router-link to="/foyer/demandeur">passer la simulation sur Mes Aides</router-link>. Notre simulateur vous permet d'avoir un aperçu rapide de votre situation et des aides que vous pouvez demander. C'est l'occasion de faire le point avant d'entamer des démarches.</p>

    <p>Ensuite, vous pouvez prendre contact avec le centre communal d’action sociale (CCAS) de votre ville. Vous trouverez les <a href="http://www.sanitaire-social.com/annuaire/centre-communal-d-action-sociale-ccas/62">coordonnées de votre <abbr title="Centre Communal d’Action Sociale">CCAS</abbr> en ligne</a> ou en appelant votre mairie. De plus, à la fin de votre simulation, vous trouverez les coordonnées de points d'accueil proches de votre domicile.</p>

    <p>Nos pages <router-link to="/liens-utiles">Liens Utiles</router-link> et <router-link to="/sos">SOS</router-link> peuvent également vous conseiller en fonction de votre situation.</p>

    <h2>J’ai une remarque ou suggestion sur Mes Aides</h2>

    <p>Nous vous encourageons à <router-link to="/foyer.demandeur">passer une simulation</router-link> et à nous contacter à travers les liens proposés en fin de simulation. Nous pourrons alors prendre connaissance de votre situation et nous pourrons plus facilement vous orienter.</p>
    <small>Vous pouvez également <router-link to="/social">nous contacter sur les réseaux sociaux</router-link> une fois votre simulation terminée.</small>

    <h2>Je souhaite intégrer mon organisme ou une nouvelle aide au simulateur (réservé aux professionnels)</h2>

    <p>En tant qu’acteur de la sphère sociale, découvrez <router-link to="/ameliorer">comment contribuer</router-link> afin de mettre en place un partenariat avec Mes Aides. Pour une réponse par rapport à une situation particulière, merci de <router-link to="/foyer.demandeur">passer la simulation</router-link> afin d'acccélerer le traitement de votre demande et de nous contacter à travers les liens proposés.</p>

    <h2>Je ne sais plus quoi faire</h2>

    <p>Nos pages <router-link to="/liens-utiles">Liens Utiles</router-link> et <router-link to="/sos">SOS</router-link> vous orientent vers les bons interlocuteurs. Vous pouvez aussi nous contacter directement par
      <a
        v-analytics="{ action:'Contact', category:'Contact'}"
        v-mail="{to: 'equipe@mes-aides.org', body:`



  # Mes Aides est un simulateur indépendant, nous n'avons pas accès à vos dossiers pour les mettre à jour.
  # Il est inutile de nous envoyer des documents personnels (carte de mutuelle, pièce d'identité, etc.) : nous ne pouvons pas les traiter.
  # Si vous souhaitez nous signaler une erreur, nous contacter à travers les liens proposés en fin de simulation améliore le traitement de votre demande.`}">courriel</a>.
    </p>
  </article>

</template>

