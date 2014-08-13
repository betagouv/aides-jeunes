package formfiller;

import java.util.EnumMap;

import models.Individu;
import models.Individu.Civilite;
import models.Individu.IndividuRole;
import models.Individu.Nationalite;
import models.Individu.StatutMarital;
import models.Logement.LogementType;

import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.joda.time.LocalDate;

import pdfwriter.Point;

public class RSAFormFiller extends FormFiller {

    private static final Object[][] checkboxes = {
        {"demandeur_homme", 0, 102, 703},
        {"demandeur_femme", 0,  30, 703},
        {"conjoint_homme",  0, 378, 703},
        {"conjoint_femme",  0, 306, 703},

        {"demandeur_francais", 0, 30, 578},
        {"demandeur_ue",       0, 91, 578},
        {"demandeur_non_ue",   0, 178, 578},
        {"conjoint_francais",  0, 306, 578},
        {"conjoint_ue",        0, 368, 578},
        {"conjoint_non_ue",    0, 457, 578},

        {"demandeur_inscrit_caf_oui", 0, 30, 475},
        {"demandeur_inscrit_caf_non", 0, 102, 475},
        {"conjoint_inscrit_caf_oui",  0, 306, 475},
        {"conjoint_inscrit_caf_non",  0, 378, 475},

        {"logement_locataire",       0, 30, 175},
        {"logement_payant",          0, 30, 161},
        {"logement_gratuit",         0, 30, 133},
        {"logement_proprio_pret",    0, 30, 147},
        {"logement_proprio_no_pret", 0, 203, 147},

        {"seul", 1, 31, 671},
        {"en_couple", 1, 31, 746},

        {"mariage",           1, 45, 731},
        {"pacs",              1, 45, 716},
        {"relation_libre",    1, 45, 701},
        {"separe",            1, 45, 656},
        {"pacs_rompu",        1, 45, 641},
        {"divorce",           1, 45, 626},
        {"veuf",              1, 45, 611},
        {"concubinage_rompu", 1, 45, 596},
        {"celibataire",       1, 45, 581},

        {"enceinte.oui", 1, 155, 551},
        {"enceinte.non", 1, 193, 551},

        {"pension_alimentaire.separe",          1, 31, 338},
        {"pension_alimentaire.has_child_alone", 1, 31, 308},
    };

    private static final Object[][] textFields = {
        {"demandeur.nom",             0, 155, 687},
        {"demandeur.nom_usage",       0, 133, 670},
        {"demandeur.prenom",          0, 170, 648},
        {"demandeur.pays_naissance",  0, 115, 620, 9},
        {"demandeur.ville_naissance", 0, 83, 605, 7},
        {"demandeur.num_allocataire", 0, 100, 460},

        {"conjoint.nom",             0, 430, 687},
        {"conjoint.nom_usage",       0, 408, 670},
        {"conjoint.prenom",          0, 442, 648},
        {"conjoint.pays_naissance",  0, 390, 620, 9},
        {"conjoint.ville_naissance", 0, 358, 605, 7},
        {"conjoint.num_allocataire", 0, 375, 460},

        {"adresse.numero",      0, 45, 378},
        {"adresse.rue",         0, 135, 378},
        {"adresse.ville",       0, 253, 350},
        {"adresse.mail.gauche", 0, 92, 321, 10},
        {"adresse.mail.droite", 0, 267, 321, 10},

        {"adresse.conjoint.numero", 0, 45, 235},
        {"adresse.conjoint.rue",    0, 135, 235},
        {"adresse.conjoint.ville",  0, 253, 207},
        {"adresse.conjoint.pays",   0, 480, 207},

        {"enfant.1.nom",            1, 117, 515, 5},
        {"enfant.1.lien_parente",   1, 117, 496, 5},
        {"enfant.1.date_naissace",  1, 117, 484, 5},
        {"enfant.1.lieu_naissance", 1, 117, 472, 5},
        {"enfant.1.nationalite",    1, 117, 453, 5},
        {"enfant.1.nir",            1, 117, 430, 5},
        {"enfant.1.date_arrivee",   1, 117, 406, 5},
        {"enfant.1.situation",      1, 117, 387, 5},

        {"enfant.2.nom",            1, 230, 515, 5},
        {"enfant.2.lien_parente",   1, 230, 496, 5},
        {"enfant.2.date_naissace",  1, 230, 484, 5},
        {"enfant.2.lieu_naissance", 1, 230, 472, 5},
        {"enfant.2.nationalite",    1, 230, 453, 5},
        {"enfant.2.nir",            1, 230, 430, 5},
        {"enfant.2.date_arrivee",   1, 230, 406, 5},
        {"enfant.2.situation",      1, 230, 387, 5},

        {"enfant.3.nom",            1, 343, 515, 5},
        {"enfant.3.lien_parente",   1, 343, 496, 5},
        {"enfant.3.date_naissace",  1, 343, 484, 5},
        {"enfant.3.lieu_naissance", 1, 343, 472, 5},
        {"enfant.3.nationalite",    1, 343, 453, 5},
        {"enfant.3.nir",            1, 343, 430, 5},
        {"enfant.3.date_arrivee",   1, 343, 406, 5},
        {"enfant.3.situation",      1, 343, 387, 5},

        {"enfant.4.nom",            1, 456, 515, 5},
        {"enfant.4.lien_parente",   1, 456, 496, 5},
        {"enfant.4.date_naissace",  1, 456, 484, 5},
        {"enfant.4.lieu_naissance", 1, 456, 472, 5},
        {"enfant.4.nationalite",    1, 456, 453, 5},
        {"enfant.4.nir",            1, 456, 430, 5},
        {"enfant.4.date_arrivee",   1, 456, 406, 5},
        {"enfant.4.situation",      1, 456, 387, 5},

        {"current_date", 4, 150, 200},
    };

