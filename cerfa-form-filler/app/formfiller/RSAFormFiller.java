package formfiller;

import java.util.EnumMap;

import models.Individu;
import models.Individu.Civilite;
import models.Individu.IndividuRole;
import models.Individu.Nationalite;
import models.Individu.StatutMarital;
import models.Logement.LogementType;
import models.Situation;

import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.joda.time.LocalDate;

import pdfwriter.PdfWriter;

public class RSAFormFiller extends FormFiller {

    private static final EnumMap<IndividuRole, EnumMap<Civilite, Point>> civiliteCheckboxes = new EnumMap<>(IndividuRole.class);
    private static final EnumMap<IndividuRole, EnumMap<Nationalite, Point>> nationaliteCheckboxes = new EnumMap<>(IndividuRole.class);
    private static final EnumMap<LogementType, Point> logementTypeCheckboxes = new EnumMap<>(LogementType.class);
    private static final EnumMap<StatutMarital, Point> statutMaritalCheckboxes = new EnumMap<>(StatutMarital.class);

    private int currentPersonneACharge = 0;

    public RSAFormFiller(PdfWriter writer, Situation situation) {
        super(writer, situation);
        initCiviliteCheckboxes();
        initNationaliteCheckboxes();
        initLogementTypeCheckboxes();
        initStatutMaritalCheckboxes();
    }

    private void initCiviliteCheckboxes() {
        EnumMap<Civilite, Point> demandeurCheckboxes = new EnumMap<>(Civilite.class);
        demandeurCheckboxes.put(Civilite.HOMME, new Point(102, 703));
        demandeurCheckboxes.put(Civilite.FEMME, new Point(30, 703));
        civiliteCheckboxes.put(IndividuRole.DEMANDEUR, demandeurCheckboxes);

        EnumMap<Civilite, Point> conjointCheckboxes = new EnumMap<>(Civilite.class);
        conjointCheckboxes.put(Civilite.HOMME, new Point(378, 703));
        conjointCheckboxes.put(Civilite.FEMME, new Point(306, 703));
        civiliteCheckboxes.put(IndividuRole.CONJOINT, conjointCheckboxes);
    }

    private void initNationaliteCheckboxes() {
        EnumMap<Nationalite, Point> demandeurCheckboxes = new EnumMap<>(Nationalite.class);
        demandeurCheckboxes.put(Nationalite.FRANCAISE, new Point(30, 578));
        demandeurCheckboxes.put(Nationalite.EEE_UE_SUISSE, new Point(91, 578));
        demandeurCheckboxes.put(Nationalite.AUTRE, new Point(178, 578));
        nationaliteCheckboxes.put(IndividuRole.DEMANDEUR, demandeurCheckboxes);

        EnumMap<Nationalite, Point> conjointCheckboxes = new EnumMap<>(Nationalite.class);
        conjointCheckboxes.put(Nationalite.FRANCAISE, new Point(306, 578));
        conjointCheckboxes.put(Nationalite.EEE_UE_SUISSE, new Point(368, 578));
        conjointCheckboxes.put(Nationalite.AUTRE, new Point(457, 578));
        nationaliteCheckboxes.put(IndividuRole.CONJOINT, conjointCheckboxes);
    }

    private void initLogementTypeCheckboxes() {
        logementTypeCheckboxes.put(LogementType.LOCATAIRE, new Point(30, 175));
        logementTypeCheckboxes.put(LogementType.GRATUIT, new Point(30, 133));
    }

    private void initStatutMaritalCheckboxes() {
        statutMaritalCheckboxes.put(StatutMarital.MARIAGE, new Point(45, 731));
        statutMaritalCheckboxes.put(StatutMarital.PACS, new Point(45, 716));
        statutMaritalCheckboxes.put(StatutMarital.RELATION_LIBRE, new Point(45, 71));
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
        fillCurrentDate();
    }

