<template>
  <article class="text container">

    <h1>Contribuer à Mes Aides</h1>

    <p>Le simulateur Mes Aides s’améliore grâce à vos retours : merci de vous impliquer dans son développement ! Nous prenons en compte toutes les remarques que nous recevons. Voici les manières les plus efficaces de contribuer.</p>


    <h2 id="signaler">🧐 Signaler une erreur</h2>

    <p>Mes Aides peut dans des cas particuliers donner des résultats différents de la réalité ou des résultats d'un autre simulateur. Faites-le nous savoir pour que nous puissions trouver d’où vient la différence et corriger Mes Aides.</p>

    <p>Vous pouvez nous signaler de telles erreurs à la fin de votre simulation. Deux options sont proposées selon votre situation : soit vous avez fait une autre simulation ailleurs, soit vous obtenez déjà des montants différents.</p>

    <small>Attention, nous vous rappelons que les résultats de Mes Aides sont <router-link to="/cgu">uniquement informatifs</router-link> : en cas de différence de calcul entre Mes Aides et un organisme de prestations sociales, c’est toujours ce dernier qui prend la décision.</small>

    <h2 id="signaler-bug">🐞 Signaler un bug</h2>

    <p>Si vous rencontrez une erreur pendant le calcul et que votre simulation s'arrête, une option de signalement est disponible : précisez-nous les informations que vous avez entrées. Nous vous contacterons pour améliorer Mes Aides et corriger ce bug.</p>

    <h2 id="proposer">💡 Proposer une amélioration</h2>

    <p>Vous avez une idée pour améliorer Mes Aides, vous pensez qu’une option manque dans le simulateur :
      <a v-mail="{to: 'equipe@mes-aides.org', subject:'Suggestion (depuis la page contribuer)}'}">contactez-nous par courriel</a> ou <a href="https://github.com/mes-aides/simulateur">sur GitHub</a>. Toutes les <a href="https://github.com/mes-aides/simulateur/issues">évolutions de Mes Aides</a>, espérées, planifiées ou réalisées, peuvent être suivies en permanence en ligne.</p>

    <h2 id="proposer-une-aide">🎯 Suggérer l'ajout d'une aide</h2>

    <p>Nous voulons toujours augmenter le nombre d’aides simulées en une seule fois. Si vous connaissez une prestation sociale qui n'est pas calculée, parlez de Mes Aides à l'organisme qui l'attribue et <a v-mail="{to:'equipe@mes-aides.org', subject: 'Proposition d\'une nouvelle aide'}">indiquez-nous</a> que vous avez fait ce signalement. Si vous pouvez nous mettre directement en relation, c'est encore mieux !</p>

    <p>Vous pouvez aller encore plus loin et accélérer l'intégration de cette aide en nous envoyant les éléments suivants :</p>

    <ul>
      <li>les documents officiels qui décrivent les règles de calcul de l'aide ;</li>
      <li>des situations pour lesquelles vous connaissez l'aide attribuée.</li>
    </ul>

    <h2 id="communiquer">📣 Communiquer</h2>

    <p>Parler de Mes Aides autour de vous, c’est déjà beaucoup ! Si ce simulateur vous a été utile, n’hésitez pas à nous laisser un message
      <a
      v-mail="{to:'equipe@mes-aides.org', subject:'Retour utilisateur (depuis la page contribuer)'}">par courriel</a>. Rejoignez-nous également sur les réseaux sociaux pour rester au courant des dernières nouveautés du simulateur et échanger.</p>

    <p><a href="https://twitter.com/MesAides">Suivez-nous sur Twitter</a> et envoyez un message à @MesAides.</p>
     <p><a href="https://www.facebook.com/MesAides">Suivez-nous sur Facebook</a> et envoyez un message privé à la page.</p>


    <h2 id="developper">🛠 Développer</h2>

    <p>Vous pouvez accéder à l’intégralité du code source de Mes Aides en ligne <a href="https://github.com/mes-aides/simulateur">sur GitHub</a>. Toutes les <a href="https://github.com/mes-aides/simulateur/issues">évolutions de Mes Aides</a>, espérées, planifiées ou réalisées, peuvent être suivies en permanence en ligne.</p>

    <p>Mes Aides se base sur <a href="https://www.openfisca.fr">OpenFisca</a>, un moteur de calcul libre et ouvert utilisé par des laboratoires de recherche en économie et des services publics. L'<a href="https://github.com/mes-aides/simulateur">interface graphique de Mes Aides</a> est elle aussi un <a href="https://fr.wikipedia.org/wiki/Logiciel_libre" title="Sous licence AGPL" uib-popover="Sous licence AGPL" popover-trigger="mouseenter">logiciel libre</a>. Cela signifie que toute entité peut librement vérifier, s'inspirer de, copier, et modifier ce service. La seule contrepartie est la mise à disposition à la communauté des améliorations effectuées.</p>
  </article>
</template>
