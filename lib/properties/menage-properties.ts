import { EnumProperty, BooleanProperty } from "./property.js"
import { getAnswer } from "../answers.js"
import dayjs from "dayjs"
import {
  EtatLogementFoyer,
  LocationCategory,
  LogementCategory,
} from "../enums/logement.js"

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

  etat_logement_foyer: new EnumProperty({
    question: "Est-ce que ce logement a été réhabilité ?",
    questionType: "enum",
    items: [
      {
        label: "Oui",
        value: EtatLogementFoyer.LogementRehabilite,
        // hint: "figurant sur le bail, en foyer ou en résidence",
      },
      {
        label: "Non",
        value: EtatLogementFoyer.LogementNonRehabilite,
        // hint: "figurant sur le bail, en foyer ou en résidence",
      },
      {
        label: "Je ne sais pas",
        value: EtatLogementFoyer.NonNenseigne,
        // hint: "figurant sur le bail, en foyer ou en résidence",
      },
    ],
  }),

  logement_chambre: new BooleanProperty({
    question: `Est-ce une chambre ?
      <span class="fr-hint-text">
        Une chambre est un logement qui ne comporte qu'une seule pièce et n'est pas équipé d'un WC.
      </span>`,
  }),

  logement_crous: new BooleanProperty({
    question: `Est-ce un logement dans une résidence CROUS ?`,
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
          return value === LogementCategory.Locataire
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
        value: LogementCategory.Locataire,
        hint: "figurant sur le bail, en foyer ou en résidence",
      },
      {
        label: "Propriétaire",
        value: LogementCategory.Proprietaire,
        hint: "ou en location-accession",
      },
      {
        label: "Hébergé ou hébergée",
        value: LogementCategory.Heberge,
        hint: "chez vos parents, chez un particulier ou en logement de fonction",
      },
      {
        label: "Sans domicile stable",
        value: LogementCategory.SansDomicile,
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
        value: LocationCategory.Vide,
      },
      {
        label: "Meublé / Hôtel",
        value: LocationCategory.Meuble,
      },
      {
        label: "Foyer",
        value: LocationCategory.Foyer,
        isRelevant: (props) => isLessThanFiftyYearsOld(props),
        hint: "Résidence universitaire, logement CROUS, foyer de jeune travailleur, résidence sociale…",
      },
      {
        label: "Foyer",
        value: LocationCategory.Foyer,
        isRelevant: (props) => !isLessThanFiftyYearsOld(props),
        hint: "Maison de retraite, résidence sociale…",
      },
    ],
  }),
}
