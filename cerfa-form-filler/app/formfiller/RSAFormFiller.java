package formfiller;

import java.util.EnumMap;

import models.Individu;
import models.Individu.Civilite;
import models.Individu.IndividuRole;
import models.Individu.Nationalite;
import models.Individu.StatutMarital;
import models.Logement.Adresse;
import models.Logement.LogementType;
import models.Ressource.RessourcePeriode;
import models.Ressource.RessourceType;
import models.SituationPro;
import models.SituationPro.SalarieContractType;
import models.SituationPro.SituationProType;
import models.SituationService;

import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.joda.time.LocalDate;

public class RSAFormFiller extends FormFiller {

    private static final Object[][] checkboxes = {
        {"demandeur.homme", 0, 102, 703},
        {"demandeur.femme", 0,  30, 703},
        {"conjoint.homme",  0, 378, 703},
        {"conjoint.femme",  0, 306, 703},

        {"demandeur.francais", 0, 30, 578},
        {"demandeur.ue",       0, 91, 578},
        {"demandeur.non_ue",   0, 178, 578},
        {"conjoint.francais",  0, 306, 578},
        {"conjoint.ue",        0, 367, 578},
        {"conjoint.non_ue",    0, 457, 578},

        {"demandeur.inscrit_caf.oui", 0,  30, 475},
        {"demandeur.inscrit_caf.non", 0, 102, 475},
        {"conjoint.inscrit_caf.oui",  0, 306, 475},
        {"conjoint.inscrit_caf.non",  0, 378, 475},

        {"logement.locataire",       0,  29, 175},
        {"logement.payant",          0,  29, 161},
        {"logement.gratuit",         0,  29, 133},
        {"logement.proprio_avec_pret",    0,  29, 147},
        {"logement.proprio_sans_pret", 0, 203, 147},

        {"seul",      1, 31, 671},
        {"en_couple", 1, 31, 746},

        {"statut_marital.mariage",           1, 45, 731},
        {"statut_marital.pacs",              1, 45, 716},
        {"statut_marital.relation_libre",    1, 45, 701},
        {"statut_marital.separe",            1, 45, 656},
        {"statut_marital.pacs_rompu",        1, 45, 641},
        {"statut_marital.divorce",           1, 45, 626},
        {"statut_marital.veuf",              1, 45, 611},
        {"statut_marital.concubinage_rompu", 1, 45, 596},
        {"statut_marital.celibataire",       1, 45, 581},

        {"enceinte.oui", 1, 155, 551},
        {"enceinte.non", 1, 193, 551},

        {"pension_alimentaire.separe",          1, 31, 338},
        {"pension_alimentaire.has_child_alone", 1, 31, 310},

        {"pro.demandeur.sans_activite", 2, 230, 723},
        {"pro.demandeur.sans_activite.volontairement.oui", 2, 230, 708},
        {"pro.demandeur.sans_activite.volontairement.non", 2, 266, 708},
        {"pro.demandeur.salarie",       2, 230, 693},
        {"pro.demandeur.salarie.contrat.cdi",     2, 230, 678},
        {"pro.demandeur.salarie.contrat.cdd",     2, 289, 678},
        {"pro.demandeur.salarie.contrat.interim", 2, 347, 678},
        {"pro.demandeur.apprenti",      2, 230, 623},
        {"pro.demandeur.travailleur_saisonnier", 2, 230, 608},
        {"pro.demandeur.stagiaire",     2, 230, 593},
        {"pro.demandeur.stagiaire.remunere.oui", 2, 230, 578},
        {"pro.demandeur.stagiaire.remunere.non", 2, 266, 578},
        {"pro.demandeur.independant",   2, 230, 443},
        {"pro.demandeur.gerant_salarie", 2, 230, 357},
        {"pro.demandeur.demandeur_emploi",     2, 230, 327},
        {"pro.demandeur.demandeur_emploi.non", 2, 266, 327},
        {"pro.demandeur.demandeur_emploi.indemnise.oui", 2, 230, 297},
        {"pro.demandeur.demandeur_emploi.indemnise.non", 2, 266, 297},
        {"pro.demandeur.etudiant",      2, 230, 267},
        {"pro.demandeur.retraite",      2, 230, 252},
        {"pro.conjoint.sans_activite",  2, 398, 723},
        {"pro.conjoint.sans_activite.volontairement.oui", 2, 398, 708},
        {"pro.conjoint.sans_activite.volontairement.non", 2, 434, 708},
        {"pro.conjoint.salarie",        2, 398, 693},
        {"pro.conjoint.salarie.contrat.cdi",     2, 398, 678},
        {"pro.conjoint.salarie.contrat.cdd",     2, 457, 678},
        {"pro.conjoint.salarie.contrat.interim", 2, 519, 678},
        {"pro.conjoint.apprenti",       2, 398, 623},
        {"pro.conjoint.travailleur_saisonnier", 2, 398, 608},
        {"pro.conjoint.stagiaire",      2, 398, 593},
        {"pro.conjoint.stagiaire.remunere.oui", 2, 398, 578},
        {"pro.conjoint.stagiaire.remunere.non", 2, 434, 578},
        {"pro.conjoint.independant",    2, 398, 443},
        {"pro.conjoint.gerant_salarie", 2, 398, 357},
        {"pro.conjoint.demandeur_emploi",     2, 398, 327},
        {"pro.conjoint.demandeur_emploi.non", 2, 434, 327},
        {"pro.conjoint.demandeur_emploi.indemnise.oui", 2, 398, 297},
        {"pro.conjoint.demandeur_emploi.indemnise.non", 2, 434, 297},
        {"pro.conjoint.etudiant",       2, 398, 267},
        {"pro.conjoint.retraite",       2, 398, 252},

        {"ressources.demandeur.1.aucune", 3, 250, 637},
        {"ressources.demandeur.2.aucune", 3, 307, 637},
        {"ressources.demandeur.3.aucune", 3, 363, 637},
        {"ressources.conjoint.1.aucune",  3, 420, 637},
        {"ressources.conjoint.2.aucune",  3, 477, 637},
        {"ressources.conjoint.3.aucune",  3, 533, 637},
        {"ressources.enfant.1.1.aucune",  4, 250, 739},
        {"ressources.enfant.1.2.aucune",  4, 307, 739},
        {"ressources.enfant.1.3.aucune",  4, 363, 739},
        {"ressources.enfant.2.1.aucune",  4, 420, 739},
        {"ressources.enfant.2.2.aucune",  4, 477, 739},
        {"ressources.enfant.2.3.aucune",  4, 533, 739},
    };

