<template>
  <div class="aj-box aj-etablissement">
    <div v-if="etablissement">
      <h2 class="aj-question">{{etablissement.nom}}</h2>
      <div class="aj-etablissement-details">
        <address v-if="etablissement.adresse">
          <i class="fa fa-home" aria-hidden="true"></i> Adresse :
          <span v-for="(ligne, index) in etablissement.adresse.lignes" v-bind:key="index">
            {{ ligne }}
          </span>
          {{ etablissement.adresse.codePostal }} {{ etablissement.adresse.commune }}
        </address>
        <div v-if="etablissement.telephone" class="aj-etablissements-action-tel-desktop">
          <i class="fa fa-phone" aria-hidden="true"></i>
          {{ etablissement.telephone }}
        </div>
        <div v-if="etablissement.horaires" class="aj-etablissement-horaires">
          <i class="fa fa-clock-o" aria-hidden="true"></i> Horaires :<br />
          <div class="aj-etablissement-horaires-plage-container">
              <div v-for="plage_jour in etablissement.horaires" class="aj-etablissement-horaires-plage" v-bind:key="plage_jour.du">
                <div class="font-bold" v-if="plage_jour.du === plage_jour.au">
                  Les {{ plage_jour.du }}s
                </div>
                <div class="font-bold" v-if="plage_jour.du !== plage_jour.au">
                  Du {{ plage_jour.du }} au {{ plage_jour.au }}
                </div>
                <ul class="list-unstyled">
                  <li v-for="plage_heure in plage_jour.heures" v-bind:key="plage_heure.de">
                    de {{ extractHHMM(plage_heure.de) }} à {{ extractHHMM(plage_heure.a) }}
                  </li>
                </ul>
              </div>
          </div>
        </div>
        <div v-if="hasContact" class="aj-etablissements-actions">
          <div v-if="etablissement.url">
            <a
              v-bind:href="etablissement.url"
              class="button primary with-icon"
              target="_blank"
              rel="noopener"
              v-analytics="{ name:etablissement.id, action:'Site internet', category:'Partenaire'}"
            >
              <i class="fa fa-share-square-o" aria-hidden="true"></i>
              Site internet
            </a>
          </div>
          <div v-if="etablissement.telephone" class="aj-etablissements-action-tel-mobile">
            <a
              v-bind:href="`tel:${ etablissement.telephone }`"
              class="button primary with-icon"
              target="_blank"
              rel="noopener"
              v-analytics="{ name:etablissement.id, action:'Téléphone', category:'Partenaire'}"
            >
              <i class="fa fa-phone" aria-hidden="true"></i>
              {{ etablissement.telephone }}
            </a>
          </div>
        </div>
      </div>
    </div>
    <p v-else>
      Aucune information disponible sur cette agence
    </p>
  </div>
</template>

<script>
export default {
  name: 'Etablissement',
  props: {
    etablissement: Object
  },
  computed: {
    hasContact: function() {
      return this.etablissement && (this.etablissement.url || this.etablissement.telephone)
    }
  },
  methods: {
    extractHHMM: function(dateString) {
        return dateString.slice(0,5)
    }
  },
}

</script>