    private void fillDemandeur(Individu demandeur) {
        writer.setPage(0);
        Point civiliteCheckbox = civiliteCheckboxes.get(IndividuRole.DEMANDEUR).get(demandeur.civilite);
        writer.checkbox(civiliteCheckbox.x, civiliteCheckbox.y);
        writer.appendOptionalText(demandeur.lastName, 155, 687);
        writer.appendOptionalText(demandeur.nomUsage, 133, 670);
        writer.appendOptionalText(demandeur.firstName, 170, 648);
        writer.appendDate(demandeur.dateDeNaissance, 113, 635);
        Point checkboxNationalite = nationaliteCheckboxes.get(IndividuRole.DEMANDEUR).get(demandeur.nationalite);
        writer.checkbox(checkboxNationalite.x, checkboxNationalite.y);
        writer.setNumberSpacing(15.1f);
        writer.appendOptionalNumber(demandeur.nir, 31, 507);
        writer.setNumberSpacing(15.5f);

        writer.setPage(1);
        if (StatutMarital.SEUL == demandeur.statusMarital) {
            writer.checkbox(31, 670);
        } else {
            writer.checkbox(31, 746);
            Point statutMaritalCheckbox = statutMaritalCheckboxes.get(demandeur.statusMarital);
            writer.checkbox(statutMaritalCheckbox.x, statutMaritalCheckbox.y);
        }

        if (demandeur.enceinte) {
            writer.checkbox(155, 551);
        } else {
            writer.checkbox(193, 551);
        }
    }

    private void fillConjoint(Individu conjoint) {
        writer.setPage(0);
        Point civiliteCheckbox = civiliteCheckboxes.get(IndividuRole.CONJOINT).get(conjoint.civilite);
        writer.checkbox(civiliteCheckbox.x, civiliteCheckbox.y);
        writer.appendOptionalText(conjoint.lastName, 430, 687);
        writer.appendOptionalText(conjoint.nomUsage, 408, 670);
        writer.appendOptionalText(conjoint.firstName, 442, 648);
        writer.appendDate(conjoint.dateDeNaissance, 389, 635);
        Point checkboxNationalite = nationaliteCheckboxes.get(IndividuRole.CONJOINT).get(conjoint.nationalite);
        writer.checkbox(checkboxNationalite.x, checkboxNationalite.y);
        writer.setNumberSpacing(15.1f);
        writer.appendOptionalNumber(conjoint.nir, 308, 507);
        writer.setNumberSpacing(15.5f);
    }

    private void fillEnfant(Individu individu) {
        writer.setPage(1);
        String nomPrenom = null;
        if (null != individu.lastName) {
            nomPrenom = individu.lastName;
            if (null != individu.firstName) {
                nomPrenom += " " + individu.firstName;
            }
        }
        writer.appendOptionalText(nomPrenom, 117 + currentPersonneACharge * 113, 515, 7);
        if (Nationalite.FRANCAISE == individu.nationalite) {
            writer.appendText("Française", 117 + currentPersonneACharge * 113, 453, 7);
        }
        currentPersonneACharge++;
    }

    private void fillLogement() {
        writer.setPage(0);
        if (null != situation.logement.adresse) {
            String[] addressTokens = situation.logement.adresse.split(" ");
            if (addressTokens.length > 1) {
                String number = addressTokens[0];
                if (StringUtils.isNumeric(number)) {
                    writer.appendText(number, 45, 378);
                }
                addressTokens = ArrayUtils.remove(addressTokens, 0);
                if (addressTokens[0].toLowerCase().equals("rue")) {
                    addressTokens = ArrayUtils.remove(addressTokens, 0);
                }
                String address = StringUtils.join(addressTokens, " ");
                writer.appendText(address, 135, 378);
            }
        }

        writer.appendNumber(situation.logement.codePostal, 88, 352);
        writer.appendOptionalText(situation.logement.ville, 253, 350);
        Point logementTypeCheckbox = logementTypeCheckboxes.get(situation.logement.type);
        if (null != logementTypeCheckbox) {
            writer.checkbox(logementTypeCheckbox.x, logementTypeCheckbox.y);
        }
    }

    private void fillCurrentDate() {
        writer.setPage(4);
        String currentDate = LocalDate.now().toString("dd/MM/yyyy");
        writer.appendText(currentDate, 150, 200);
    }
}
