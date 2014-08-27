package formfiller;

import java.util.EnumMap;

import models.Individu;
import models.Individu.IndividuRole;
import models.Individu.Nationalite;
import models.Individu.StatutMarital;
import models.Logement;

import org.joda.time.LocalDate;

public class CmuFormFiller extends FormFiller {

    private static final Object[][] checkboxes = {
        {"demandeur.francais", 4, 150, 543},
        {"demandeur.ue",       4, 393, 543},
        {"demandeur.non_ue",   4, 444, 543},
        {"conjoint.francais",  4, 150, 341},
        {"conjoint.ue",        4, 393, 341},
        {"conjoint.non_ue",    4, 444, 341},

        {"statut_marital.celibataire",    4, 75, 268},
        {"statut_marital.mariage",        4, 150, 268},
        {"statut_marital.relation_libre", 4, 220, 268},
        {"statut_marital.pacs",           4, 275, 268},
        {"statut_marital.separe",         4, 356, 268},
        {"statut_marital.divorce",        4, 418, 268},
        {"statut_marital.veuf",           4, 518, 268},

        {"enfant.1.residence_alternee", 4, 330, 156},
        {"enfant.2.residence_alternee", 4, 330, 142},
        {"enfant.3.residence_alternee", 4, 330, 128},
        {"enfant.4.residence_alternee", 4, 330, 114},
        {"enfant.5.residence_alternee", 4, 330, 100},
        {"enfant.6.residence_alternee", 4, 330,  86},
    };

    private static final Object[][] textFields = {
        {"demandeur.nom",     4, 268, 602},
        {"demandeur.adresse", 4,  95, 530},
        {"demandeur.email",   4, 384, 530},
        {"demandeur.ville",   4, 220, 515},

        {"conjoint.nom", 4, 270, 413},

        {"enfant.1.nom",          4,  30, 156},
        {"enfant.1.nationalite",  4, 258, 156},
        {"enfant.1.lien_parente", 4, 278, 156},
        {"enfant.2.nom",          4,  30, 142},
        {"enfant.2.nationalite",  4, 258, 142},
        {"enfant.2.lien_parente", 4, 278, 142},
        {"enfant.3.nom",          4,  30, 128},
        {"enfant.3.nationalite",  4, 258, 128},
        {"enfant.3.lien_parente", 4, 278, 128},
        {"enfant.4.nom",          4,  30, 114},
        {"enfant.4.nationalite",  4, 258, 114},
        {"enfant.4.lien_parente", 4, 278, 114},
        {"enfant.5.nom",          4,  30, 100},
        {"enfant.5.nationalite",  4, 258, 100},
        {"enfant.5.lien_parente", 4, 278, 100},
        {"enfant.6.nom",          4,  30,  86},
        {"enfant.6.nationalite",  4, 258,  86},
        {"enfant.6.lien_parente", 4, 278,  86},
    };

    private static final Object[][] numberFields = {
        {"demandeur.nir",                4, 210, 588, 15},
        {"demandeur.numero_allocataire", 4, 247, 573, 7},
        {"demandeur.date_naissance",     4, 137, 559, 8, 14.9f},
        {"demandeur.code_postal",        4,  89, 516, 5},
        {"demandeur.telephone",          4, 432, 516, 10},

        {"conjoint.nir",                4, 183, 400, 15},
        {"conjoint.numero_allocataire", 4, 220, 385, 7},
        {"conjoint.date_naissance",     4, 127, 371, 8, 14.9f},

        {"statut_marital_date",          4, 77, 255, 8, 9f},

        {"enfant.1.date_naissance", 4, 363, 157, 8, 8.8f},
        {"enfant.1.nir",            4, 439, 157, 15, 8.5f},
        {"enfant.2.date_naissance", 4, 363, 143, 8, 8.8f},
        {"enfant.2.nir",            4, 439, 143, 15, 8.5f},
        {"enfant.3.date_naissance", 4, 363, 129, 8, 8.8f},
        {"enfant.3.nir",            4, 439, 129, 15, 8.5f},
        {"enfant.4.date_naissance", 4, 363, 115, 8, 8.8f},
        {"enfant.4.nir",            4, 439, 115, 15, 8.5f},
        {"enfant.5.date_naissance", 4, 363, 101, 8, 8.8f},
        {"enfant.5.nir",            4, 439, 101, 15, 8.5f},
        {"enfant.6.date_naissance", 4, 363,  87, 8, 8.8f},
        {"enfant.6.nir",            4, 439,  87, 15, 8.5f},

        {"current_date", 7, 42, 71, 8, 15.5f},
    };

    private static final EnumMap<IndividuRole, EnumMap<Nationalite, String>> nationaliteCheckboxes = new EnumMap<>(IndividuRole.class);
    private static final EnumMap<StatutMarital, String> statutMaritalCheckboxes = new EnumMap<>(StatutMarital.class);
    private static final EnumMap<Nationalite, String> nationalitesEnfants = new EnumMap<>(Nationalite.class);

    private int currentChildIndex = 1;

    public CmuFormFiller() {
        initNationaliteCheckboxes();
        initStatutMaritalCheckboxes();
        initNationalitesEnfants();
    }