    private static final Object[][] textFields = {
        {"demandeur.nom",             0, 155, 687},
        {"demandeur.nom_usage",       0, 133, 670},
        {"demandeur.prenom",          0, 170, 648},
        {"demandeur.pays_naissance",  0, 115, 620},
        {"demandeur.ville_naissance", 0,  83, 605},
        {"demandeur.num_allocataire", 0, 100, 460},

        {"conjoint.nom",             0, 430, 687},
        {"conjoint.nom_usage",       0, 408, 670},
        {"conjoint.prenom",          0, 442, 648},
        {"conjoint.pays_naissance",  0, 390, 620},
        {"conjoint.ville_naissance", 0, 358, 605},
        {"conjoint.num_allocataire", 0, 375, 460},

        {"adresse.numero",      0, 45, 378},
        {"adresse.rue",         0, 135, 378},
        {"adresse.ville",       0, 253, 350},
        {"adresse.mail.gauche", 0, 92, 321},
        {"adresse.mail.droite", 0, 267, 321},

        {"adresse.conjoint.numero", 0, 45, 235},
        {"adresse.conjoint.rue",    0, 135, 235},
        {"adresse.conjoint.ville",  0, 253, 207},
        {"adresse.conjoint.pays",   0, 480, 207},

        {"enfant.1.nom",            1, 117, 515, 7},
        {"enfant.1.lien_parente",   1, 117, 496, 7},
        {"enfant.1.date_naissance", 1, 117, 484, 7},
        {"enfant.1.lieu_naissance", 1, 117, 472, 7},
        {"enfant.1.nationalite",    1, 117, 453, 7},
        {"enfant.1.nir",            1, 117, 430, 7},
        {"enfant.1.date_arrivee",   1, 117, 406, 7},
        {"enfant.1.situation",      1, 117, 387, 6},

        {"enfant.2.nom",            1, 230, 515, 7},
        {"enfant.2.lien_parente",   1, 230, 496, 7},
        {"enfant.2.date_naissance", 1, 230, 484, 7},
        {"enfant.2.lieu_naissance", 1, 230, 472, 7},
        {"enfant.2.nationalite",    1, 230, 453, 7},
        {"enfant.2.nir",            1, 230, 430, 7},
        {"enfant.2.date_arrivee",   1, 230, 406, 7},
        {"enfant.2.situation",      1, 230, 387, 6},

        {"enfant.3.nom",            1, 343, 515, 7},
        {"enfant.3.lien_parente",   1, 343, 496, 7},
        {"enfant.3.date_naissance", 1, 343, 484, 7},
        {"enfant.3.lieu_naissance", 1, 343, 472, 7},
        {"enfant.3.nationalite",    1, 343, 453, 7},
        {"enfant.3.nir",            1, 343, 430, 7},
        {"enfant.3.date_arrivee",   1, 343, 406, 7},
        {"enfant.3.situation",      1, 343, 387, 6},

        {"enfant.4.nom",            1, 456, 515, 7},
        {"enfant.4.lien_parente",   1, 456, 496, 7},
        {"enfant.4.date_naissance", 1, 456, 484, 7},
        {"enfant.4.lieu_naissance", 1, 456, 472, 7},
        {"enfant.4.nationalite",    1, 456, 453, 7},
        {"enfant.4.nir",            1, 456, 430, 7},
        {"enfant.4.date_arrivee",   1, 456, 406, 7},
        {"enfant.4.situation",      1, 456, 387, 6},

        {"pro.demandeur.sans_activite.since",              2, 285, 723},
        {"pro.demandeur.salarie.since",                    2, 285, 693},
        {"pro.demandeur.apprenti.since",                   2, 285, 623},
        {"pro.demandeur.travailleur_saisonnier.since",     2, 285, 608},
        {"pro.demandeur.stagiaire.since",                  2, 285, 593},
        {"pro.demandeur.independant.since",                2, 285, 443},
        {"pro.demandeur.gerant_salarie.since",             2, 292, 357},
        {"pro.demandeur.gerant_salarie.affiliation",       2, 230, 341},
        {"pro.demandeur.demandeur_emploi.since",           2, 285, 312},
        {"pro.demandeur.demandeur_emploi.indemnise_since", 2, 285, 282},
        {"pro.demandeur.etudiant.since",                   2, 285, 267},
        {"pro.demandeur.retraite.since",                   2, 285, 252},
        {"pro.conjoint.sans_activite.since",               2, 453, 723},
        {"pro.conjoint.salarie.since",                     2, 453, 693},
        {"pro.conjoint.apprenti.since",                    2, 453, 623},
        {"pro.conjoint.travailleur_saisonnier.since",      2, 453, 608},
        {"pro.conjoint.stagiaire.since",                   2, 453, 593},
        {"pro.conjoint.independant.since",                 2, 453, 443},
        {"pro.conjoint.gerant_salarie.since",              2, 460, 357},
        {"pro.conjoint.gerant_salarie.affiliation",        2, 398, 341},
        {"pro.conjoint.demandeur_emploi.since",            2, 453, 312},
        {"pro.conjoint.demandeur_emploi.indemnise_since",  2, 453, 282},
        {"pro.conjoint.etudiant.since",                    2, 453, 267},
        {"pro.conjoint.retraite.since",                    2, 453, 252},

        {"ressources.demandeur.1.revenusSalarie",          3, 229, 614},
        {"ressources.demandeur.1.revenusStage",            3, 229, 589},
        {"ressources.demandeur.1.revenusNonSalarie",       3, 229, 502},
        {"ressources.demandeur.1.pensionsAlimentaires",    3, 229, 489},
        {"ressources.demandeur.1.pensionsRetraitesRentes", 3, 229, 448},
        {"ressources.demandeur.1.allocationsChomage",      3, 229, 435},
        {"ressources.demandeur.1.indChomagePartiel",       3, 229, 412},
        {"ressources.demandeur.1.indJourMaternite",        3, 229, 376},
        {"ressources.demandeur.2.revenusSalarie",          3, 285, 614},
        {"ressources.demandeur.2.revenusStage",            3, 285, 589},
        {"ressources.demandeur.2.revenusNonSalarie",       3, 285, 502},
        {"ressources.demandeur.2.pensionsAlimentaires",    3, 285, 489},
        {"ressources.demandeur.2.pensionsRetraitesRentes", 3, 285, 448},
        {"ressources.demandeur.2.allocationsChomage",      3, 285, 435},
        {"ressources.demandeur.2.indChomagePartiel",       3, 285, 412},
        {"ressources.demandeur.2.indJourMaternite",        3, 285, 376},
        {"ressources.demandeur.3.revenusSalarie",          3, 342, 614},
        {"ressources.demandeur.3.revenusStage",            3, 342, 589},
        {"ressources.demandeur.3.revenusNonSalarie",       3, 342, 502},
        {"ressources.demandeur.3.pensionsAlimentaires",    3, 342, 489},
        {"ressources.demandeur.3.pensionsRetraitesRentes", 3, 342, 448},
        {"ressources.demandeur.3.allocationsChomage",      3, 342, 435},
        {"ressources.demandeur.3.indChomagePartiel",       3, 342, 412},
        {"ressources.demandeur.3.indJourMaternite",        3, 342, 376},
        {"ressources.conjoint.1.revenusSalarie",           3, 399, 614},
        {"ressources.conjoint.1.revenusStage",             3, 399, 589},
        {"ressources.conjoint.1.revenusNonSalarie",        3, 399, 502},
        {"ressources.conjoint.1.pensionsAlimentaires",     3, 399, 489},
        {"ressources.conjoint.1.pensionsRetraitesRentes",  3, 399, 448},
        {"ressources.conjoint.1.allocationsChomage",       3, 399, 435},
        {"ressources.conjoint.1.indChomagePartiel",        3, 399, 412},
        {"ressources.conjoint.1.indJourMaternite",         3, 399, 376},
        {"ressources.conjoint.2.revenusSalarie",           3, 455, 614},
        {"ressources.conjoint.2.revenusStage",             3, 455, 589},
        {"ressources.conjoint.2.revenusNonSalarie",        3, 455, 502},
        {"ressources.conjoint.2.pensionsAlimentaires",     3, 455, 489},
        {"ressources.conjoint.2.pensionsRetraitesRentes",  3, 455, 448},
        {"ressources.conjoint.2.allocationsChomage",       3, 455, 435},
        {"ressources.conjoint.2.indChomagePartiel",        3, 455, 412},
        {"ressources.conjoint.2.indJourMaternite",         3, 455, 376},
        {"ressources.conjoint.3.revenusSalarie",           3, 512, 614},
        {"ressources.conjoint.3.revenusStage",             3, 512, 589},
        {"ressources.conjoint.3.revenusNonSalarie",        3, 512, 502},
        {"ressources.conjoint.3.pensionsAlimentaires",     3, 512, 489},
        {"ressources.conjoint.3.pensionsRetraitesRentes",  3, 512, 448},
        {"ressources.conjoint.3.allocationsChomage",       3, 512, 435},
        {"ressources.conjoint.3.indChomagePartiel",        3, 512, 412},
        {"ressources.conjoint.3.indJourMaternite",         3, 512, 376},
        {"ressources.enfant.1.1.revenusSalarie",           4, 229, 717},
        {"ressources.enfant.1.1.revenusStage",             4, 229, 693},
        {"ressources.enfant.1.1.revenusNonSalarie",        4, 229, 613},
        {"ressources.enfant.1.1.pensionsAlimentaires",     4, 229, 601},
        {"ressources.enfant.1.1.pensionsRetraitesRentes",  4, 229, 553},
        {"ressources.enfant.1.1.allocationsChomage",       4, 229, 541},
        {"ressources.enfant.1.1.indChomagePartiel",        4, 229, 518},
        {"ressources.enfant.1.1.indJourMaternite",         4, 229, 482},
        {"ressources.enfant.1.2.revenusSalarie",           4, 285, 717},
        {"ressources.enfant.1.2.revenusStage",             4, 285, 693},
        {"ressources.enfant.1.2.revenusNonSalarie",        4, 285, 613},
        {"ressources.enfant.1.2.pensionsAlimentaires",     4, 285, 601},
        {"ressources.enfant.1.2.pensionsRetraitesRentes",  4, 285, 553},
        {"ressources.enfant.1.2.allocationsChomage",       4, 285, 541},
        {"ressources.enfant.1.2.indChomagePartiel",        4, 285, 518},
        {"ressources.enfant.1.2.indJourMaternite",         4, 285, 482},
        {"ressources.enfant.1.3.revenusSalarie",           4, 342, 717},
        {"ressources.enfant.1.3.revenusStage",             4, 342, 693},
        {"ressources.enfant.1.3.revenusNonSalarie",        4, 342, 613},
        {"ressources.enfant.1.3.pensionsAlimentaires",     4, 342, 601},
        {"ressources.enfant.1.3.pensionsRetraitesRentes",  4, 342, 553},
        {"ressources.enfant.1.3.allocationsChomage",       4, 342, 541},
        {"ressources.enfant.1.3.indChomagePartiel",        4, 342, 518},
        {"ressources.enfant.1.3.indJourMaternite",         4, 342, 482},
        {"ressources.enfant.2.1.revenusSalarie",           4, 399, 717},
        {"ressources.enfant.2.1.revenusStage",             4, 399, 693},
        {"ressources.enfant.2.1.revenusNonSalarie",        4, 399, 613},
        {"ressources.enfant.2.1.pensionsAlimentaires",     4, 399, 601},
        {"ressources.enfant.2.1.pensionsRetraitesRentes",  4, 399, 553},
        {"ressources.enfant.2.1.allocationsChomage",       4, 399, 541},
        {"ressources.enfant.2.1.indChomagePartiel",        4, 399, 518},
        {"ressources.enfant.2.1.indJourMaternite",         4, 399, 482},
        {"ressources.enfant.2.2.revenusSalarie",           4, 455, 717},
        {"ressources.enfant.2.2.revenusStage",             4, 455, 693},
        {"ressources.enfant.2.2.revenusNonSalarie",        4, 455, 613},
        {"ressources.enfant.2.2.pensionsAlimentaires",     4, 455, 601},
        {"ressources.enfant.2.2.pensionsRetraitesRentes",  4, 455, 553},
        {"ressources.enfant.2.2.allocationsChomage",       4, 455, 541},
        {"ressources.enfant.2.2.indChomagePartiel",        4, 455, 518},
        {"ressources.enfant.2.2.indJourMaternite",         4, 455, 482},
        {"ressources.enfant.2.3.revenusSalarie",           4, 512, 717},
        {"ressources.enfant.2.3.revenusStage",             4, 512, 693},
        {"ressources.enfant.2.3.revenusNonSalarie",        4, 512, 613},
        {"ressources.enfant.2.3.pensionsAlimentaires",     4, 512, 601},
        {"ressources.enfant.2.3.pensionsRetraitesRentes",  4, 512, 553},
        {"ressources.enfant.2.3.allocationsChomage",       4, 512, 541},
        {"ressources.enfant.2.3.indChomagePartiel",        4, 512, 518},
        {"ressources.enfant.2.3.indJourMaternite",         4, 512, 482},

        {"ressources.demandeur.argent_place", 3, 285, 247},

        {"current_date", 4, 150, 200},
    };