    private static final EnumMap<IndividuRole, EnumMap<Civilite, String>> civiliteCheckboxes = new EnumMap<>(IndividuRole.class);
    private static final EnumMap<IndividuRole, EnumMap<Nationalite, String>> nationaliteCheckboxes = new EnumMap<>(IndividuRole.class);
    private static final EnumMap<LogementType, String> logementTypeCheckboxes = new EnumMap<>(LogementType.class);
    private static final EnumMap<StatutMarital, String> statutMaritalCheckboxes = new EnumMap<>(StatutMarital.class);
    private static final EnumMap<StatutMarital, Point> statutMaritalDates = new EnumMap<>(StatutMarital.class);

    private int currentEnfant = 1;

    public RSAFormFiller() {
        initCiviliteCheckboxes();
        initNationaliteCheckboxes();
        initLogementTypeCheckboxes();
        initStatutMaritalFields();
    }

    private void initCiviliteCheckboxes() {
        EnumMap<Civilite, String> demandeurCheckboxes = new EnumMap<>(Civilite.class);
        demandeurCheckboxes.put(Civilite.HOMME, "demandeur_homme");
        demandeurCheckboxes.put(Civilite.FEMME, "demandeur_femme");
        civiliteCheckboxes.put(IndividuRole.DEMANDEUR, demandeurCheckboxes);

        EnumMap<Civilite, String> conjointCheckboxes = new EnumMap<>(Civilite.class);
        conjointCheckboxes.put(Civilite.HOMME, "conjoint_homme");
        conjointCheckboxes.put(Civilite.FEMME, "conjoint_femme");
        civiliteCheckboxes.put(IndividuRole.CONJOINT, conjointCheckboxes);
    }

    private void initNationaliteCheckboxes() {
        EnumMap<Nationalite, String> demandeurCheckboxes = new EnumMap<>(Nationalite.class);
        demandeurCheckboxes.put(Nationalite.FRANCAISE, "demandeur_francais");
        demandeurCheckboxes.put(Nationalite.EEE_UE_SUISSE, "demandeur_ue");
        demandeurCheckboxes.put(Nationalite.AUTRE, "demandeur_non_ue");
        nationaliteCheckboxes.put(IndividuRole.DEMANDEUR, demandeurCheckboxes);

        EnumMap<Nationalite, String> conjointCheckboxes = new EnumMap<>(Nationalite.class);
        conjointCheckboxes.put(Nationalite.FRANCAISE, "conjoint_francais");
        conjointCheckboxes.put(Nationalite.EEE_UE_SUISSE, "conjoint_ue");
        conjointCheckboxes.put(Nationalite.AUTRE, "conjoint_non_ue");
        nationaliteCheckboxes.put(IndividuRole.CONJOINT, conjointCheckboxes);
    }

    private void initLogementTypeCheckboxes() {
        logementTypeCheckboxes.put(LogementType.LOCATAIRE, "logement_locataire");
        logementTypeCheckboxes.put(LogementType.PAYANT, "logement_payant");
        logementTypeCheckboxes.put(LogementType.GRATUIT, "logement_gratuit");
    }

