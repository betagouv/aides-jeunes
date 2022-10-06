<template>
  <article class="text container aj-text-container">
    <h1>Toutes les aides</h1>
    <p class="total-element">Total: {{ benefits.length }} aides</p>
    <div class="cp-filter-block">
      <p class="cp-filter-label">Filtrer par code postal :</p>
      <input
        v-model="zipCode"
        type="text"
        class="cp-filter-input"
        @keyup.enter="computeDataSelected"
      />
    </div>
    <h6 v-if="selectedCommune" class="cp-filter-benefit-number"
      >{{ benefitsIncluded.length }} aides disponibles pour la commune de
      {{ selectedCommune.nom }}
    </h6>
    <div v-for="(type, key) in institutionsGroupByType" :key="key">
      <h2 :id="`liste_${key}`">{{ type.title }}</h2>
      <p class="total-element">
        Nombre d'aides : {{ type.benefitsLength }}
        <br />
        Nombre d'institutions :
        {{ type.institutions.length }}
      </p>

      <div v-for="institution in type.institutions" :key="institution.id">
        <h3 :id="institution.id" class="aj-question">
          <router-link
            :title="`Lien vers la liste des aides de l'institution ${institution.label}`"
            :to="{
              path: `/aides`,
              hash: `#${institution.id}`,
            }"
          >
            {{ institution.label }}
          </router-link>
        </h3>
        <p class="total-element">{{ institution.benefits.length }} aides :</p>
        <ul>
          <li v-for="benefit in institution.benefits" :key="benefit.id">
            <router-link
              :to="{ name: 'aide', params: { benefitId: benefit.id } }"
            >
              {{ $filters.capitalize(benefit.label) }}
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </article>
</template>

<script lang="ts">
import Institution from "@/lib/institution"
import epcis from "@etalab/decoupage-administratif/data/epci.json"
import Commune from "@/lib/commune"

const isGeographicallyIncluded = function (
  commune: any,
  institution: typeof Institution
): boolean {
  const typeInstitution = institution.type
  const idInstitution = institution.code_insee || institution.code_siren

  if (!commune || !idInstitution) {
    return false
  }
  if (typeInstitution === "national") {
    return true
  } else if (["region", "departement"].includes(typeInstitution)) {
    const codeNiveauInstitution = commune[typeInstitution]
    return idInstitution == codeNiveauInstitution
  } else if (typeInstitution === "epci") {
    const epciInfo = epcis.find((element) => element.code === idInstitution)
    return epciInfo && epciInfo.membres.some((c) => c.code === commune.code)
  } else if (typeInstitution === "commune") {
    // Commune code should be the same as the institution EPCI member founded with its siren code
    const institutionEpci = epcis.find((element) =>
      element.membres.find((membre) => {
        if (membre.siren === institution.code_siren) {
          return true
        }
      })
    )
    const InstitutionMatchCommune = institutionEpci.membres.some(
      (membre) =>
        institution.code_siren == membre.siren && membre.code == commune.code
    )
    return InstitutionMatchCommune
  } else if (typeInstitution === "caf") {
    return institution.department == commune.departement
  } else {
    return false
  }
}

const TYPES = {
  national: "Aides nationales",
  region: "Aides régionales",
  departement: "Aides départementales",
  epci: "EPCI (Métropole, inter-communauté, etc.)",
  caf: "CAF Locales",
  commune: "Aides communales",
  autre: "Autres aides",
}

export default {
  data() {
    return {
      zipCode: "" as string,
      selectedCommune: null as typeof Commune,
      selectedDepartement: null as string,
      selectedRegion: null as string,
      benefitsIncluded: [] as Array<any>,
    }
  },
  computed: {
    benefits(): Array<any> {
      return Institution.benefits.all.filter((benefit) => !benefit.private)
    },
    institutionsGroupByType(): any {
      const institutionsMap = Institution.benefits.institutionsMap
      const result = Object.entries(TYPES).reduce((accum, [type, title]) => {
        const benefits = this.benefits.filter((benefit) => {
          if (benefit.institution.type === type) {
            if (this.selectedCommune) {
              return isGeographicallyIncluded(
                this.selectedCommune,
                benefit.institution
              )
            } else {
              return benefit
            }
          }
        })
        benefits.sort((a, b) => {
          return a.label.localeCompare(b.label)
        })

        const institutions = benefits.reduce((accum, benefit) => {
          const institution = accum[benefit.institution.slug] || {
            ...institutionsMap[benefit.institution.slug],
            benefits: [],
          }
          institution.benefits.push(benefit)
          accum[institution.slug] = institution
          return accum
        }, {})

        accum[type] = {
          title,
          institutions: Object.values(institutions),
          benefitsLength: benefits.length,
        }
        return accum
      }, {})

      return result
    },
  },
  watch: {
    zipCode: function (newZipCode): void {
      if ([0, 5].includes(newZipCode.length)) {
        this.computeDataSelected()
      }
    },
  },
  methods: {
    checkBenefitsIncluded(): boolean {
      return this.benefits.filter((benefit) => {
        return isGeographicallyIncluded(
          this.selectedCommune,
          benefit.institution
        )
      })
    },
    async computeDataSelected(): Promise<void> {
      if (this.zipCode.match(/^[0-9]{5}$/)) {
        const res = await Commune.get(this.zipCode)
        this.selectedCommune = res[0]
        this.selectedDepartement = this.selectedCommune?.departement
        this.selectedRegion = this.selectedCommune?.region
        this.benefitsIncluded = this.checkBenefitsIncluded()
      } else {
        this.selectedCommune = null
      }
    },
  },
}
</script>

<style>
.total-element {
  color: var(--darker-grey);
  font-weight: 700;
}
.cp-filter-block {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.cp-filter-input {
  width: 6rem;
  text-align: center;
  height: 1.7rem;
}
.cp-filter-benefit-number {
  margin: 0.1rem 0 1rem 0;
}
</style>