    private static final Object[][] numberFields = {
        {"demandeur.date_naissance",        0, 114, 635,  8, 15.7f},
        {"demandeur.departement_naissance", 0, 262, 608,  2},
        {"demandeur.nir",                   0,  34, 507, 13, 14.8f},
        {"demandeur.nir2",                  0,  229, 507,  2, 14.8f},
        {"conjoint.date_naissance",         0, 390, 635,  8, 15.7f},
        {"conjoint.departement_naissance",  0, 538, 608,  2},
        {"conjoint.nir",                    0, 310, 507, 13, 14.8f},
        {"conjoint.nir2",                   0, 506, 507,  2, 14.8f},

        {"adresse.code_postal",          0,  90, 352, 5, 14.9f},
        {"adresse.date_arrivee",         0, 185, 293, 8},
        {"adresse.conjoint.code_postal", 0,  90, 209, 5, 14.9f},

        {"tel.fixe",   0,  93, 338, 10, 14.9f},
        {"tel.mobile", 0, 377, 338, 10, 14.9f},

        {"statut_marital.date.mariage",           1, 172, 732, 8},
        {"statut_marital.date.pacs",              1, 172, 717, 8},
        {"statut_marital.date.relation_libre",    1, 334, 702, 8},
        {"statut_marital.date.separe",            1, 216, 657, 8},
        {"statut_marital.date.pacs_rompu",        1, 230, 642, 8},
        {"statut_marital.date.divorce",           1, 187, 627, 8},
        {"statut_marital.date.veuf",              1, 180, 612, 8},
        {"statut_marital.date.concubinage_rompu", 1, 278, 597, 8},
    };

