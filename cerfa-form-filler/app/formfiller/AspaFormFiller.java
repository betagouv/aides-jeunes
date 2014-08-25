package formfiller;

import java.util.EnumMap;
import java.util.Locale;

import models.Individu;
import models.Individu.Civilite;
import models.Individu.IndividuRole;
import models.Individu.Nationalite;
import models.Individu.StatutMarital;
import models.Logement;

import org.apache.commons.lang3.ArrayUtils;
import org.joda.time.LocalDate;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;

public class AspaFormFiller extends FormFiller {

    private static final EnumMap<Civilite, String> civiliteCheckboxes = new EnumMap<>(Civilite.class);
    private static final EnumMap<StatutMarital, String> statutMaritalCheckboxes = new EnumMap<>(StatutMarital.class);
    private static final StatutMarital[] statutMaritalSepare = new StatutMarital[]{StatutMarital.DIVORCE, StatutMarital.SEPARE, StatutMarital.VEUF};
    private static DateTimeFormatter monthFormatter;

    private static final Object[][] checkboxes = {
        {"demandeur.femme", 4,  67, 732},
        {"demandeur.homme", 4, 286, 732},

        {"statut_marital.celibataire",    4,  76, 475},
        {"statut_marital.mariage",        4, 144, 475},
        {"statut_marital.divorce",        4, 315, 475},
        {"statut_marital.separe",         4, 371, 475},
        {"statut_marital.veuf",           4, 421, 475},
        {"statut_marital.relation_libre", 4, 228, 435},
        {"statut_marital.pacs",           4, 388, 435},
    };

    private static final Object[][] textFields = {
        {"demandeur.nom",                   4, 140, 715},
        {"demandeur.nom_usage",             4, 225, 681},
        {"demandeur.prenom",                4, 225, 655},
        {"demandeur.nationalite",           4, 390, 635},
        {"demandeur.ville_naissance",       4, 140, 615},
        {"demandeur.departement_naissance", 4, 375, 615},
        {"demandeur.pays_naissance",        4, 465, 615},

        {"demandeur.adresse", 4, 100, 565},
        {"demandeur.ville",   4, 210, 545},
        {"demandeur.pays",    4, 470, 545},

        {"conjoint.nom",                   4, 140, 367},
        {"conjoint.nom_usage",             4, 400, 367},
        {"conjoint.prenom",                4, 220, 347},
        {"conjoint.nationalite",           4, 380, 327},
        {"conjoint.ville_naissance",       4, 140, 307},
        {"conjoint.departement_naissance", 4, 375, 307},
        {"conjoint.pays_naissance",        4, 465, 307},

        {"mois_label.1.1", 5, 320, 675},
        {"mois_label.1.2", 5, 405, 675},
        {"mois_label.1.3", 5, 490, 675},
        {"mois_label.2.1", 6, 320, 675},
        {"mois_label.2.2", 6, 405, 675},
        {"mois_label.2.3", 6, 490, 675},
    };

    private static final Object[][] numberFields = {
        {"demandeur.date_naissance", 4, 140, 634,  8},
        {"demandeur.telephone",      4, 320, 583, 10},
        {"demandeur.code_postal",    4,  91, 543,  5},
        {"demandeur.nir",            4, 155, 523, 13},
        {"demandeur.nir2",           4, 324, 523,  2},

        {"date_situation_familiale.mariage",        4, 159, 457, 8},
        {"date_situation_familiale.separe",         4, 322, 457, 8},
        {"date_situation_familiale.relation_libre", 4, 161, 417, 8},
        {"date_situation_familiale.pacs",           4, 324, 417, 8},

        {"conjoint.date_naissance", 4, 129, 325,  8},
        {"conjoint.nir",            4, 150, 275, 13},
        {"conjoint.nir2",           4, 318, 275,  2},

        {"current_date", 7, 199, 141, 8},
    };

    public AspaFormFiller() {
        initCiviliteCheckboxesCoordinates();
        initStatutMaritalCheckboxesCoordinates();
        monthFormatter = DateTimeFormat.forPattern("MMMM yyyy").withLocale(Locale.FRANCE);
    }

    private static void initCiviliteCheckboxesCoordinates() {
        civiliteCheckboxes.put(Civilite.FEMME, "demandeur.femme");
        civiliteCheckboxes.put(Civilite.HOMME, "demandeur.homme");
    }