    private void initStatutMaritalFields() {
        statutMaritalCheckboxes.put(StatutMarital.MARIAGE, "mariage");
        statutMaritalCheckboxes.put(StatutMarital.PACS, "pacs");
        statutMaritalCheckboxes.put(StatutMarital.RELATION_LIBRE, "relation_libre");
        statutMaritalCheckboxes.put(StatutMarital.SEPARE, "separe");
        statutMaritalCheckboxes.put(StatutMarital.PACS_ROMPU, "pacs_rompu");
        statutMaritalCheckboxes.put(StatutMarital.DIVORCE, "divorce");
        statutMaritalCheckboxes.put(StatutMarital.VEUF, "veuf");
        statutMaritalCheckboxes.put(StatutMarital.CONCUBINAGE_ROMPU, "concubinage_rompu");
        statutMaritalCheckboxes.put(StatutMarital.CELIBATAIRE, "celibataire");

        statutMaritalDates.put(StatutMarital.MARIAGE, new Point(172, 732));
        statutMaritalDates.put(StatutMarital.PACS, new Point(172, 717));
        statutMaritalDates.put(StatutMarital.RELATION_LIBRE, new Point(334, 702));
        statutMaritalDates.put(StatutMarital.SEPARE, new Point(216, 657));
        statutMaritalDates.put(StatutMarital.PACS_ROMPU, new Point(230, 642));
        statutMaritalDates.put(StatutMarital.DIVORCE, new Point(187, 627));
        statutMaritalDates.put(StatutMarital.VEUF, new Point(180, 612));
        statutMaritalDates.put(StatutMarital.CONCUBINAGE_ROMPU, new Point(278, 597));
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
    public void fill() {
        writer.setNumberSpacing(15.5f);
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
        writer.setPage(0);
        String civiliteCheckbox = civiliteCheckboxes.get(IndividuRole.DEMANDEUR).get(demandeur.civilite);
        checkbox(civiliteCheckbox);
        appendText("demandeur.nom", demandeur.lastName);
        appendText("demandeur.nom_usage", demandeur.nomUsage);
        appendText("demandeur.prenom", demandeur.firstName);
        writer.appendDate(demandeur.dateDeNaissance, 113, 635);

        if (null != demandeur.paysNaissance) {
            appendText("demandeur.pays_naissance", demandeur.paysNaissance);
            if ("france".equals(demandeur.paysNaissance.toLowerCase())) {
                appendText("demandeur.ville_naissance", demandeur.villeNaissance);
                if (null != demandeur.departementNaissance) {
                    writer.appendOptionalNumber(String.valueOf(demandeur.departementNaissance), 261, 608);
                }
            }
        }

        String checkboxNationalite = nationaliteCheckboxes.get(IndividuRole.DEMANDEUR).get(demandeur.nationalite);
        checkbox(checkboxNationalite);
        writer.setNumberSpacing(15.1f);
        writer.appendOptionalNumber(demandeur.nir, 31, 507);
        writer.setNumberSpacing(15.5f);

        if (null != demandeur.inscritCaf) {
            if (demandeur.inscritCaf) {
                checkbox("demandeur_inscrit_caf_oui");
                appendText("demandeur.num_allocataire", demandeur.numeroAllocataire);
            } else {
                checkbox("demandeur_inscrit_caf_non");
            }
        }

        writer.setPage(1);
        if (null != demandeur.statusMarital) {
            if (demandeur.statusMarital.isAlone) {
                checkbox("seul");
            } else {
                checkbox("en_couple");
            }

            String statutMaritalCheckbox = statutMaritalCheckboxes.get(demandeur.statusMarital);
            checkbox(statutMaritalCheckbox);

            Point statutMaritalDate = statutMaritalDates.get(demandeur.statusMarital);
            if (null != statutMaritalDate) {
                writer.appendDate(demandeur.dateSituationFamiliale, statutMaritalDate.x, statutMaritalDate.y);
            }
        }

        if (demandeur.enceinte) {
            checkbox("enceinte.oui");
        } else {
            checkbox("enceinte.non");
        }

        fillPensionAlimentaire(demandeur);
    }

    private void fillConjoint(Individu conjoint) {
        writer.setPage(0);
        String civiliteCheckbox = civiliteCheckboxes.get(IndividuRole.CONJOINT).get(conjoint.civilite);
        checkbox(civiliteCheckbox);
        appendText("conjoint.nom", conjoint.lastName);
        appendText("conjoint.nom_usage", conjoint.nomUsage);
        appendText("conjoint.prenom", conjoint.firstName);
        writer.appendDate(conjoint.dateDeNaissance, 389, 635);

        if (null != conjoint.paysNaissance) {
            appendText("conjoint.pays_naissance", conjoint.paysNaissance);
            if ("france".equals(conjoint.paysNaissance.toLowerCase())) {
                appendText("conjoint.ville_naissance", conjoint.villeNaissance);
                if (null != conjoint.departementNaissance) {
                    writer.appendOptionalNumber(String.valueOf(conjoint.departementNaissance), 537, 608);
                }
            }
        }

        String checkboxNationalite = nationaliteCheckboxes.get(IndividuRole.CONJOINT).get(conjoint.nationalite);
        checkbox(checkboxNationalite);
        writer.setNumberSpacing(15.1f);
        writer.appendOptionalNumber(conjoint.nir, 308, 507);
        writer.setNumberSpacing(15.5f);

        if (null != conjoint.inscritCaf) {
            if (conjoint.inscritCaf) {
                checkbox("conjoint_inscrit_caf_oui");
                appendText("conjoint.num_allocataire", conjoint.numeroAllocataire);
            } else {
                checkbox("conjoint_inscrit_caf_non");
            }
        }
    }

    private void fillEnfant(Individu individu) {
        if (currentEnfant > 4) {
            return;
        }

        writer.setPage(1);
        writer.setFontSize(7);

        String nomPrenom = null;
        if (null != individu.lastName) {
            nomPrenom = individu.lastName;
            if (null != individu.firstName) {
                nomPrenom += " " + individu.firstName;
            }
        }
        appendText(String.format("enfant.%d.nom", currentEnfant), nomPrenom);

        if (null != individu.lienParente) {
            appendText(String.format("enfant.%d.lien_parente", currentEnfant), individu.lienParente.formValue);
        }

        appendText(String.format("enfant.%d.date_naissance", currentEnfant), individu.dateDeNaissance);
        if (null != individu.paysNaissance) {
            if ("france".equals(individu.paysNaissance.toLowerCase())) {
                if (null != individu.villeNaissance) {
                    String lieuNaissance = individu.villeNaissance;
                    if (null != individu.departementNaissance) {
                        lieuNaissance = String.format("%s (%d)", individu.villeNaissance, individu.departementNaissance);
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
            appendText(String.format("enfant.%d.situation", currentEnfant), individu.situation.formValue);
        }

        writer.setFontSize(12);
        currentEnfant++;
    }

    private void fillLogement() {
        writer.setPage(0);
        if (null != situation.logement.adresse) {
            String[] addressTokens = situation.logement.adresse.split(" ");
            if (addressTokens.length > 1) {
                String number = addressTokens[0];
                if (StringUtils.isNumeric(String.valueOf(number.charAt(0)))) {
                    appendText("adresse.numero", number);
                }
                addressTokens = ArrayUtils.remove(addressTokens, 0);
                String address = StringUtils.join(addressTokens, " ");
                appendText("adresse.rue", address);
            }
        }

        writer.appendNumber(situation.logement.codePostal, 88, 352);
        appendText("adresse.ville", situation.logement.ville);

        String logementTypeCheckbox = logementTypeCheckboxes.get(situation.logement.type);
        checkbox(logementTypeCheckbox);

        if (LogementType.PROPRIETAIRE == situation.logement.type) {
            if (null == situation.logement.loyer || Integer.valueOf(0).equals(situation.logement.loyer)) {
                checkbox("logement_proprio_no_pret");
            } else {
                checkbox("logement_proprio_pret");
            }
        }

        writer.appendDate(situation.logement.dateArrivee, 184, 293);

        if (false == situation.logement.conjointMemeAdresse && null != situation.logement.conjoint) {
            String[] addressTokens = situation.logement.conjoint.adresse.split(" ");
            if (addressTokens.length > 1) {
                String number = addressTokens[0];
                if (StringUtils.isNumeric(String.valueOf(number.charAt(0)))) {
                    appendText("adresse.conjoint.numero", number);
                }
                addressTokens = ArrayUtils.remove(addressTokens, 0);
                String address = StringUtils.join(addressTokens, " ");
                appendText("adresse.conjoint.rue", address);
            }

            writer.appendNumber(situation.logement.conjoint.codePostal, 88, 209);
            appendText("adresse.conjoint.ville", situation.logement.conjoint.ville);
            appendText("adresse.conjoint.pays", situation.logement.conjoint.pays);
        }
    }

    private void fillContact() {
        writer.setPage(0);
        if (null != situation.phoneNumber) {
            if (StringUtils.startsWithAny(situation.phoneNumber, "06", "+336", "07", "+337")) {
                writer.appendNumber(situation.phoneNumber, 374, 338);
            } else {
                writer.appendNumber(situation.phoneNumber, 90, 338);
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
        if (StatutMarital.SEPARE == demandeur.statusMarital) {
            checkbox("pension_alimentaire.separe");
        }

        if (null != demandeur.statusMarital && demandeur.statusMarital.isAlone && childrenNb() > 0) {
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