    private static final EnumMap<IndividuRole, EnumMap<Civilite, String>> civiliteCheckboxes = new EnumMap<>(IndividuRole.class);
    private static final EnumMap<IndividuRole, EnumMap<Nationalite, String>> nationaliteCheckboxes = new EnumMap<>(IndividuRole.class);
    private static final EnumMap<LogementType, String> logementTypeCheckboxes = new EnumMap<>(LogementType.class);
    private static final EnumMap<IndividuRole, EnumMap<SituationProType, String>> situationsProCheckboxes = new EnumMap<>(IndividuRole.class);
    private static final EnumMap<IndividuRole, EnumMap<SalarieContractType, String>> salarieContractCheckboxes = new EnumMap<>(IndividuRole.class);

    private SituationService situationService;
    private int currentEnfant = 1;
    private int currentEnfantWithRessources = 1;

    public RSAFormFiller() {
        initCiviliteCheckboxes();
        initNationaliteCheckboxes();
        initLogementTypeCheckboxes();
        initSituationsProCheckboxes();
        initSalarieContractCheckboxes();
        situationService = new SituationService();
    }

    private void initCiviliteCheckboxes() {
        EnumMap<Civilite, String> demandeurCheckboxes = new EnumMap<>(Civilite.class);
        demandeurCheckboxes.put(Civilite.HOMME, "demandeur.homme");
        demandeurCheckboxes.put(Civilite.FEMME, "demandeur.femme");
        civiliteCheckboxes.put(IndividuRole.DEMANDEUR, demandeurCheckboxes);

        EnumMap<Civilite, String> conjointCheckboxes = new EnumMap<>(Civilite.class);
        conjointCheckboxes.put(Civilite.HOMME, "conjoint.homme");
        conjointCheckboxes.put(Civilite.FEMME, "conjoint.femme");
        civiliteCheckboxes.put(IndividuRole.CONJOINT, conjointCheckboxes);
    }

