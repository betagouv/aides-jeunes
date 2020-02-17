<template>
  <article class="text container">

    <h1>Contribuer à Mes Aides</h1>

    <p>Le simulateur Mes Aides s’améliore grâce à vos retours : merci de vous impliquer dans son développement ! Nous prenons en compte toutes les remarques que nous recevons. N’hésitez pas à parler de Mes Aides autour de vous et à contribuer au succès de ce service public.</p>


    <h2 id="signaler">Signaler</h2>

    <p>Mes Aides peut parfois donner des résultats différents de la réalité, que ce soit à travers un autre simulateur ou dans le montant de l’aide que vous percevez. Souvent, il s’agit de cas particuliers que nous n’avions pas prévus. En nous contactant, nous pourrons alors trouver d’où vient la différence et corriger Mes Aides.</p>

    <p>Vous pouvez nous signaler de telles erreurs à la fin de votre simulation. Deux options sont proposées selon votre situation : soit vous avez fait une autre simulation ailleurs, soit vous obtenez déjà des montants différents.</p>

    <p>De la même façon, la simulation peut parfois s’arrêter en cours de calcul suite à une erreur inattendue. Une option de signalement est alors disponible : précisez-nous les informations que vous avez entrées. Nous vous contacterons pour améliorer Mes Aides et régler ce bug.</p>

    <p>Notez bien que les résultats de Mes Aides sont informatifs : en cas de différence entre notre simulateur et un organisme de prestations sociales, c’est ce dernier qui prend la décision.</p>
    
    <small>En savoir plus sur <router-link to="/cgu">les résultats calculés par Mes Aides</router-link>.</small>

    <h2 id="proposer">Proposer</h2>

    <p>Vous avez une idée pour améliorer Mes Aides, vous pensez qu’une option manque dans le simulateur ou bien vous souhaitez nous donner votre avis :
      <a v-mail="{to: 'equipe@mes-aides.org', subject:'Suggestion (depuis la page contribuer)}'}">contactez-nous directement</a> ou <a href="https://github.com/mes-aides/simulateur">sur GitHub</a>. Toutes les <a href="https://github.com/mes-aides/simulateur/issues">évolutions de Mes Aides</a>, espérées, planifiées ou réalisées, peuvent être suivies en permanence en ligne.</p>

    <h2 id="proposer-une-aide">Proposer une nouvelle aide</h2>

    <p>Un de nos buts est de toujours augmenter le nombre d’aides simulées en une seule fois. Si vous aimeriez qu'une prestation sociale, parlez de cette application à l'organisme qui l'attribue et <a v-mail="{to:'equipe@mes-aides.org', subject: 'Proposition d\'une nouvelle aide'}">indiquez-nous</a> que vous avez fait ce signalement.</p>

    <p>En fonction de votre expertise sur cette aide, vous pouvez nous aider en nous envoyant certains des éléments suivants&nbsp;:</p>

    <ul>
      <li>Les documents de référence des règles de calcul de l'aide&nbsp;</li>
      <li>Une ou plusieurs situations pour laquelle ou lesquelles vous connaissez le résultat pour cette aide.</li>
    </ul>

    <h2 id="communiquer">Communiquer</h2>

    <p>Parler de Mes Aides autour de vous, c’est déjà beaucoup pour nous ! Si ce simulateur vous a aidé, n’hésitez pas à nous laisser un message sur
      <a
      v-mail="{to:'equipe@mes-aides.org', subject:'Retour utilisateur (depuis la page contribuer)'}">notre courriel</a>. Rejoignez-nous également sur les réseaux sociaux de Mes Aides pour être tenu au courant des dernières nouveautés du simulateur et partager avec nous dans un cadre informel.</p>

    <p><a href="https://twitter.com/MesAides">Suivez-nous sur Twitter</a> et <a href="https://twitter.com/intent/tweet?screen_name=MesAides" target="_blank">envoyez un message à @MesAides en public</a> ou en privé.</p>
     <p><a href="https://www.facebook.com/MesAides">Suivez-nous sur Facebook</a> et envoyez un message à la page en privé.</p>


    <h2 id="developper">Développer</h2>

    <p>Vous pouvez accéder à l’intégralité du code source de Mes Aides en ligne <a href="https://github.com/mes-aides/simulateur">sur GitHub</a>. Toutes les <a href="https://github.com/mes-aides/simulateur/issues">évolutions de Mes Aides</a>, espérées, planifiées ou réalisées, peuvent être suivies en permanence en ligne.</p>

    <p>Mes Aides se base sur <a href="https://www.openfisca.fr">OpenFisca</a>, un moteur de calcul libre et ouvert utilisé par des chercheurs en économie et d’autres services publics. L'<a href="https://github.com/mes-aides/simulateur">interface graphique de Mes Aides</a> est elle aussi un <a href="https://fr.wikipedia.org/wiki/Logiciel_libre" title="Sous licence AGPL" uib-popover="Sous licence AGPL" popover-trigger="mouseenter">logiciel libre</a>. Cela signifie que toute entité peut librement vérifier, s'inspirer de, copier, et modifier ce service. La seule contrepartie est la mise à disposition à la communauté des améliorations effectuées.</p>
     
  </article>
</template>
