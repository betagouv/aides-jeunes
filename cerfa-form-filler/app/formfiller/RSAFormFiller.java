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

    private static final EnumMap<IndividuRole, EnumMap<Civilite, String>> civiliteCheckboxes = new EnumMap<>(IndividuRole.class);
    private static final EnumMap<IndividuRole, EnumMap<Nationalite, String>> nationaliteCheckboxes = new EnumMap<>(IndividuRole.class);
    private static final EnumMap<LogementType, String> logementTypeCheckboxes = new EnumMap<>(LogementType.class);
    private static final EnumMap<StatutMarital, String> statutMaritalCheckboxes = new EnumMap<>(StatutMarital.class);
    private static final EnumMap<StatutMarital, Point> statutMaritalDates = new EnumMap<>(StatutMarital.class);

    private int currentPersonneACharge = 0;

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
        writer.appendOptionalText(demandeur.lastName, 155, 687);
        writer.appendOptionalText(demandeur.nomUsage, 133, 670);
        writer.appendOptionalText(demandeur.firstName, 170, 648);
        writer.appendDate(demandeur.dateDeNaissance, 113, 635);

        if (null != demandeur.paysNaissance) {
            writer.appendText(demandeur.paysNaissance, 115, 620, 9);
            if ("france".equals(demandeur.paysNaissance.toLowerCase())) {
                writer.appendOptionalText(demandeur.villeNaissance, 83, 605, 7);
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
                writer.appendOptionalText(demandeur.numeroAllocataire, 100, 460);
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
        writer.appendOptionalText(conjoint.lastName, 430, 687);
        writer.appendOptionalText(conjoint.nomUsage, 408, 670);
        writer.appendOptionalText(conjoint.firstName, 442, 648);
        writer.appendDate(conjoint.dateDeNaissance, 389, 635);

        if (null != conjoint.paysNaissance) {
            writer.appendText(conjoint.paysNaissance, 390, 620, 9);
            if ("france".equals(conjoint.paysNaissance.toLowerCase())) {
                writer.appendOptionalText(conjoint.villeNaissance, 358, 605, 7);
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
                writer.appendOptionalText(conjoint.numeroAllocataire, 375, 460);
            } else {
                checkbox("conjoint_inscrit_caf_non");
            }
        }
    }

    private void fillEnfant(Individu individu) {
        writer.setPage(1);
        writer.setFontSize(7);
        float x = 117 + currentPersonneACharge * 113;

        String nomPrenom = null;
        if (null != individu.lastName) {
            nomPrenom = individu.lastName;
            if (null != individu.firstName) {
                nomPrenom += " " + individu.firstName;
            }
        }
        writer.appendOptionalText(nomPrenom, x, 515, 5);

        if (null != individu.lienParente) {
            writer.appendOptionalText(individu.lienParente.formValue, x, 496);
        }

        writer.appendText(individu.dateDeNaissance, x, 484);
        if (null != individu.paysNaissance) {
            if ("france".equals(individu.paysNaissance.toLowerCase())) {
                if (null != individu.villeNaissance) {
                    String lieuNaissance = individu.villeNaissance;
                    if (null != individu.departementNaissance) {
                        lieuNaissance = String.format("%s (%d)", individu.villeNaissance, individu.departementNaissance);
                    }
                    writer.appendOptionalText(lieuNaissance, x, 472);
                }
            } else {
                writer.appendText(individu.paysNaissance, x, 472);
            }
        }

        if (Nationalite.FRANCAISE == individu.nationalite) {
            writer.appendText("Française", x, 453);
        }

        writer.appendOptionalText(individu.nir, x, 430);
        writer.appendOptionalText(individu.dateArriveeFoyer, x, 406);
        if (null != individu.situation) {
            writer.appendOptionalText(individu.situation.formValue, x, 387, 6);
        }

        writer.setFontSize(12);
        currentPersonneACharge++;
    }

    private void fillLogement() {
        writer.setPage(0);
        if (null != situation.logement.adresse) {
            String[] addressTokens = situation.logement.adresse.split(" ");
            if (addressTokens.length > 1) {
                String number = addressTokens[0];
                if (StringUtils.isNumeric(String.valueOf(number.charAt(0)))) {
                    writer.appendText(number, 45, 378);
                }
                addressTokens = ArrayUtils.remove(addressTokens, 0);
                String address = StringUtils.join(addressTokens, " ");
                writer.appendText(address, 135, 378);
            }
        }

        writer.appendNumber(situation.logement.codePostal, 88, 352);
        writer.appendOptionalText(situation.logement.ville, 253, 350);

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
                    writer.appendText(number, 45, 235);
                }
                addressTokens = ArrayUtils.remove(addressTokens, 0);
                String address = StringUtils.join(addressTokens, " ");
                writer.appendText(address, 135, 235);
            }

            writer.appendNumber(situation.logement.conjoint.codePostal, 88, 209);
            writer.appendOptionalText(situation.logement.conjoint.ville, 253, 207);
            writer.appendText(situation.logement.conjoint.pays, 480, 207);
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
                writer.appendOptionalText(parts[0], 92, 321, 10);
                writer.appendOptionalText(parts[1], 267, 321, 10);
            } else {
                writer.appendOptionalText(situation.email, 92, 321, 10);
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
        writer.setPage(4);
        String currentDate = LocalDate.now().toString("dd/MM/yyyy");
        writer.appendText(currentDate, 150, 200);
    }
}
