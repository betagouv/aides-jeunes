<template>
  <form @submit.prevent="onSubmit">
    <InputDepCom
      v-model:codePostal="codePostal"
      v-model:nomCommune="nomCommune"
      v-model:matchingCommune="matchingCommune"
      codePostalLabel="Quel est le code postal de la commune de vos parents ?"
    />
    <WarningMessage v-if="warningMessage" :text="warningMessage" />
    <ActionButtons :on-submit="onSubmit" />
  </form>
</template>
<script>
import ActionButtons from "@/components/ActionButtons"
import InputDepCom from "@/components/InputDepcom"
import Individu from "@/../lib/Individu"

import WarningMessage from "@/components/WarningMessage"
import Warning from "@/lib/Warnings"

export default {
  name: "SimulationIndividuBourseCriteresSociauxCommuneDomicileFamilial",
  components: {
    ActionButtons,
    InputDepCom,
    Warning,
    WarningMessage,
  },
  data() {
    const id = this.$route.params.id
    const role = id.split("_")[0]
    const { individu } = Individu.get(
      this.$store.getters.peopleParentsFirst,
      role,
      this.$route.params.id,
      this.$store.state.dates
    )
    const codePostal =
      individu._bourseCriteresSociauxCommuneDomicileFamilialCodePostal
    const nomCommune =
      individu._bourseCriteresSociauxCommuneDomicileFamilialNomCommune
    return {
      codePostal,
      individu,
      nomCommune,
      matchingCommune: undefined,
    }
  },
  computed: {
    warningMessage() {
      return Warning.get("aj_not_reliable", this.codePostal)
    },
  },
  methods: {
    onSubmit: function () {
      if (!this.nomCommune || !this.codePostal) {
        this.$store.dispatch("updateError", "Ce champ est obligatoire.")
        return
      }
      if (this.matchingCommune) {
        this.$store.dispatch("answer", {
          id: "demandeur",
          entityName: "individu",
          fieldName: "_bourseCriteresSociauxCommuneDomicileFamilial",
          value: {
            _bourseCriteresSociauxCommuneDomicileFamilial:
              this.matchingCommune.code,
            _bourseCriteresSociauxCommuneDomicileFamilialCodePostal:
              this.codePostal.toString(),
            _bourseCriteresSociauxCommuneDomicileFamilialNomCommune:
              this.nomCommune,
            _bourseCriteresSociauxCommuneDomicileFamilialDepartement:
              this.matchingCommune.departement,
            _bourseCriteresSociauxCommuneDomicileFamilialRegion:
              this.matchingCommune.region,
            _bourseCriteresSociauxCommuneDomicileFamilialEpci:
              this.matchingCommune.epci,
            _bourseCriteresSociauxCommuneDomicileFamilialEpciType:
              this.matchingCommune.epciType,
          },
        })
      }
      this.$push()
    },
  },
}
</script>