    private void initNationaliteCheckboxes() {
        EnumMap<Nationalite, String> demandeurCheckboxes = new EnumMap<>(Nationalite.class);
        demandeurCheckboxes.put(Nationalite.FRANCAISE, "demandeur.francais");
        demandeurCheckboxes.put(Nationalite.EEE_UE_SUISSE, "demandeur.ue");
        demandeurCheckboxes.put(Nationalite.AUTRE, "demandeur.non_ue");
        nationaliteCheckboxes.put(IndividuRole.DEMANDEUR, demandeurCheckboxes);

        EnumMap<Nationalite, String> conjointCheckboxes = new EnumMap<>(Nationalite.class);
        conjointCheckboxes.put(Nationalite.FRANCAISE, "conjoint.francais");
        conjointCheckboxes.put(Nationalite.EEE_UE_SUISSE, "conjoint.ue");
        conjointCheckboxes.put(Nationalite.AUTRE, "conjoint.non_ue");
        nationaliteCheckboxes.put(IndividuRole.CONJOINT, conjointCheckboxes);
    }

    private void initLogementTypeCheckboxes() {
        logementTypeCheckboxes.put(LogementType.LOCATAIRE, "logement.locataire");
        logementTypeCheckboxes.put(LogementType.PAYANT, "logement.payant");
        logementTypeCheckboxes.put(LogementType.GRATUIT, "logement.gratuit");
    }