    private static void initStatutMaritalCheckboxesCoordinates() {
        statutMaritalCheckboxes.put(StatutMarital.MARIAGE, "statut_marital.mariage");
        statutMaritalCheckboxes.put(StatutMarital.PACS, "statut_marital.pacs");
        statutMaritalCheckboxes.put(StatutMarital.RELATION_LIBRE, "statut_marital.relation_libre");
        statutMaritalCheckboxes.put(StatutMarital.DIVORCE, "statut_marital.divorce");
        statutMaritalCheckboxes.put(StatutMarital.SEPARE, "statut_marital.separe");
        statutMaritalCheckboxes.put(StatutMarital.VEUF, "statut_marital.veuf");
        statutMaritalCheckboxes.put(StatutMarital.CELIBATAIRE, "statut_marital.celibataire");
        statutMaritalCheckboxes.put(StatutMarital.CONCUBINAGE_ROMPU, "statut_marital.celibataire");
        statutMaritalCheckboxes.put(StatutMarital.PACS_ROMPU, "statut_marital.celibataire");
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
    protected float getDefaultNumberSpacing() {
        return 12.1f;
    }

    @Override
    public void fill() {
        for (Individu individu : situation.individus) {
            if (IndividuRole.DEMANDEUR == individu.role) {
                fillDemandeur(individu);
            } else if (IndividuRole.CONJOINT == individu.role) {
                fillConjoint(individu);
            }
        }

        fillLogement(situation.logement);
        fillMonthsLabels();
        fillCurrentDate();
    }

    private void fillDemandeur(Individu demandeur) {
        String civiliteCheckbox = civiliteCheckboxes.get(demandeur.civilite);
        checkbox(civiliteCheckbox);
        appendText("demandeur.nom", demandeur.lastName);
        if (null != demandeur.nomUsage) {
            appendText("demandeur.nom_usage", "Nom d'usage ".concat(demandeur.nomUsage));
        }
        appendText("demandeur.prenom", demandeur.firstName);
        appendNumber("demandeur.date_naissance", demandeur.dateDeNaissance.replaceAll("/", ""));
        if (Nationalite.FRANCAISE == demandeur.nationalite) {
            appendText("demandeur.nationalite", "française");
        }
        appendNumber("demandeur.telephone", situation.phoneNumber);
        appendText("demandeur.ville_naissance", demandeur.villeNaissance);
        if (null != demandeur.departementNaissance) {
            appendText("demandeur.departement_naissance", demandeur.departementNaissance);
        }
        appendText("demandeur.pays_naissance", demandeur.paysNaissance);

        if (null != demandeur.nir) {
            appendNumber("demandeur.nir", demandeur.nir.substring(0, 13));
            appendNumber("demandeur.nir2", demandeur.nir.substring(13, 15));
        }

        String statutMaritalCheckbox = statutMaritalCheckboxes.get(demandeur.statutMarital);
        checkbox(statutMaritalCheckbox);

        String dateStatutMaritalField = null;

        if (StatutMarital.MARIAGE == demandeur.statutMarital) {
            dateStatutMaritalField = "mariage";
        } else if (ArrayUtils.contains(statutMaritalSepare, demandeur.statutMarital)) {
            dateStatutMaritalField = "separe";
        } else if (StatutMarital.RELATION_LIBRE == demandeur.statutMarital) {
            dateStatutMaritalField = "relation_libre";
        } else if (StatutMarital.PACS == demandeur.statutMarital) {
            dateStatutMaritalField = "pacs";
        }

        if (null != dateStatutMaritalField && null != demandeur.dateSituationFamiliale) {
            appendNumber(String.format("date_situation_familiale.%s", dateStatutMaritalField), demandeur.dateSituationFamiliale.replaceAll("/", ""));
        }
    }

    private void fillConjoint(Individu conjoint) {
        appendText("conjoint.nom", conjoint.lastName);
        appendText("conjoint.nom_usage", conjoint.nomUsage);
        appendText("conjoint.prenom", conjoint.firstName);
        appendNumber("conjoint.date_naissance", conjoint.dateDeNaissance.replaceAll("/", ""));
        if (Nationalite.FRANCAISE == conjoint.nationalite) {
            appendText("conjoint.nationalite", "française");
        }

        appendText("conjoint.ville_naissance", conjoint.villeNaissance);
        if (null != conjoint.departementNaissance) {
            appendText("conjoint.departement_naissance", String.valueOf(conjoint.departementNaissance));
        }
        appendText("conjoint.pays_naissance", conjoint.paysNaissance);

        if (null != conjoint.nir) {
            appendNumber("conjoint.nir", conjoint.nir.substring(0, 13));
            appendNumber("conjoint.nir2", conjoint.nir.substring(13, 15));
        }
    }

    private void fillLogement(Logement logement) {
        appendText("demandeur.adresse", logement.adresse.adresse);
        appendNumber("demandeur.code_postal", logement.adresse.codePostal);
        appendText("demandeur.ville", logement.adresse.ville);
        appendText("demandeur.pays", "France");
    }

    private void fillMonthsLabels() {
        LocalDate currentMonth = LocalDate.now().withDayOfMonth(1);
        for (int i = 1; i < 4; i++) {
            appendText(String.format("mois_label.1.%d", i), currentMonth.minusMonths(4 - i).toString(monthFormatter));
            appendText(String.format("mois_label.2.%d", i), currentMonth.minusMonths(4 - i).toString(monthFormatter));
        }
    }

    private void fillCurrentDate() {
        String currentDate = LocalDate.now().toString("ddMMyyyy");
        appendNumber("current_date", currentDate);
    }
}
