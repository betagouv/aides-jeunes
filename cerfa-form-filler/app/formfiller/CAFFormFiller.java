package formfiller;

import java.util.EnumMap;

import models.Individu;
import models.Individu.Civilite;
import models.Individu.IndividuRole;
import models.Individu.Nationalite;
import models.Individu.StatutMarital;

import org.apache.commons.lang3.StringUtils;
import org.joda.time.LocalDate;

public class CAFFormFiller extends FormFiller {

    private static final EnumMap<IndividuRole, EnumMap<Civilite, String>> civiliteCheckboxes = new EnumMap<>(IndividuRole.class);
    private static final EnumMap<IndividuRole, EnumMap<Nationalite, String>> nationaliteCheckboxes = new EnumMap<>(IndividuRole.class);
    private static final EnumMap<StatutMarital, String> statutMaritalCheckboxes = new EnumMap<>(StatutMarital.class);

    private static final Object[][] checkboxes = {
        {"demandeur.homme", 0,  30, 644},
        {"demandeur.femme", 0, 103, 644},
        {"conjoint.homme",  0, 305, 644},
        {"conjoint.femme",  0, 378, 644},

        {"demandeur.francais", 0,  30, 493},
        {"demandeur.ue",       0,  91, 493},
        {"demandeur.non_ue",   0, 198, 493},
        {"conjoint.francais",  0, 305, 493},
        {"conjoint.ue",        0, 366, 493},
        {"conjoint.non_ue",    0, 477, 493},

        {"statut_marital.mariage",        1, 30, 722},
        {"statut_marital.pacs",           1, 30, 711},
        {"statut_marital.relation_libre", 1, 30, 734},

        {"demandeur.demandeur_emploi", 2, 221, 494},
        {"demandeur.etudiant",         2, 221, 305},
        {"demandeur.retraite",         2, 221, 450},
        {"conjoint.demandeur_emploi",  2, 405, 494},
        {"conjoint.etudiant",          2, 405, 305},
        {"conjoint.retraite",          2, 405, 450},
    };

    private static final Object[][] textFields = {
        {"demandeur.nom",             0, 153,  627},
        {"demandeur.nom_usage",       0,  85, 611},
        {"demandeur.prenom",          0, 170, 587},
        {"demandeur.ville_naissance", 0, 122, 538},
        {"demandeur.pays_naissance",  0, 202, 524},
        {"conjoint.nom",              0, 428, 627},
        {"conjoint.nom_usage",        0, 360, 611},
        {"conjoint.prenom",           0, 445, 587},
        {"conjoint.ville_naissance",  0, 397, 538},
        {"conjoint.pays_naissance",   0, 479, 524},

        {"adresse.adresse", 0, 134, 257},
        {"adresse.ville",   0, 220, 240},
        {"adresse.pays",    0, 438, 240},

        {"email.gauche", 0,  87, 211},
        {"email.droite", 0, 302, 211},

        {"enfant.1.nom",            1,  37,    454, 7},
        {"enfant.1.prenom",         1,  37,    440, 7},
        {"enfant.1.lieu_naissance", 1, 147,    440, 7},
        {"enfant.1.lien_parente",   1, 267,    440, 7},
        {"enfant.1.situation",      1, 383,    454, 7},
        {"enfant.2.nom",            1,  37, 425.9f, 7},
        {"enfant.2.prenom",         1,  37, 411.9f, 7},
        {"enfant.2.lieu_naissance", 1, 147, 411.9f, 7},
        {"enfant.2.lien_parente",   1, 267, 411.9f, 7},
        {"enfant.2.situation",      1, 383, 425.9f, 7},
        {"enfant.3.nom",            1,  37, 397.8f, 7},
        {"enfant.3.prenom",         1,  37, 383.8f, 7},
        {"enfant.3.lieu_naissance", 1, 147, 383.8f, 7},
        {"enfant.3.lien_parente",   1, 267, 383.8f, 7},
        {"enfant.3.situation",      1, 383, 397.8f, 7},
        {"enfant.4.nom",            1,  37, 369.7f, 7},
        {"enfant.4.prenom",         1,  37, 355.7f, 7},
        {"enfant.4.lieu_naissance", 1, 147, 355.7f, 7},
        {"enfant.4.lien_parente",   1, 267, 355.7f, 7},
        {"enfant.4.situation",      1, 383, 369.7f, 7},
        {"enfant.5.nom",            1,  37, 341.6f, 7},
        {"enfant.5.prenom",         1,  37, 328.5f, 7},
        {"enfant.5.lieu_naissance", 1, 147, 328.5f, 7},
        {"enfant.5.lien_parente",   1, 267, 328.5f, 7},
        {"enfant.5.situation",      1, 383, 341.6f, 7},
    };