    private void initSituationsProCheckboxes() {
        EnumMap<SituationProType, String> demandeurCheckboxes = new EnumMap<>(SituationProType.class);
        situationsProCheckboxes.put(IndividuRole.DEMANDEUR, demandeurCheckboxes);
        demandeurCheckboxes.put(SituationProType.SALARIE, "pro.demandeur.salarie");
        demandeurCheckboxes.put(SituationProType.SANS_ACTIVITE, "pro.demandeur.sans_activite");
        demandeurCheckboxes.put(SituationProType.INDEPENDANT, "pro.demandeur.independant");
        demandeurCheckboxes.put(SituationProType.TRAVAILLEUR_SAISONNIER, "pro.demandeur.travailleur_saisonnier");
        demandeurCheckboxes.put(SituationProType.APPRENTI, "pro.demandeur.apprenti");
        demandeurCheckboxes.put(SituationProType.STAGIAIRE, "pro.demandeur.stagiaire");
        demandeurCheckboxes.put(SituationProType.GERANT_SALARIE, "pro.demandeur.gerant_salarie");
        demandeurCheckboxes.put(SituationProType.DEMANDEUR_EMPLOI, "pro.demandeur.demandeur_emploi");
        demandeurCheckboxes.put(SituationProType.ETUDIANT, "pro.demandeur.etudiant");
        demandeurCheckboxes.put(SituationProType.RETRAITE, "pro.demandeur.retraite");

        EnumMap<SituationProType, String> conjointCheckboxes = new EnumMap<>(SituationProType.class);
        situationsProCheckboxes.put(IndividuRole.CONJOINT, conjointCheckboxes);
        conjointCheckboxes.put(SituationProType.SALARIE, "pro.conjoint.salarie");
        conjointCheckboxes.put(SituationProType.SANS_ACTIVITE, "pro.conjoint.sans_activite");
        conjointCheckboxes.put(SituationProType.INDEPENDANT, "pro.conjoint.independant");
        conjointCheckboxes.put(SituationProType.TRAVAILLEUR_SAISONNIER, "pro.conjoint.travailleur_saisonnier");
        conjointCheckboxes.put(SituationProType.APPRENTI, "pro.conjoint.apprenti");
        conjointCheckboxes.put(SituationProType.STAGIAIRE, "pro.conjoint.stagiaire");
        conjointCheckboxes.put(SituationProType.GERANT_SALARIE, "pro.conjoint.gerant_salarie");
        conjointCheckboxes.put(SituationProType.DEMANDEUR_EMPLOI, "pro.conjoint.demandeur_emploi");
        conjointCheckboxes.put(SituationProType.ETUDIANT, "pro.conjoint.etudiant");
        conjointCheckboxes.put(SituationProType.RETRAITE, "pro.conjoint.retraite");
    }

    private void initSalarieContractCheckboxes() {
        EnumMap<SalarieContractType, String> demandeurCheckboxes = new EnumMap<>(SalarieContractType.class);
        salarieContractCheckboxes.put(IndividuRole.DEMANDEUR, demandeurCheckboxes);
        demandeurCheckboxes.put(SalarieContractType.CDI, "pro.demandeur.salarie.contrat.cdi");
        demandeurCheckboxes.put(SalarieContractType.CDD, "pro.demandeur.salarie.contrat.cdd");
        demandeurCheckboxes.put(SalarieContractType.INTERIM, "pro.demandeur.salarie.contrat.interim");

        EnumMap<SalarieContractType, String> conjointCheckboxes = new EnumMap<>(SalarieContractType.class);
        salarieContractCheckboxes.put(IndividuRole.CONJOINT, conjointCheckboxes);
        conjointCheckboxes.put(SalarieContractType.CDI, "pro.conjoint.salarie.contrat.cdi");
        conjointCheckboxes.put(SalarieContractType.CDD, "pro.conjoint.salarie.contrat.cdd");
        conjointCheckboxes.put(SalarieContractType.INTERIM, "pro.conjoint.salarie.contrat.interim");
    }

    @Override
    public Object[][] getCheckboxes() {
        return checkboxes;
    }

    @Override
    public Object[][] getTextFields() {
        return textFields;
    }

    @Override
    public Object[][] getNumberFields() {
        return numberFields;
    }

    @Override
    public void fill() {
        for (Individu individu : situation.individus) {
            if (IndividuRole.DEMANDEUR == individu.role) {
                fillDemandeur(individu);
            } else if (IndividuRole.CONJOINT == individu.role) {
                fillConjoint(individu);
            } else if (IndividuRole.ENFANT == individu.role) {
                fillEnfant(individu);
            }
        }

        fillLogement();
        fillContact();
        fillCurrentDate();
    }

    private void fillDemandeur(Individu demandeur) {
        fillParent(demandeur);

        if (null != demandeur.statutMarital) {
            if (demandeur.statutMarital.isAlone) {
                checkbox("seul");
            } else {
                checkbox("en_couple");
            }

            String statutMaritalCheckbox = String.format("statut_marital.%s", demandeur.statutMarital.jsonValue);
            checkbox(statutMaritalCheckbox);

            if (null != demandeur.dateSituationFamiliale) {
                String statutMaritalDateField = String.format("statut_marital.date.%s", demandeur.statutMarital.jsonValue);
                appendNumber(statutMaritalDateField, demandeur.dateSituationFamiliale.replaceAll("/", ""));
            }
        }

        if (demandeur.enceinte) {
            checkbox("enceinte.oui");
        } else {
            checkbox("enceinte.non");
        }

        fillPensionAlimentaire(demandeur);

        if (null != situation.mobilierValue && 0 != situation.mobilierValue) {
            appendText("ressources.demandeur.argent_place", String.valueOf(situation.mobilierValue));
        }
    }

