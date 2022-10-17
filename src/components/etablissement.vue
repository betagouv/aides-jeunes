<template>
  <div class="aj-box aj-etablissement">
    <div v-if="etablissement">
      <h2 class="aj-question">
        {{ etablissement.nom }}
      </h2>
      <div class="aj-etablissement-details">
        <address v-if="etablissement.adresse">
          <i aria-hidden="true" class="ri ri-home-4-line" /> Adresse :
          <span
            v-for="(ligne, index) in etablissement.adresse.lignes"
            :key="index"
          >
            {{ ligne }}
          </span>
          {{ etablissement.adresse.codePostal }}
          {{ etablissement.adresse.commune }}
        </address>
        <div
          v-if="etablissement.telephone"
          class="aj-etablissements-action-tel-desktop"
        >
          <i aria-hidden="true" class="ri ri-phone-fill" />
          {{ etablissement.telephone }}
        </div>
        <div v-if="etablissement.horaires" class="aj-etablissement-horaires">
          <i aria-hidden="true" class="ri ri-time-line" /> Horaires :<br />
          <div class="aj-etablissement-horaires-plage-container">
            <div
              v-for="plage_jour in etablissement.horaires"
              :key="plage_jour.du"
              class="aj-etablissement-horaires-plage"
            >
              <div v-if="plage_jour.du === plage_jour.au" class="font-bold">
                Les {{ plage_jour.du }}s
              </div>
              <div v-if="plage_jour.du !== plage_jour.au" class="font-bold">
                Du {{ plage_jour.du }} au {{ plage_jour.au }}
              </div>
              <ul class="list-unstyled">
                <li
                  v-for="plage_heure in plage_jour.heures"
                  :key="plage_heure.de"
                >
                  de {{ extractHHMM(plage_heure.de) }} à
                  {{ extractHHMM(plage_heure.a) }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div v-if="hasContact" class="aj-etablissements-actions">
          <div v-if="etablissement.url">
            <a
              v-analytics="{
                name: etablissement.id,
                action: 'Site internet',
                category: 'Partenaire',
              }"
              :aria-label="`Site internet : ${etablissement.nom} - Nouvelle fenêtre`"
              :href="etablissement.url"
              class="button primary with-icon"
              rel="noopener"
              target="_blank"
            >
              <i aria-hidden="true" class="ri ri-share-box-line" />
              Site internet
            </a>
          </div>
          <div
            v-if="etablissement.telephone"
            class="aj-etablissements-action-tel-mobile"
          >
            <a
              v-analytics="{
                name: etablissement.id,
                action: 'Téléphone',
                category: 'Partenaire',
              }"
              :href="`tel:${etablissement.telephone}`"
              class="button primary with-icon"
              rel="noopener"
              target="_blank"
            >
              <i aria-hidden="true" class="ri ri-phone-fill" />
              {{ etablissement.telephone }}
            </a>
          </div>
        </div>
      </div>
    </div>
    <p v-else> Aucune information disponible sur cette agence </p>
  </div>
</template>

<script>
export default {
  name: "Etablissement",
  props: {
    etablissement: Object,
  },
  computed: {
    hasContact: function () {
      return this.etablissement?.url || this.etablissement?.telephone
    },
  },
  methods: {
    extractHHMM: function (dateString) {
      return dateString.slice(0, 5)
    },
  },
}
</script>
