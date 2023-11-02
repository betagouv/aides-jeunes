import { createSSRApp } from "vue";
import App from "./../../src/app.vue";
import DroitsDetails from "./../../src/components/droits-details-ssr.vue";

const droit = {
  label: "Loca-Pass",
  teleservice: "https://locapass.actionlogement.fr",
  prefix: "l’aide",
  entity: "individus",
  openfiscaPeriod: "thisMonth",
  institution: "action_logement",
  description: "L'avance LOCA-PASS® est une aide gratuite sous forme d'un prêt à 0 % pour financer tout ou partie de votre dépôt de garantie.",
  conditions: [
    "Ne pas être fonctionnaire."
  ],
  link: "https://www.actionlogement.fr/l-avance-loca-pass?utm_source=mes-aides-jeunes&utm_medium=resultats",
  type: "bool",
  floorAt: 0.01,
  periodicite: "ponctuelle"
}

const droits = [ droit ]

const app = createSSRApp({
    data: () => ({
      count: 1,
      droit,
      droits
    }),
    template: `<div @click="count++">
      Détails d'une aide : {{ count }}
      <DroitsDetails :droit="droit" />
    </div>`,
    components: {
      DroitsDetails
    }
  });

  app.component("App", App);

  app.mount("#app");