    private void fillParent(Individu individu) {
        String civiliteCheckbox = civiliteCheckboxes.get(individu.role).get(individu.civilite);
        checkbox(civiliteCheckbox);

        String fieldPrefix = getFieldPrefix(individu.role);
        appendText(String.format("%s.nom", fieldPrefix), individu.lastName);
        appendText(String.format("%s.nom_usage", fieldPrefix), individu.nomUsage);
        appendText(String.format("%s.prenom", fieldPrefix), individu.firstName);
        appendNumber(String.format("%s.date_naissance", fieldPrefix), individu.dateDeNaissance.replaceAll("/", ""));

        if (null != individu.paysNaissance) {
            appendText(String.format("%s.pays_naissance", fieldPrefix), individu.paysNaissance);
            if ("france".equals(individu.paysNaissance.toLowerCase())) {
                appendText(String.format("%s.ville_naissance", fieldPrefix), individu.villeNaissance);
                if (null != individu.departementNaissance) {
                    appendNumber(String.format("%s.departement_naissance", fieldPrefix), individu.departementNaissance);
                }
            }
        }

        String checkboxNationalite = nationaliteCheckboxes.get(individu.role).get(individu.nationalite);
        checkbox(checkboxNationalite);

        if (null != individu.nir) {
            appendNumber(String.format("%s.nir", fieldPrefix), individu.nir.substring(0, 13));
            appendNumber(String.format("%s.nir2", fieldPrefix), individu.nir.substring(13, 15));
        }

        if (null != individu.inscritCaf) {
            if (individu.inscritCaf) {
                checkbox(String.format("%s.inscrit_caf.oui", fieldPrefix));
                appendText(String.format("%s.num_allocataire", fieldPrefix), individu.numeroAllocataire);
            } else {
                checkbox(String.format("%s.inscrit_caf.non", fieldPrefix));
            }
        }

        fillSituationsPro(individu);
        fillRessources(individu);
    }

    private String getFieldPrefix(IndividuRole role, int enfantIndex) {
        String fieldPrefix;
        switch (role) {
        case DEMANDEUR:
            fieldPrefix = "demandeur";
            break;
        case CONJOINT:
            fieldPrefix = "conjoint";
            break;
        case ENFANT:
        case PERSONNE_A_CHARGE:
            fieldPrefix = "enfant." + enfantIndex;
            break;
        default:
            throw new RuntimeException();
        }

        return fieldPrefix;
    }

    private String getFieldPrefix(IndividuRole role) {
        return getFieldPrefix(role, 0);
    }

    private void fillSituationsPro(Individu individu) {
        boolean isDemandeurEmploi = false;
        String fieldPrefix = getFieldPrefix(individu.role);

        for (SituationPro situationPro : individu.situationsPro) {
            String situationProCheckbox = situationsProCheckboxes.get(individu.role).get(situationPro.situation);
            checkbox(situationProCheckbox);
            if (null != situationProCheckbox) {
                appendText(situationProCheckbox + ".since", situationPro.since);
            }

            switch (situationPro.situation) {
            case STAGIAIRE:
                if (null != situationPro.isRemunere) {
                    String checkboxRemunere = String.format("pro.%s.stagiaire.remunere.%s", fieldPrefix, (situationPro.isRemunere ? "oui" : "non"));
                    checkbox(checkboxRemunere);
                }
                break;
            case SALARIE:
                String checkboxContrat = salarieContractCheckboxes.get(individu.role).get(situationPro.contractType);
                checkbox(checkboxContrat);
                break;
            case GERANT_SALARIE:
                appendText(String.format("pro.%s.gerant_salarie.affiliation", fieldPrefix), situationPro.gerantSalarieAffiliation);
                break;
            case DEMANDEUR_EMPLOI:
                isDemandeurEmploi = true;
                if (null != situationPro.isIndemnise) {
                    String checkboxIndemnise = String.format("pro.%s.demandeur_emploi.indemnise.%s", fieldPrefix, (situationPro.isIndemnise ? "oui" : "non"));
                    checkbox(checkboxIndemnise);
                    if (situationPro.isIndemnise) {
                        appendText(String.format("pro.%s.demandeur_emploi.indemnise_since", fieldPrefix), situationPro.indemniseSince);
                    }
                }
            case SANS_ACTIVITE:
                if (null != situationPro.volontairementSansActivite) {
                    String checkboxSansActivite = String.format("pro.%s.sans_activite.volontairement.%s", fieldPrefix, (situationPro.volontairementSansActivite ? "oui" : "non"));
                    checkbox(checkboxSansActivite);
                }
            default:
                break;
            }
        }

        if (!isDemandeurEmploi) {
            checkbox(String.format("pro.%s.demandeur_emploi.non", fieldPrefix));
        }
    }

    private void fillRessources(Individu individu) {
        String fieldPrefix = getFieldPrefix(individu.role, currentEnfantWithRessources);

        if (IndividuRole.ENFANT == individu.role) {
            int ressources = situationService.sumAllRessources(individu);
            if (0 == ressources || currentEnfantWithRessources > 2) {
                return;
            }
        }

        int periodeId = 1;
        for (RessourcePeriode periode : RessourcePeriode.values()) {
            if (-1 != periode.minusCurrentMonth) {
                int sum = situationService.sumAllRessources(individu, periode);
                if (0 == sum) {
                    checkbox(String.format("ressources.%s.%d.aucune", fieldPrefix, periodeId));
                } else {
                    for (RessourceType ressourceType : RessourceType.values()) {
                        sum = situationService.sumRessourcesOfType(individu, periode, ressourceType);
                        if (0 != sum) {
                            String textField = String.format("ressources.%s.%d.%s", fieldPrefix, periodeId, ressourceType.jsonValue);
                            appendText(textField, String.valueOf(sum));
                        }
                    }
                }
                periodeId++;
            }
        }

        if (IndividuRole.ENFANT == individu.role) {
            currentEnfantWithRessources++;
        }
    }