    private static final Object[][] numberFields = {
        {"demandeur.date_naissance",        0, 115, 557, 8},
        {"demandeur.departement_naissance", 0, 266, 541, 2},
        {"demandeur.nir",                   0,  52, 465, 13, 16f},
        {"demandeur.nir2",                  0, 260, 465, 2},
        {"conjoint.date_naissance",         0, 391, 557, 8},
        {"conjoint.departement_naissance",  0, 541, 541, 2},
        {"conjoint.nir",                    0, 327, 465, 13, 16f},
        {"conjoint.nir2",                   0, 535, 465, 2},

        {"adresse.code_postal", 0, 89, 243, 5},

        {"demandeur.tel_mobile", 0, 400, 228, 10, 14.2f},
        {"demandeur.tel_fixe",   0, 164, 228, 10, 14.2f},

        {"enfant.1.date_naissance", 1, 146,   455, 8, 14.8f},
        {"enfant.1.date_arrivee",   1, 265,   455, 8, 14.8f},
        {"enfant.2.date_naissance", 1, 146, 426.9f, 8, 14.8f},
        {"enfant.2.date_arrivee",   1, 265, 426.9f, 8, 14.8f},
        {"enfant.3.date_naissance", 1, 146, 398.8f, 8, 14.8f},
        {"enfant.3.date_arrivee",   1, 265, 398.8f, 8, 14.8f},
        {"enfant.4.date_naissance", 1, 146, 370.7f, 8, 14.8f},
        {"enfant.4.date_arrivee",   1, 265, 370.7f, 8, 14.8f},
        {"enfant.5.date_naissance", 1, 146, 342.6f, 8, 14.8f},
        {"enfant.5.date_arrivee",   1, 265, 342.6f, 8, 14.8f},

        {"current_date", 2, 307, 232, 8},
    };

    private int currentPersonneACharge = 0;

    public CAFFormFiller() {
        initCiviliteCheckboxes();
        initNationaliteCheckboxes();
        initStatutMaritalCheckboxes();
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

    private void initStatutMaritalCheckboxes() {
        statutMaritalCheckboxes.put(StatutMarital.MARIAGE, "statut_marital.mariage");
        statutMaritalCheckboxes.put(StatutMarital.PACS, "statut_marital.pacs");
        statutMaritalCheckboxes.put(StatutMarital.RELATION_LIBRE, "statut_marital.relation_libre");
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
            }
        }

