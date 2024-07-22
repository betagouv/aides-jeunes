import { EnumProperty, NumberProperty, BooleanProperty } from "./property.js"

export default {
  _situation: new EnumProperty({
    question: "Quelle est la situation de vos parents ?",
    items: [
      {
        label: "En couple",
        value: "en_couple",
      },
      {
        label: "Séparés",
        value: "separes",
      },
      {
        label: "Célibataire",
        value: "celibataire",
      },
      {
        label: "Veuf ou veuve",
        value: "veuve",
      },
      {
        label: "Décédés",
        value: "decedes",
      },
      {
        label: "Sans autorité parentale",
        value: "sans_autorite",
      },
    ],
  }),
  _en_france: new BooleanProperty({
    question: "Vos parents habitent-ils en France ?",
  }),

  nbptr: new NumberProperty({
    question:
      "Quel est le nombre de parts sur le plus récent avis d'imposition de vos parents ?",
    questionType: "number",
    optional: true,
    type: "count",
    min: 0,
    max: 30,
    moreInfo:
      "Une part fiscale est une unité représentative des personnes composant le foyer fiscal, servant au calcul de l’impôt sur le revenu. Pour trouver le nombre de parts fiscales dont vous disposez, vous pouvez vous référer à votre déclaration fiscale, où cette information est généralement indiquée.",
  }),

  rfr: new NumberProperty({
    question:
      "Quel est le revenu fiscal de référence (RFR) sur le plus récent avis d'imposition de vos parents ?",
    questionType: "number",
    help: "Si vous ne connaissez pas le RFR de vos parents, écrivez 0 pour poursuivre la simulation. Attention, cela pourrait impacter l'exactitude des résultats de la simulation.",
    moreInfo: `<b>Le revenu fiscal de référence (RFR)</b> est calculé par les impôts à partir des revenus que vous avez déclarés dans votre déclaration d’impôts. 
    Il prend en compte l’ensemble des revenus de votre foyer fiscal, que vous soyez imposable ou non imposable.</br></br>
    Toutes les informations concernant le <b>RFR</b> et comment le trouver sont disponibles sur le site du service-public : 
    <a href="https://www.service-public.fr/particuliers/vosdroits/F13216" target="_blank">https://www.service-public.fr/particuliers/vosdroits/F13216</a>.`,
  }),
}
