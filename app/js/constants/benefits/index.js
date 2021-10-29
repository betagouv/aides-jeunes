"use strict"

const {
  PERIODICITE_PONCTUELLE,
  PERIODICITE_MENSUELLE,
  PERIODICITE_ANNUELLE,
} = require("../../../../lib/benefits")
const moment = require("moment")

var droitsDescription = {
  prestationsNationales: {
    assurance_retraite: {
      label: "Assurance retraite",
      imgSrc: "logo_assurance_retraite.png",
      etablissements: ["carsat"],
      prestations: {
        aspa: {
          label: "allocation de solidarité aux personnes âgées",
          periodicite: PERIODICITE_MENSUELLE,
          description:
            "L’allocation de solidarité aux personnes âgées (Aspa) est une prestation accordée aux personnes retraitées ayant de faibles ressources. Elle est versée tous les mois par la Carsat (ou la MSA si vous dépendez du régime agricole). Elle s’ajoute, dans une certaine limite, aux revenus personnels. Elle remplace le minimum vieillesse depuis 2006.",
          conditions: [
            'Résider <abbr title="Métropole, Guadeloupe, Guyane, Martinique ou Réunion">en France</abbr> plus de <abbr title="180 jours, potentiellement discontinus">6 mois</abbr> cette année.',
            "L’ASPA n’est pas compatible avec l’AAH. Avant de faire votre demande, renseignez-vous auprès de votre MDPH : le basculement vers le régime de l’ASPA n’est plus obligatoire pour les personnes qui atteignent depuis 2017 les 62 ans.",
            "Avoir demandé toutes les retraites (générale, réversion, complémentaire…) auxquelles vous avez droit.",
            "Votre conjoint·e doit avoir demandé toutes les retraites (générale, réversion, complémentaire…) auxquelles il ou elle a droit.",
          ],
          link: "https://www.service-public.fr/particuliers/vosdroits/F16871",
          form: "https://www.lassuranceretraite.fr/portail-info/files/live/sites/pub/files/PDF/demande-aspa.pdf",
          forms: {
            cnav: "https://www.lassuranceretraite.fr/portail-info/files/live/sites/pub/files/PDF/demande-aspa.pdf",
            msa: "https://www.formulaires.modernisation.gouv.fr/gf/cerfa_14953.do",
            rsi: "https://www.rsi.fr/fileadmin/mediatheque/.Espace_telechargement/Formulaires/Formulaire_allocation_solidarite_personnes_agees.pdf",
          },
          floorAt: 10,
          prefix: "l’",
          type: "float",
          unit: "€",
          entity: "familles",
        },
      },
    },
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
        },
        asi: {
          label: "allocation supplémentaire d’invalidité",
          periodicite: PERIODICITE_MENSUELLE,
          type: "float",
          unit: "€",
          description:
            "L’allocation supplémentaire d’invalidité (Asi) est une prestation accordée à certaines personnes invalides. Elle s’adresse à celles et ceux qui ont de faibles ressources et n’ont pas atteint l’âge de départ à la retraite. Elle est versée tous les mois et s’ajoute, dans une certaine limite, aux revenus personnels.",
          link: "https://www.service-public.fr/particuliers/vosdroits/F16940",
          form: "http://www.ameli.fr/fileadmin/user_upload/formulaires/S4151.pdf",
          forms: {
            general:
              "http://www.ameli.fr/fileadmin/user_upload/formulaires/S4151.pdf",
            msa: "https://www.formulaires.modernisation.gouv.fr/gf/cerfa_13435.do",
            rsi: "https://www.rsi.fr/fileadmin/mediatheque/.Espace_telechargement/Formulaires/formulaire_allocation_supplementaire_invalidite.pdf",
            cnav: "https://www.lassuranceretraite.fr/portail-info/files/live/sites/pub-bootstrap/files/Guides%20et%20formulaires/demande-asi.pdf",
          },
          entity: "individus", // default entity is familles
          floorAt: 10,
          prefix: "l’",
        },
      },
    },
    caf: {
      label: "Caisse d’allocations familiales",
      imgSrc: "logo_caf.png",
      etablissements: ["caf"],
      prestations: {
        af: {
          label: "allocations familiales",
          periodicite: PERIODICITE_MENSUELLE,
          type: "float",
          unit: "€",
          description:
            "Les allocations familiales sont réservées aux personnes ayant au moins 2 enfants de moins de 20 ans à charge. Le montant des prestations dépend des ressources, du nombre d’enfants à charge et de leurs âges. Elles sont versées tous les mois. Dans les DOM, les allocations sont versées à partir du premier enfant.",
          conditions: [
            'Résider <abbr title="Métropole, Guadeloupe, Guyane, Martinique ou Réunion">en France</abbr> plus de <abbr title="180 jours, potentiellement discontinus">6 mois</abbr> cette année.',
          ],
          link: "https://www.service-public.fr/particuliers/vosdroits/F13213",
          form: "https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/faireunedemandedeprestation/allocationsfamilialesouchangementdesituation",
          forms: {
            caf: "https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/faireunedemandedeprestation/allocationsfamilialesouchangementdesituation",
            msa: "http://www.msa.fr/lfr/documents/11566/132715/D%C3%A9claration+de+situation+pour+les+prestations+familiales+et+aides+au+logement.pdf",
          },
          isBaseRessourcesYearMinusTwo: true,
          prefix: "les",
          entity: "familles",
        },
        cf: {
          label: "complément familial",
          periodicite: PERIODICITE_MENSUELLE,
          type: "float",
          unit: "€",
          description:
            "Le complément familial s’ajoute aux allocations familiales à partir du troisième enfant à charge âgé de plus de 3 ans et de moins de 21 ans. Il est destiné aux familles ayant de faibles ressources. Dans les DOM, le complément familial concerne tous les enfants à charge âgés entre 3 et 5 ans.",
          link: "https://www.service-public.fr/particuliers/vosdroits/F13214",
          form: "https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/faireunedemandedeprestation/allocationsfamilialesouchangementdesituation",
          forms: {
            caf: "https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/faireunedemandedeprestation/allocationsfamilialesouchangementdesituation",
            msa: "http://www.msa.fr/lfr/documents/11566/132715/D%C3%A9claration+de+situation+pour+les+prestations+familiales+et+aides+au+logement.pdf",
          },
          isBaseRessourcesYearMinusTwo: true,
          prefix: "le",
          entity: "familles",
        },
        asf: {
          label: "allocation de soutien familial",
          periodicite: PERIODICITE_MENSUELLE,
          type: "float",
          unit: "€",
          description:
            "L’allocation de soutien familial (ASF) est destinée soit au parent qui élève seul un enfant non reconnu, privé de l’aide d’un parent ou dont l’autre parent est décédé, soit à la personne seule ou en couple qui recueille un enfant. L’ASF est versée par la Caf ou la MSA tous les mois.",
          conditions: [
            'Toucher une pension alimentaire d’un montant inférieur à celui de l’ASF ou ne pas toucher en intégralité une pension alimentaire attribuée par une décision de justice. À noter : la Caf ou la MSA peut vous aider à <a target="_blank" rel="noopener" title="Agence de recouvrement des impayés de pensions alimentaires (ARIPA)" href="https://www.pension-alimentaire.caf.fr/">récupérer les sommes dues</a>.',
          ],
          link: "https://www.caf.fr/aides-et-services/s-informer-sur-les-aides/solidarite-et-insertion/l-allocation-de-soutien-familial-asf-0",
          form: "https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/faireunedemandedeprestation/allocationdesoutienfamilial/!ut/p/a1/",
          forms: {
            caf: "https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/faireunedemandedeprestation/allocationdesoutienfamilial/!ut/p/a1/",
            msa: "http://www.msa.fr/lfr/documents/11566/48472/Demande+d%27allocation+de+soutien+familial+%28ASF%29.pdf",
          },
          floorAt: 10,
          prefix: "l’",
          entity: "familles",
        },
        paje_base: {
          label: "prestation d’accueil du jeune enfant – Allocation de base",
          periodicite: PERIODICITE_MENSUELLE,
          type: "float",
          unit: "€",
          description:
            "L’allocation de base de la prestation d’accueil du jeune enfant (Paje) a pour objet d’aider à assurer les dépenses liées à l’entretien et l’éducation d’un enfant. Elle est destinée aux parents d’un enfant de moins de 3 ans ayant de faibles ressources. Elle est versée par la Caf ou la MSA.",
          conditions: [
            'Résider <abbr title="Métropole, Guadeloupe, Guyane, Martinique ou Réunion">en France</abbr> plus de <abbr title="180 jours, potentiellement discontinus">6 mois</abbr> cette année.',
          ],
          link: "https://www.service-public.fr/particuliers/vosdroits/F13218",
          /* Teleservice caf si naissance ; formulaire caf si adoption ; formulaire MSA tout le temps ; le cas le plus général est le formulaire de changement de situation pour la Caf et la MSA */
          form: "https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/faireunedemandedeprestation/allocationsfamilialesouchangementdesituation",
          forms: {
            caf: "https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/faireunedemandedeprestation/allocationsfamilialesouchangementdesituation",
            msa: "http://www.msa.fr/lfr/documents/11566/132715/D%C3%A9claration+de+situation+pour+les+prestations+familiales+et+aides+au+logement.pdf",
          },
          isBaseRessourcesYearMinusTwo: true,
          prefix: "la",
          entity: "familles",
        },
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
        },
        aah: {
          periodicite: PERIODICITE_MENSUELLE,
          label: "allocation aux adultes handicapés",
          type: "float",
          unit: "€",
          description:
            "L’allocation aux adultes handicapés (AAH) est une aide financière qui permet d’assurer un revenu minimum. Cette aide est attribuée sous réserve de respecter 4 critères : le taux d’incapacité, l’âge, la nationalité et les ressources. L’AAH peut se cumuler soit avec le complément de ressources, soit avec la majoration pour la vie autonome ou, dans certains cas, l’aide à l’autonomie.",
          isBaseRessourcesYearMinusTwo: true,
          link: "https://www.service-public.fr/particuliers/vosdroits/F12242",
          forms: {
            mdph: "https://www.formulaires.modernisation.gouv.fr/gf/cerfa_13788.do",
          },
          entity: "individus", // default entity is familles,
          floorAt: 10,
          prefix: "l’",
        },
        caah: {
          // Les équipes de la DSS ont implémenté une V0 de la MVA dans la variable caah
          periodicite: PERIODICITE_MENSUELLE,
          label: "majoration pour la vie autonome",
          type: "float",
          unit: "€",
          description:
            "La majoration pour la vie autonome (MVA) est une aide financière qui peut s’ajouter à l’allocation aux adultes handicapés (AAH). Elle permet de faire face aux dépenses liées à votre handicap (par exemple, adaptation de votre logement).",
          isBaseRessourcesYearMinusTwo: true,
          link: "https://www.service-public.fr/particuliers/vosdroits/F12903",
          entity: "individus", // default entity is familles
          floorAt: 1,
          prefix: "la",
        },
        aeeh: {
          periodicite: PERIODICITE_MENSUELLE,
          label: "allocation d’éducation de l’enfant handicapé (AEEH)",
          description:
            "L’allocation d’éducation de l’enfant handicapé (AEEH) est une prestation destinée à compenser les frais d’éducation et de soins apportés à un enfant en situation de handicap. Cette aide est versée à la personne qui en assume la charge.",
          link: "https://www.service-public.fr/particuliers/vosdroits/F14809",
          forms: {
            mdph: "https://www.formulaires.modernisation.gouv.fr/gf/cerfa_15692.do",
          },
          type: "float",
          unit: "€",
          floorAt: 1,
          prefix: "l’",
          entity: "familles",
        },
      },
    },
    pole_emploi: {
      label: "Pôle emploi",
      imgSrc: "logo_pole_emploi.png",
      etablissements: ["pole_emploi"],
      prestations: {
        ass: {
          label: "allocation de solidarité spécifique",
          periodicite: PERIODICITE_MENSUELLE,
          type: "float",
          unit: "€",
          description:
            "L’allocation de solidarité spécifique (ASS) est une aide financière attribuée aux personnes ayant épuisé leurs droits au chômage. Elle peut être versée à taux plein ou à taux réduit. En cas de reprise d’activité, elle peut être maintenue.",
          conditions: [
            "Avoir travaillé au moins 5 ans au cours des 10 ans avant la fin de votre dernier contrat de travail.",
          ],
          link: "https://www.service-public.fr/particuliers/vosdroits/F12484",
          /* En principe, formulaire envoyé automatiquement ; lien vers brochure pole emploi */
          instructions:
            "http://www.pole-emploi.fr/front/common/tools/download_file.jspz?mediaid=186108",
          entity: "individus", // default entity is familles
          floorAt: 10,
          prefix: "l’",
        },
        agepi: {
          label: "aide à la garde d’enfants pour parent isolé",
          periodicite: PERIODICITE_MENSUELLE,
          type: "float",
          unit: "€",
          description:
            "L’aide à la garde d’enfants pour parent isolé (Agepi) est un dispositif de Pole Emploi pour les personnes qui reprennent un emploi.",
          link: "https://www.service-public.fr/particuliers/vosdroits/F1814",
          floorAt: 1,
          prefix: "l’",
          entity: "familles",
        },
      },
    },
    cheque_energie: {
      label: "Chèque Énergie",
      imgSrc: "logo_cheque_energie.png",
      prestations: {
        cheque_energie: {
          periodicite: PERIODICITE_ANNUELLE,
          label: "chèque Énergie",
          type: "float",
          unit: "€",
          description:
            "Le Chèque Énergie peut être utilisé pour toutes les dépenses d’énergie (électricité, gaz, fioul, bois, etc.) et les travaux de rénovation énergétique. Il est envoyé automatiquement chaque année en fonction de votre situation fiscale et de votre ménage.",
          conditions: [
            "Résider en France au 1er janvier de l‘année.",
            "Effectuer chaque année votre déclaration auprès des impôts.",
            "Utiliser votre Chèque Énergie reçu en avril avant le 31 mars de l’année suivante.",
          ],
          link: "https://www.chequeenergie.gouv.fr/beneficiaire/informations",
          /* En principe, envoyé automatique : lien direct vers le formulaire d'utilisation en ligne */
          instructions:
            "https://www.chequeenergie.gouv.fr/beneficiaire/cheque/paiement-en-ligne",
          isBaseRessourcesYearMinusTwo: true,
          entity: "menages", // default entity is familles
          prefix: "le",
          private: true,
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
    education_nationale: {
      label: "Éducation nationale",
      imgSrc: "logo_education_nationale.png",
      prestations: {
        bourse_college: {
          periodicite: PERIODICITE_ANNUELLE,
          label: "bourse de collège",
          unit: "€",
          type: "float",
          description:
            "La bourse de collège est une aide destinée à favoriser la scolarité des collégiens. Elle est versée aux familles ayant de faibles ressources. Son montant dépend du nombre d’enfants à charge.",
          conditions: [
            "Déposer votre dossier à partir de l’été 2021 pour l’année scolaire 2021-2022.",
            "Pour les élèves scolarisés en collège public, la demande se fait en ligne sur le portail Scolarité Services de votre établissement.",
          ],
          link: "https://www.service-public.fr/particuliers/vosdroits/F984",
          instructions:
            "http://www.education.gouv.fr/cid117994/scolarite-services-aide-a-la-premiere-connexion-des-parents.html",
          forms: {
            "2017-18":
              "https://www.formulaires.modernisation.gouv.fr/gf/cerfa_12539.do",
          },
          isBaseRessourcesYearMinusTwo: true,
          prefix: "la",
          entity: "familles",
        },
        bourse_lycee: {
          periodicite: PERIODICITE_ANNUELLE,
          label: "bourse de lycée",
          unit: "€",
          type: "float",
          description:
            "La bourse de lycée est accordée aux responsables d’un lycéen qui ont de faibles ressources. Si l’élève entre au lycée ou s’il n’a jamais touché de bourse de lycée, il pourra y prétendre selon les ressources et les charges de sa famille. Une nouvelle demande doit être effectuée en cas de redoublement ou réorientation.",
          conditions: [
            "Déposer votre dossier avant le 20 juin 2021 pour l’année scolaire 2021-2022.",
            "Pour les élèves scolarisés en lycée public, la demande se fait en ligne sur le portail Scolarité-Services.",
          ],
          link: "https://www.service-public.fr/particuliers/vosdroits/F616",
          form: "https://www.service-public.fr/simulateur/calcul/11319",
          forms: {
            "2017-18": "https://www.service-public.fr/simulateur/calcul/11319",
            "2018-19": "https://www.service-public.fr/simulateur/calcul/11319",
          },
          isBaseRessourcesYearMinusTwo: true,
          prefix: "la",
          entity: "familles",
        },
      },
    },
    cohesion_territoires: {
      label: "Ministère de la Cohésion des territoires",
      imgSrc: "logo_ministere_cohesion_territoires.png",
      prestations: {
        logement_social_eligible: {
          type: "bool",
          isBaseRessourcesYearMinusTwo: true,
          label: "logement social",
          description:
            "Le logement social est destiné aux personnes et familles dont les ressources ne dépassent pas un certain seuil et répondant à certaines conditions d’accès. Aucun frais de dossier n’est réclamé lors de la demande, ni lors de la signature du bail. Il n’est pas obligatoire de résider dans une commune pour y déposer un dossier.",
          conditions: [
            'Résider <abbr title="Métropole, Guadeloupe, Guyane, Martinique ou Réunion">en France</abbr> plus de <abbr title="180 jours, potentiellement discontinus">6 mois</abbr> cette année.',
            "Vous adresser aux organismes HLM du département où vous souhaiter résider à travers le téléservice que nous présentons ou bien auprès de la préfecture du département, à la mairie de la ville ou encore des organismes collecteurs du 1% logement.",
            "Renouveler chaque année votre demande jusqu’à obtention d’un logement.",
          ],
          link: "https://www.service-public.fr/particuliers/vosdroits/F869",
          teleservice:
            "https://www.demande-logement-social.gouv.fr/creation/accesCriteresEligibilites.do",
          top: 10,
          prefix: "le",
          private: true,
          entity: "familles",
        },
      },
    },
    departements_et_metropole: {
      imgSrc: "logo_etat_francais.png",
      repository: "france-local",
      label: "Départements et métropoles de France",
      interactionWithNationalPrestationsHandled: true,
      prefix: "les",
      prestations: {
        fsl_eligibilite: require("./fsl"),
      },
    },
  },
  partenairesLocaux: {
    paris: require("./paris"),
    rennesmetropole: {
      imgSrc: "logo_rennes_metropole.png",
      label: "Rennes Métropole",
      interactionWithNationalPrestationsHandled: true,
      prefix: "de",
      repository: "france-local",
      prestations: {
        rennes_metropole_transport: {
          periodicite: PERIODICITE_MENSUELLE,
          unit: "%",
          type: "float",
          legend: "de l’abonnement STAR",
          label: "tarification solidaire transports",
          description:
            "La tarification solidaire est une réduction de 50 %, 85 % ou 100 % (gratuité) de l’abonnement mensuel du réseau de transports en commun Star. La réduction s’applique également au service Handistar. Elle est accordée aux familles de Rennes Métropole ayant de faibles ressources. La tarification est accordée à tous les membres du foyer.",
          link: "http://metropole.rennes.fr/pratique/infos-demarches/deplacements-stationnement-voirie/tarification-solidaire-des-transports/",
          instructions:
            "http://metropole.rennes.fr/pratique/infos-demarches/deplacements-stationnement-voirie/tarification-solidaire-des-transports/#c33081",
          isBaseRessourcesYearMinusTwo: false,
          entity: "individus", // default entity is familles
          prefix: "la",
        },
      },
    },
    brestmetropole: {
      imgSrc: "logo_brest_metropole.png",
      label: "Brest métropole",
      interactionWithNationalPrestationsHandled: true,
      prefix: "de",
      repository: "france-local",
      prestations: {
        brest_metropole_transport: {
          legend: "au lieu de 38.50 € / mois",
          periodicite: "mensuelle",
          unit: "€",
          type: "float",
          label: "tarification solidaire transports",
          description:
            "Les familles aux ressources modestes bénéficient de forfaits mensuels à tarif réduit pour les transports : les forfaits Tempo, Tango et Rythmo. Tous les membres du foyer peuvent en bénéficier.",
          conditions: [
            'Présenter un <a target="_blank" rel="noopener" href="http://www.caf.fr/allocataires/vies-de-famille/changement-de-situation/changement-familial/le-quotient-familial-c-est-quoi">justificatif de votre quotient familial</a> délivré par votre Caf.',
          ],
          link: "https://www.bibus.fr/fr/titres-tarifs/titres/forfait-solidaire-mensuel-tempo",
          isBaseRessourcesYearMinusTwo: false,
          floorAt: 0.01,
          entity: "individus", // default entity is familles
          prefix: "la",
          participation: true,
        },
      },
    },
    alfortville: {
      imgSrc: "logo_alfortville.png",
      repository: "france-local",
      label: "Alfortville",
      interactionWithNationalPrestationsHandled: true,
      prefix: "d’",
      prestations: {
        alfortville_noel_enfants: {
          periodicite: PERIODICITE_ANNUELLE,
          legend: "en chèque cadeau",
          label: "noël des enfants",
          description:
            "La mairie d’Alfortville offre un chèque cadeau à chaque enfant de moins de 16 ans des familles aux ressources modestes. ",
          conditions: [
            "En cas de séparation, être le bénéficiaire des allocations familiales pour la demande.",
            "Habiter Alfortville depuis au moins trois mois.",
          ],
          link: "https://www.alfortville.fr/le-pole-solidarite-insertion",
          instructions:
            "https://www.alfortville.fr/le-pole-solidarite-insertion",
          isBaseRessourcesYearMinusTwo: false,
          floorAt: 0.01,
          private: true,
          prefix: "le",
          type: "float",
          unit: "€",
          entity: "familles",
        },
      },
    },
    cotes_d_armor: {
      imgSrc: "logo_cd22.jpg",
      repository: "france-local",
      label: "Côtes d'Armor",
      interactionWithNationalPrestationsHandled: true,
      prefix: "des",
      prestations: {
        cotes_d_armor_fonds_solidarite_logement_energie_eligibilite: {
          label:
            "fonds de solidarité pour le logement - Aide au paiement des factures d’énergie",
          description:
            "Le fonds de solidarité accorde des aides aux personnes qui rencontrent des difficultés pour assurer les dépenses de leur logement. L’aide « impayé énergie » correspond plus spécifiquement à l’aide au maintien des fournitures en eau, gaz, électricité, fioul et bois.",
          conditions: [
            "Occuper, à titre de résidence principale, un logement sur le territoire du département des Côtes d'Armor.",
          ],
          form: "https://cotesdarmor.fr/sites/default/files/2019-01/DOSSIER%20DE%20DEMANDE%20-%20Impay%C3%A9%20Energie%20.pdf",
          link: "https://cotesdarmor.fr/vos-services/acceder-ou-se-maintenir-dans-son-logement",
          isBaseRessourcesYearMinusTwo: false,
          entity: "individus",
          type: "bool",
          prefix: "le",
        },
      },
    },
    nouvelle_aquitaine: {
      imgSrc: "logo_nouvelle_aquitaine.png",
      repository: "france-local",
      label: "Nouvelle Aquitaine",
      interactionWithNationalPrestationsHandled: true,
      prefix: "de",
      prestations: {
        nouvelle_aquitaine_carte_solidaire: {
          label: "carte Solidaire pour les transports",
          unit: "%",
          type: "float",
          legend: "de réduction",
          periodicite: "ponctuelle",
          description:
            "La Carte Solidaire permet de bénéficier de réductions importantes sur les trajets en trains TER et cars régionaux en Nouvelle-Aquitaine. Elle est destinée aux personnes qui ont de faibles revenus ou bénéficient de certaines prestations.",
          link: "https://transports.nouvelle-aquitaine.fr/toute-lactualite-des-transports/un-tarif-solidaire-pour-les-trajets-en-trains-ter-et-cars-regionaux",
          instructions: "https://cartesolidaire-nouvelle-aquitaine.cba.fr/",
          entity: "individus",
          prefix: "la",
        },
      },
    },
    occitanie_region: {
      imgSrc: "logo_occitanie.png",
      repository: "france-local",
      label: "Région Occitanie",
      interactionWithNationalPrestationsHandled: true,
      prefix: "La",
      prestations: {
        occitanie_carte_transport_scolaire_lio: require("./occitanie_carte_transport_scolaire_lio"),
      },
    },
    toulouse_metropole: {
      imgSrc: "logo_toulouse_metropole.png",
      repository: "france-local",
      label: "Toulouse Métropole",
      interactionWithNationalPrestationsHandled: true,
      prefix: "de",
      prestations: {
        tisseo_transport_reduction: {
          label: "Réduction sur les titres de transports",
          legend: "de réduction",
          unit: "%",
          type: "float",
          periodicite: PERIODICITE_PONCTUELLE,
          description:
            "Des réductions de 70%, 80% ou 100% (gratuité) sont mises en place sur le réseau Tisséo pour cetaiens personnes (jeunes, familles à faibles revenus, personnes bénéficiant de certaines prestations, etc.).",
          link: "http://www.mon-tarif-tisseo.fr",
          instructions: "https://www.tisseo.fr/les-tarifs/e-agence",
          entity: "individus",
          prefix: "une",
        },
      },
    },
  },
}

var msaAdditionProviders = ["assurance_retraite", "assurance_maladie", "caf"]
msaAdditionProviders.forEach(function (providerId) {
  var prestations =
    droitsDescription.prestationsNationales[providerId].prestations
  Object.keys(prestations).forEach(function (benefitId) {
    prestations[benefitId].msa = true
  })
})

const { generate } = require("./utils")
droitsDescription.generate = (jam) =>
  generate(jam.collections, droitsDescription)

module.exports = droitsDescription