        fillLogement();
        fillContact();
        fillPersonnesACharge();
        fillCurrentDate();
    }

    private void fillDemandeur(Individu demandeur) {
        String civiliteCheckbox = civiliteCheckboxes.get(IndividuRole.DEMANDEUR).get(demandeur.civilite);
        checkbox(civiliteCheckbox);

        appendText("demandeur.nom", demandeur.lastName);
        appendText("demandeur.nom_usage", demandeur.nomUsage);
        appendText("demandeur.prenom", demandeur.firstName);
        appendNumber("demandeur.date_naissance", demandeur.dateDeNaissance.replaceAll("/", ""));

        if (null != demandeur.paysNaissance) {
            if ("france".equals(demandeur.paysNaissance.toLowerCase())) {
                appendText("demandeur.ville_naissance", demandeur.villeNaissance);
                if (null != demandeur.departementNaissance) {
                    appendNumber("demandeur.departement_naissance", demandeur.departementNaissance);
                }
            } else {
                appendText("demandeur.pays_naissance", demandeur.paysNaissance);
            }
        }

        String nationaliteCheckbox = nationaliteCheckboxes.get(IndividuRole.DEMANDEUR).get(demandeur.nationalite);
        checkbox(nationaliteCheckbox);

        if (null != demandeur.nir) {
            appendNumber("demandeur.nir", demandeur.nir.substring(0, 13));
            appendNumber("demandeur.nir2", demandeur.nir.substring(13, 15));
        }

        String statutMaritalCheckbox = statutMaritalCheckboxes.get(demandeur.statutMarital);
        checkbox(statutMaritalCheckbox);

        if (demandeur.demandeurEmploi) {
            checkbox("demandeur.demandeur_emploi");
        }
        if (demandeur.etudiant) {
            checkbox("demandeur.etudiant");
        }
        if (demandeur.retraite) {
            checkbox("demandeur.retraite");
        }
    }

    private void fillConjoint(Individu conjoint) {
        String civiliteCheckbox = civiliteCheckboxes.get(IndividuRole.CONJOINT).get(conjoint.civilite);
        checkbox(civiliteCheckbox);

        appendText("conjoint.nom", conjoint.lastName);
        appendText("conjoint.nom_usage", conjoint.nomUsage);
        appendText("conjoint.prenom", conjoint.firstName);
        appendNumber("conjoint.date_naissance", conjoint.dateDeNaissance.replaceAll("/", ""));

        if (null != conjoint.paysNaissance) {
            if ("france".equals(conjoint.paysNaissance.toLowerCase())) {
                appendText("conjoint.ville_naissance", conjoint.villeNaissance);
                if (null != conjoint.departementNaissance) {
                    appendNumber("conjoint.departement_naissance", conjoint.departementNaissance);
                }
            } else {
                appendText("conjoint.pays_naissance", conjoint.paysNaissance);
            }
        }

        String nationaliteCheckbox = nationaliteCheckboxes.get(IndividuRole.CONJOINT).get(conjoint.nationalite);
        checkbox(nationaliteCheckbox);

        if (null != conjoint.nir) {
            appendNumber("conjoint.nir", conjoint.nir.substring(0, 13));
            appendNumber("conjoint.nir2", conjoint.nir.substring(13, 15));
        }

        if (conjoint.demandeurEmploi) {
            checkbox("conjoint.demandeur_emploi");
        }
        if (conjoint.etudiant) {
            checkbox("conjoint.etudiant");
        }
        if (conjoint.retraite) {
            checkbox("conjoint.retraite");
        }
    }

    private void fillLogement() {
        appendText("adresse.adresse", situation.logement.adresse.adresse);
        appendNumber("adresse.code_postal", situation.logement.adresse.codePostal);
        appendText("adresse.ville", situation.logement.adresse.ville);
        appendText("adresse.pays", "France");
    }

    private void fillContact() {
        if (null != situation.phoneNumber) {
            if (StringUtils.startsWithAny(situation.phoneNumber, "06", "+336", "07", "+337")) {
                appendNumber("demandeur.tel_mobile", situation.phoneNumber);
            } else {
                appendNumber("demandeur.tel_fixe", situation.phoneNumber);
            }
        }

        if (null != situation.email) {
            String[] parts =  situation.email.split("@");
            if (parts.length > 1) {
                appendText("email.gauche", parts[0]);
                appendText("email.droite", parts[1]);
            } else {
                appendText("email.gauche", situation.email);
            }
        }
    }

    private void fillPersonnesACharge() {
        for (Individu individu : situation.individus) {
            if (IndividuRole.ENFANT == individu.role || IndividuRole.PERSONNE_A_CHARGE == individu.role) {
                fillPersonneACharge(individu);
            }
        }
    }

    private void fillPersonneACharge(Individu individu) {
        appendText(String.format("enfant.%d.nom", currentPersonneACharge + 1), individu.lastName);
        appendText(String.format("enfant.%d.prenom", currentPersonneACharge + 1), individu.firstName);
        appendNumber(String.format("enfant.%d.date_naissance", currentPersonneACharge + 1), individu.dateDeNaissance.replaceAll("/", ""));
        if (null != individu.dateArriveeFoyer) {
            appendNumber(String.format("enfant.%d.date_arrivee", currentPersonneACharge + 1), individu.dateArriveeFoyer.replaceAll("/", ""));
        }
        currentPersonneACharge++;
    }

    private void fillCurrentDate() {
        String currentDate = LocalDate.now().toString("ddMMyyyy");
        appendNumber("current_date", currentDate);
    }
}
