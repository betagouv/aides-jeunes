import { EnumProperty, BooleanProperty } from "./property.js"
import { getAnswer } from "../answers.js"
import dayjs from "dayjs"

const isLessThanFiftyYearsOld = (props) => {
  const { simulation, periods } = props
  const date_naissance = getAnswer(
    simulation.answers.current,
    "individu",
    "date_naissance",
    "demandeur"
  )
  return dayjs(periods.today.value).diff(date_naissance, "year") < 50
}

export default {
  coloc: new BooleanProperty({
    question: "Est-ce une colocation ?",
  }),

  logement_chambre: new BooleanProperty({
    question: `Est-ce une chambre ?
      <span class="fr-hint-text">
        Une chambre est un logement qui ne comporte qu'une seule pièce et n'est pas équipé d'un WC.
      </span>`,
  }),

  participation_frais: new BooleanProperty({
    question: `Participez-vous aux frais du logement ?
      <span class="fr-hint-text"
        >Par exemple aux dépenses d'électricité, de téléphone, etc.</span
      >`,
  }),

  _difficultes_acces_ou_frais_logement: new BooleanProperty({
    question: `Rencontrez-vous des difficultés importantes pour accéder à un logement ou pour payer les frais liés à votre logement ?`,
  }),

  _nombreMoisEntreeLogement: new EnumProperty({
    question: "Prévoyez-vous de déménager prochainement ?",
    questionType: "enum",
    items: [
      { value: 12, label: "Oui" },
      {
        value: -2,
        label: "Non, j'ai emménagé il y a moins de 3 mois",
        isRelevant: ({ simulation }) => {
          const value = getAnswer(
            simulation.answers.current,
            "menage",
            "_logementType"
          )
          return value === "locataire"
        },
      },
      { value: -12, label: "Non" },
    ],
  }),
  _logementType: new EnumProperty({
    question: "Êtes-vous ?",
    questionType: "enum",
    items: [
      {
        label: "Locataire",
        value: "locataire",
        hint: "figurant sur le bail, en foyer ou en résidence",
      },
      {
        label: "Propriétaire",
        value: "proprietaire",
        hint: "ou en location-accession",
      },
      {
        label: "Hébergé ou hébergée",
        value: "heberge",
        hint: "chez vos parents, chez un particulier ou en logement de fonction",
      },
      {
        label: "Sans domicile stable",
        value: "sansDomicile",
        hint: "ou domiciliation administrative",
      },
    ],
  }),
  _primoAccedant: new BooleanProperty({
    question: `Êtes-vous primo-accédant pour cette propriété ? </br>
      <span class="fr-hint-text"
        >Un primo-accédant est une personne (ou un ménage) qui n’a pas été propriétaire de sa résidence principale dans les deux années qui viennent de s’écouler au moment où il achète son bien.</span
      >`,
  }),
  _locationType: new EnumProperty({
    question: "Quel type de logement louez-vous ?",
    items: [
      {
        label: "Non meublé",
        value: "vide",
      },
      {
        label: "Meublé / Hôtel",
        value: "meuble",
      },
      {
        label: "Foyer",
        value: "foyer",
        isRelevant: (props) => isLessThanFiftyYearsOld(props),
        hint: "Résidence universitaire, logement CROUS, foyer de jeune travailleur, résidence sociale…",
      },
      {
        label: "Foyer",
        value: "foyer",
        isRelevant: (props) => !isLessThanFiftyYearsOld(props),
        hint: "Maison de retraite, résidence sociale…",
      },
    ],
  }),
}
