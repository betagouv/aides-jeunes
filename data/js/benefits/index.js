"use strict"

const {
  PERIODICITE_PONCTUELLE,
  PERIODICITE_MENSUELLE,
  PERIODICITE_ANNUELLE,
} = require("../../../lib/Benefits/Details")
const moment = require("moment")

const droitsDescription = {
  prestationsNationales: {
    assurance_maladie: {
      label: "Assurance maladie",
      imgSrc: "logo_assurance_maladie.png",
      etablissements: ["cpam"],
      prestations: {
        css_participation_forfaitaire: {
          label: "complémentaire santé solidaire",
          periodicite: PERIODICITE_MENSUELLE,
          description:
            "La Complémentaire Santé Solidaire (CSS) est une protection complémentaire santé (mutuelle). Elle remplace la Complémentaire Maladie Universelle Complémentaire (CMU-C) et l’Aide au paiement d’une Complémentaire Santé (ACS) à compter du 1ᵉʳ novembre 2019. Une fois attribuée, la CSS est accordée pour un an.",
          conditions: [
            'Résider <abbr title="Métropole, Guadeloupe, Guyane, Martinique ou Réunion">en France</abbr> depuis plus de 3 mois.',
          ],
          link: "https://www.service-public.fr/particuliers/vosdroits/F10027",
          form: "https://www.complementaire-sante-solidaire.gouv.fr/fichier-utilisateur/fichiers/S3711%20HOMO%20COMPLEMENTAIRE%20SANTE%20SOLIDAIRE%20non%20secu%2009_2019.pdf",
          teleservice:
            "https://assure.ameli.fr/PortailAS/appmanager/PortailAS/assure?_somtc=true&_pageID=P1_DEMANDE_CMUC",
          forms: {},
          prefix: "la",
          extra: [{ id: "cmu_c", entity: "familles", type: "bool" }],
          entity: "familles",
          compute: function (result, period) {
            return result.cmu_c && result.cmu_c[period]
              ? true
              : (result.css_participation_forfaitaire &&
                  result.css_participation_forfaitaire[period]) ||
                  0
          },
          type: "mixed",
          participation: true,
          msa: true,
        },
      },
    },
    caf: {
      label: "Caisse d’allocations familiales",
      imgSrc: "logo_caf.png",
      etablissements: ["caf"],
      prestations: {
        rsa: {
          label: "revenu de solidarité active",
          periodicite: PERIODICITE_MENSUELLE,
          labelFunction: function (b) {
            return `${b.label} pour un montant de ${b.montant} € / mois pendant 3 mois`
          },
          type: "float",
          unit: "€",
          description:
            "Le revenu de solidarité active (RSA) assure aux personnes sans ressources un niveau minimum de revenu variable selon la composition du foyer. Le RSA, le RSA parent isolé et le RSA jeunes parents sont simulés. Financé par les conseils départementaux, son versement se fait à travers la Caf ou la MSA. Les services sociaux de votre département vous orienteront vers l’organisme à qui adresser votre demande.",
          conditions: [
            'Signer un <a target="_blank" rel="noopener" href="http://social-sante.gouv.fr/affaires-sociales/lutte-contre-l-exclusion/droits-et-aides/le-revenu-de-solidarite-active-rsa/article/quels-sont-les-droits-et-devoirs-des-beneficiaires-du-rsa" title="Détails sur les droits et devoirs des bénéficiaires du RSA">contrat d’engagement réciproque</a> (CER) avec votre département ou un <a target="_blank" rel="noopener"  href="https://www.service-public.fr/particuliers/vosdroits/F14926" title="Détails sur les droits et devoirs des bénéficiaires du RSA">Projet Personnalisé d’Accès à l’Emploi</a> (PPAE) avec Pôle emploi.',
            "Résider en France plus de 9 mois par an.",
          ],
          link: "https://www.service-public.fr/particuliers/vosdroits/N19775",
          teleservice:
            "https://wwwd.caf.fr/redirect/s/Redirect?page=demandeRsa",
          forms: {
            caf: "https://www.formulaires.modernisation.gouv.fr/gf/cerfa_15481.do",
            msa: "https://www.formulaires.modernisation.gouv.fr/gf/cerfa_15481.do",
          },
          setToZeroRecently: true,
          isBaseRessourcesPatrimoine: true,
          entity: "familles",
          uncomputability: {
            tns: {
              reason: {
                user: "vous avez des revenus en tant qu’indépendant·e",
                admin: "le demandeur a des revenus en tant qu’indépendant·e",
              },
              solution:
                'Vous pouvez demander à bénéficier du RSA, mais c’est le président de votre conseil départemental qui <a target="_blank" rel="noopener" title="Article R262-23 du code de l’action sociale" href="https://www.legifrance.gouv.fr/affichCodeArticle.do?idArticle=LEGIARTI000028251799&cidTexte=LEGITEXT000006074069">décidera</a> de la manière dont vos revenus non salariés impacteront le montant de votre aide.',
            },
            conjoint_tns: {
              reason: {
                user: "votre conjoint·e a des revenus en tant qu’indépendant·e",
                admin:
                  "le conjoint du demandeur a des revenus en tant qu’indépendant·e",
              },
              solution:
                'Vous pouvez demander à bénéficier du RSA, mais c’est le président de votre conseil départemental qui <a target="_blank" rel="noopener" title="Article R262-23 du code de l’action sociale" href="https://www.legifrance.gouv.fr/affichCodeArticle.do?idArticle=LEGIARTI000028251799&cidTexte=LEGITEXT000006074069">décidera</a> de la manière dont les revenus non salariés de votre conjoint·e impacteront le montant de votre aide.',
            },
          },
          customization: {
            D93: {
              link: "https://www.seine-saint-denis.fr/IMG/pdf/guide_rsa_a5_8p-2014.pdf",
            },
            D75: {
              form: undefined, // Prevent default form recycling
              teleservice:
                "https://www.paris.fr/rsa#ou-et-comment-faire-une-demande-de-rsa_6",
            },
            M200046977: {
              provider: {
                imgSrc: "logo_lyon_metropole.png",
              },
              link: "https://www.grandlyon.com/services/rsa-mode-d-emploi.html",
            },
          },
          prefix: "le",
          floorAt: 10,
          msa: true,
        },
        aide_logement: {
          label: "aides au logement",
          periodicite: PERIODICITE_MENSUELLE,
          unit: "€",
          type: "float",
          description:
            "Les aides au logement regroupent trois aides différentes non cumulables : l’aide personnalisée au logement (Apl), l’allocation de logement familiale (Alf) et l’allocation de logement sociale (Als). Elles concernent les personnes ayant de faibles ressources, locataires ou remboursant le prêt de leur résidence principale. Elles sont versées par la Caf ou la MSA.",
          conditions: [
            "Résider au moins 8 mois par an dans le logement que vous avez décrit.",
            'Le logement doit être <a target="_blank" rel="noopener" href="https://www.caf.fr/aides-et-services/connaitre-vos-droits-selon-votre-situation/vous-louez-ou-vous-achetez-un-logement/vous-occupez-un-logement-insalubre-ou-non-decent" title="9 mètres carrés par personne, fenêtre, WC, eau potable, électricité" >décent</a>.',
          ],
          link: "https://www.service-public.fr/particuliers/vosdroits/N20360",
          teleservice:
            "https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/faireunedemandedeprestation/demanderlaideaulogement/",
          teleservices: {
            caf: "https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/faireunedemandedeprestation/demanderlaideaulogement/",
            msa: "http://www.msa.fr/lfr/c/bookmarks/open_entry?entryId=98643",
          },
          entity: "familles",
          computeUnexpectedAmount: (situation) => {
            // not ideal because we are not computing other incomes => but covers 90% of the cases
            const salary = situation.demandeur.salaire_net
              ? Object.values(situation.demandeur.salaire_net).reduce(
                  (acc, value) => acc + value,
                  0
                )
              : 0
            return situation.demandeur.activite === "etudiant" && salary >= 7000
          },
          isBaseRessourcesPatrimoine: true,
          uncomputability: {
            primo_accedant: {
              reason: {
                user: 'vous êtes <abbr title="Non propriétaire de votre résidence principale dans les deux années précédant l’achat de votre résidence actuelle">primo-accédant</abbr> à la propriété de votre résidence principale',
                admin:
                  "le demandeur est primo-accédant de sa résidence principale",
              },
              solution:
                'Le <a target="_blank" rel="noopener" href="https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/estimervosdroits/lelogement">simulateur de la CAF</a> pourra estimer vos droits sur la base de la valeur de votre bien.',
            },
            locataire_foyer: {
              reason: {
                user: "vous logez dans un foyer",
                admin: "le demandeur loge dans un foyer",
              },
              solution:
                'Le <a target="_blank" rel="noopener" href="https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/estimervosdroits/lelogement">simulateur de la CAF</a> vous donnera des estimations selon les différentes conventions possibles de votre foyer.',
            },
          },
          floorAt: 10,
          prefix: "les",
          msa: true,
        },
        ppa: {
          label: "prime d’activité",
          periodicite: PERIODICITE_MENSUELLE,
          type: "float",
          unit: "€",
          labelFunction: function (b) {
            return `${b.label} pour un montant de ${b.montant} € / mois pendant 3 mois`
          },
          description:
            "La prime d’activité complète les revenus d’activité professionnelle des travailleurs de 18 ans ou plus, des étudiants salariés et apprentis et des non-salariés. La demande peut se faire à travers un téléservice sur, selon votre cas, le site de la Caf ou de la MSA. Elle remplace le RSA activité et la prime pour l’emploi depuis 2016.",
          link: "https://www.service-public.fr/particuliers/vosdroits/F2882",
          teleservice:
            "https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/faireunedemandedeprestation/demanderlaprimedactivite/",
          teleservices: {
            caf: "https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/faireunedemandedeprestation/demanderlaprimedactivite/",
            msa: "http://www.msa.fr/lfr/c/bookmarks/open_entry?entryId=44739105",
          },
          floorAt: 5,
          prefix: "la",
          entity: "familles",
          computeUnexpectedAmount(situation) {
            let menage = situation.menage
            let isProprietaire = ["primo_accedant", "proprietaire"].includes(
              menage.statut_occupation_logement
            )
            return (
              (isProprietaire && menage.loyer > 0) ||
              (menage.statut_occupation_logement === "loge_gratuitement" &&
                menage.participation_frais)
            )
          },
          msa: true,
        },
      },
    },
    garantie_jeunes: {
      label: "Garantie Jeunes",
      imgSrc: "logo_garantie_jeunes.png",
      etablissements: ["mission_locale"],
      repository: "france-local",
      prestations: {
        garantie_jeunes: {
          label: "garantie Jeunes",
          periodicite: PERIODICITE_MENSUELLE,
          type: "float",
          unit: "€",
          description:
            "La garantie jeunes permet d’accompagner vers l’emploi ou la formation des jeunes entre 16 et 25 ans en situation difficile. C’est un parcours d´un an en partenariat avec la mission locale qui peut être prolongé jusqu’à 6 mois.",
          conditions: [
            'Faire votre demande d´accompagnement auprès de <a target="_blank" rel="noopener" href="https://www.unml.info/les-missions-locales/annuaire/" title="Annuaire des missions locales" >la Mission Locale</a> dont vous dépendez.',
            "Être indépendant, notamment ne pas bénéficier d'un soutien financier familial.",
          ],
          link: "https://www.service-public.fr/particuliers/vosdroits/F32700",
          entity: "individus", // default entity is familles
          prefix: "la",
          setToZeroRecently: true,
          computeUnexpectedAmount: (situation) => {
            let demandeur = situation.demandeur
            let period =
              situation.dateDeValeur &&
              moment(situation.dateDeValeur).format("YYYY")

            return (
              situation.demandeur.habite_chez_parents &&
              demandeur.enfant_a_charge &&
              demandeur.enfant_a_charge[period]
            )
          },
        },
      },
    },
    departements: {
      label: "Les conseils départementaux",
      imgSrc: "logo_cd_generique.png",
      etablissements: ["mds", "cdas", "centre_social", "edas", "sdsei"],
      prestations: {
        apa_eligibilite: require("./apa_eligibilite"),
      },
    },
    banque_de_france: {
      label: "La Banque de France",
      imgSrc: "logo_banque_de_france.png",
      prestations: {
        livret_epargne_populaire_taux: {
          label: "livret d’épargne populaire",
          labelFunction: function (b) {
            return `${b.label} avec un taux de ${b.montant}% an ${b.legend}`
          },
          unit: "%",
          type: "float",
          description:
            "Le livret d’épargne populaire (LEP) est un placement réservé aux personnes disposant de revenus modestes. Il offre de nombreux avantages parmi lesquels un taux d’intérêt garanti supérieur aux autres livrets réglementés.",
          conditions: [
            "Avoir votre domicile fiscal situé en France.",
            "Effectuer chaque année votre déclaration auprès des impôts.",
            "Présenter à l’établissement bancaire votre avis d’imposition indiquant votre revenu fiscal.",
          ],
          legend: (parameters) =>
            `au lieu de ${parameters["epargne.livret_a.taux"] * 100}%`,
          periodicite: PERIODICITE_ANNUELLE,
          link: "https://www.service-public.fr/particuliers/vosdroits/F2367",
          entity: "individus", // default entity is familles
          isBaseRessourcesYearMinusTwo: true,
          floorAt: 0.01,
          top: 20,
          prefix: "le",
        },
      },
    },
    departements_et_metropole: {
      imgSrc: "logo_etat_francais.png",
      repository: "france-local",
      label: "Départements et métropoles de France",
      prefix: "les",
      prestations: {
        fsl_eligibilite: require("./fsl"),
      },
    },
  },
  partenairesLocaux: {
    occitanie_region: {
      imgSrc: "logo_occitanie.png",
      repository: "france-local",
      label: "Région Occitanie",
      prefix: "La",
      prestations: {
        occitanie_carte_transport_scolaire_lio: require("./occitanie_carte_transport_scolaire_lio"),
      },
    },
  },
}

const { generate } = require("./utils")
droitsDescription.generate = (jam) =>
  generate(jam.collections, droitsDescription)

module.exports = droitsDescription