    private void fillConjoint(Individu conjoint) {
        fillParent(conjoint);
    }

    private void fillEnfant(Individu individu) {
        if (currentEnfant > 4) {
            return;
        }

        String nomPrenom = null;
        if (null != individu.lastName) {
            nomPrenom = individu.lastName;
            if (null != individu.firstName) {
                nomPrenom += " " + individu.firstName;
            }
        }
        appendText(String.format("enfant.%d.nom", currentEnfant), nomPrenom);

        if (null != individu.lienParente) {
            appendText(String.format("enfant.%d.lien_parente", currentEnfant), individu.lienParente.textValue);
        }

        appendText(String.format("enfant.%d.date_naissance", currentEnfant), individu.dateDeNaissance);
        if (null != individu.paysNaissance) {
            if ("france".equals(individu.paysNaissance.toLowerCase())) {
                if (null != individu.villeNaissance) {
                    String lieuNaissance = individu.villeNaissance;
                    if (null != individu.departementNaissance) {
                        lieuNaissance = String.format("%s (%s)", individu.villeNaissance, individu.departementNaissance);
                    }
                    appendText(String.format("enfant.%d.lieu_naissance", currentEnfant), lieuNaissance);
                }
            } else {
                appendText(String.format("enfant.%d.lieu_naissance", currentEnfant), individu.paysNaissance);
            }
        }

        if (Nationalite.FRANCAISE == individu.nationalite) {
            appendText(String.format("enfant.%d.nationalite", currentEnfant), "Française");
        }

        appendText(String.format("enfant.%d.nir", currentEnfant), individu.nir);
        appendText(String.format("enfant.%d.date_arrivee", currentEnfant), individu.dateArriveeFoyer);
        if (null != individu.situation) {
            appendText(String.format("enfant.%d.situation", currentEnfant), individu.situation.textValue);
        }

        fillRessources(individu);
        currentEnfant++;
    }

    private void fillLogement() {
        fillAdresse(situation.logement.adresse, "adresse");
        if (false == situation.logement.conjointMemeAdresse && null != situation.logement.adresseConjoint) {
            fillAdresse(situation.logement.adresseConjoint, "adresse.conjoint");
            appendText("adresse.conjoint.pays", situation.logement.adresseConjoint.pays);
        }

        String logementTypeCheckbox = logementTypeCheckboxes.get(situation.logement.type);
        checkbox(logementTypeCheckbox);

        if (LogementType.PROPRIETAIRE == situation.logement.type) {
            if (null == situation.logement.loyer || Integer.valueOf(0).equals(situation.logement.loyer)) {
                checkbox("logement.proprio_sans_pret");
            } else {
                checkbox("logement.proprio_avec_pret");
            }
        }

        if (null != situation.logement.dateArrivee) {
            appendNumber("adresse.date_arrivee", situation.logement.dateArrivee.replaceAll("/", ""));
        }
    }

    private void fillAdresse(Adresse adresse, String fieldPrefix) {
        if (null != adresse.adresse) {
            String[] addressTokens = adresse.adresse.split(" ");
            if (addressTokens.length > 1) {
                String number = addressTokens[0];
                if (StringUtils.isNumeric(String.valueOf(number.charAt(0)))) {
                    appendText(String.format("%s.numero", fieldPrefix), number);
                    addressTokens = ArrayUtils.remove(addressTokens, 0);
                }
                String address = StringUtils.join(addressTokens, " ");
                appendText(String.format("%s.rue", fieldPrefix), address);
            }
        }

        appendNumber(String.format("%s.code_postal", fieldPrefix), adresse.codePostal);
        appendText(String.format("%s.ville", fieldPrefix), adresse.ville);
    }

    private void fillContact() {
        if (null != situation.phoneNumber) {
            if (StringUtils.startsWithAny(situation.phoneNumber, "06", "+336", "07", "+337")) {
                appendNumber("tel.mobile", situation.phoneNumber);
            } else {
                appendNumber("tel.fixe", situation.phoneNumber);
            }
        }

        if (null != situation.email) {
            String[] parts =  situation.email.split("@");
            if (parts.length > 1) {
                appendText("adresse.mail.gauche", parts[0]);
                appendText("adresse.mail.droite", parts[1]);
            } else {
                appendText("adresse.mail.gauche", situation.email);
            }
        }
    }

    private void fillPensionAlimentaire(Individu demandeur) {
        if (StatutMarital.SEPARE == demandeur.statutMarital) {
            checkbox("pension_alimentaire.separe");
        }

        if (null != demandeur.statutMarital && demandeur.statutMarital.isAlone && childrenNb() > 0) {
            checkbox("pension_alimentaire.has_child_alone");
        }
    }

    private int childrenNb() {
        int nb = 0;
        for (Individu individu : situation.individus) {
            if (IndividuRole.ENFANT == individu.role) {
                nb++;
            }
        }

        return nb;
    }

    private void fillCurrentDate() {
        String currentDate = LocalDate.now().toString("dd/MM/yyyy");
        appendText("current_date", currentDate);
    }
}