    private static void initNationaliteCheckboxes() {
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

    private static void initStatutMaritalCheckboxes() {
        statutMaritalCheckboxes.put(StatutMarital.MARIAGE, "statut_marital.mariage");
        statutMaritalCheckboxes.put(StatutMarital.PACS, "statut_marital.pacs");
        statutMaritalCheckboxes.put(StatutMarital.RELATION_LIBRE, "statut_marital.relation_libre");
        statutMaritalCheckboxes.put(StatutMarital.SEPARE, "statut_marital.separe");
        statutMaritalCheckboxes.put(StatutMarital.DIVORCE, "statut_marital.divorce");
        statutMaritalCheckboxes.put(StatutMarital.VEUF, "statut_marital.veuf");
    }

    private static void initNationalitesEnfants() {
        nationalitesEnfants.put(Nationalite.FRANCAISE, "FRA");
        nationalitesEnfants.put(Nationalite.EEE_UE_SUISSE, "EEE");
        nationalitesEnfants.put(Nationalite.AUTRE, "AUT");
    }

    @Override
    protected float getDefaultNumberSpacing() {
        return 14.3f;
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
            if (individu.role == IndividuRole.DEMANDEUR) {
                fillDemandeur(individu);
            } else if (individu.role == IndividuRole.CONJOINT) {
                fillConjoint(individu);
            } else if (individu.role == IndividuRole.ENFANT) {
                fillEnfant(individu);
            }
        }

        fillLogement(situation.logement);
        appendText("demandeur.email", situation.email);
        appendNumber("demandeur.telephone", situation.phoneNumber);
        String currentDate = LocalDate.now().toString("ddMMyyyy");
        appendNumber("current_date", currentDate);
    }

    private void fillDemandeur(Individu demandeur) {
        String nomPrenom = null;
        if (null != demandeur.firstName && null != demandeur.lastName) {
            nomPrenom = String.format("%s %s", demandeur.lastName, demandeur.firstName);
            if (null != demandeur.nomUsage) {
                nomPrenom = String.format("%s (nom d'usage %s)", nomPrenom, demandeur.nomUsage);
            }
        }
        appendText("demandeur.nom", nomPrenom);

        appendNumber("demandeur.nir", demandeur.nir);
        appendNumber("demandeur.numero_allocataire", demandeur.numeroAllocataire);
        appendNumber("demandeur.date_naissance", demandeur.dateDeNaissance.replaceAll("/", ""));

        String nationaliteCheckbox = nationaliteCheckboxes.get(IndividuRole.DEMANDEUR).get(demandeur.nationalite);
        checkbox(nationaliteCheckbox);

        appendText("demandeur.email", situation.email);

        if (null != demandeur.statutMarital && demandeur.statutMarital.isAlone) {
            checkbox("statut_marital.celibataire");
        } else {
            String statutMaritalCheckbox = statutMaritalCheckboxes.get(demandeur.statutMarital);
            checkbox(statutMaritalCheckbox);
        }

        if (null != demandeur.dateSituationFamiliale) {
            appendNumber("statut_marital_date", demandeur.dateSituationFamiliale.replaceAll("/", ""));
        }
    }

    private void fillConjoint(Individu conjoint) {
        String nomPrenom = null;
        if (null != conjoint.firstName && null != conjoint.lastName) {
            nomPrenom = String.format("%s %s", conjoint.lastName, conjoint.firstName);
            if (null != conjoint.nomUsage) {
                nomPrenom = String.format("%s (nom d'usage %s)", nomPrenom, conjoint.nomUsage);
            }
        }
        appendText("conjoint.nom", nomPrenom);

        appendNumber("conjoint.nir", conjoint.nir);
        appendNumber("conjoint.numero_allocataire", conjoint.numeroAllocataire);
        appendNumber("conjoint.date_naissance", conjoint.dateDeNaissance.replaceAll("/", ""));

        String nationaliteCheckbox = nationaliteCheckboxes.get(IndividuRole.CONJOINT).get(conjoint.nationalite);
        checkbox(nationaliteCheckbox);
    }

    private void fillEnfant(Individu enfant) {
        String nomPrenom = null;
        if (null != enfant.firstName && null != enfant.lastName) {
            nomPrenom = String.format("%s %s", enfant.lastName, enfant.firstName);
        }
        appendText(String.format("enfant.%d.nom", currentChildIndex), nomPrenom);

        appendText(String.format("enfant.%d.nationalite", currentChildIndex), nationalitesEnfants.get(enfant.nationalite));
        if (null != enfant.lienParente) {
            appendText(String.format("enfant.%d.lien_parente", currentChildIndex), enfant.lienParente.textValue);
        }
        if (Boolean.TRUE == enfant.residenceAlternee) {
            checkbox(String.format("enfant.%d.residence_alternee", currentChildIndex));
        }
        appendNumber(String.format("enfant.%d.date_naissance", currentChildIndex), enfant.dateDeNaissance.replaceAll("/", ""));
        appendNumber(String.format("enfant.%d.nir", currentChildIndex), enfant.nir);

        currentChildIndex++;
    }

    private void fillLogement(Logement logement) {
        appendText("demandeur.adresse", logement.adresse.adresse);
        appendNumber("demandeur.code_postal", logement.adresse.codePostal);
        appendText("demandeur.ville", logement.adresse.ville);
    }
}
