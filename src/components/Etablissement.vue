<template>
  <div class="etablissement">
    <div v-if="etablissement">
      <h2>{{etablissement.nom}}</h2>
      <div class="details">
        <address v-if="etablissement.adresse">
          <i class="fa fa-home" aria-hidden="true"></i> Adresse :<br />
          <div v-for="(ligne, index) in etablissement.adresse.lignes" v-bind:key="index">
            {{ ligne }}<br />
          </div>
          {{ etablissement.adresse.codePostal }} {{ etablissement.adresse.commune }}
        </address>
        <div v-if="etablissement.horaires">
          <i class="fa fa-clock-o" aria-hidden="true"></i> Horaires :<br />
          <div v-for="plage_jour in etablissement.horaires" v-bind:key="plage_jour.du">
            <div v-if="plage_jour.du === plage_jour.au">
              Les {{ plage_jour.du }}s :
            </div>
            <div v-if="plage_jour.du !== plage_jour.au">
              Du {{ plage_jour.du }} au {{ plage_jour.au }} :
            </div>
            <ul>
              <li v-for="plage_heure in plage_jour.heures" v-bind:key="plage_heure.de">
                de {{ extractHHMM(plage_heure.de) }} à {{ extractHHMM(plage_heure.a) }}
              </li>
            </ul>
          </div>
        </div>
        <div v-if="hasContact">
          Contact :<br />
          <div v-if="etablissement.url">
            <i class="fa fa-share-square-o" aria-hidden="true"></i>
            <a
              v-bind:href="etablissement.url"
              target="_blank"
              rel="noopener"
              v-analytics="{ name:etablissement.id, action:'Site internet', category:'Partenaire'}"
            >
              Site internet
            </a>
          </div>
          <div v-if="etablissement.telephone">
            <i class="fa fa-phone" aria-hidden="true"></i>
            <a
              v-bind:href="`tel:${ etablissement.telephone }`"
              target="_blank"
              rel="noopener"
              v-analytics="{ name:etablissement.id, action:'Téléphone', category:'Partenaire'}"
            >
              {{ etablissement.telephone }}
            </a>
          </div>
        </div>
      </div>
    </div>
    <p v-else>
      Pes d'informations disponibles
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

<style lang="scss">
.etablissement {
  padding: 1em;
  margin: 1em 0;
  background-color: white;
  border-radius: 10px;

  h2 {
    margin: 0;
  }

  .details {
    display: flex;
    flex-wrap: wrap;
    > * {
      margin: 0.3em 1em;
      min-width: 20%;
    }

    ul {
      margin: 0;
    }
  }
}
</style>
