package formfiller;

import java.util.EnumMap;

import models.Situation;
import models.Situation.Individu;
import models.Situation.IndividuRole;
import models.Situation.LogementType;
import models.Situation.Nationalite;
import models.Situation.StatutMarital;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.joda.time.LocalDate;

public class RSAFormFiller extends FormFiller {

    private static final EnumMap<IndividuRole, EnumMap<Nationalite, Point>> nationaliteCheckboxes = new EnumMap<>(IndividuRole.class);
    private static final EnumMap<LogementType, Point> logementTypeCheckboxes = new EnumMap<>(LogementType.class);
    private static final EnumMap<StatutMarital, Point> statutMaritalCheckboxes = new EnumMap<>(StatutMarital.class);

    private int currentPersonneACharge = 0;

    public RSAFormFiller(PDDocument document, Situation situation) {
        super(document, situation);
        initNationaliteCheckboxes();
        initLogementTypeCheckboxes();
        initStatutMaritalCheckboxes();
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
    protected float getNumberSpacing() {
        return 15.5f;
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
        fillCurrentDate();
    }

    private void fillDemandeur(Individu demandeur) {
        currentPage = 0;
        appendOptionalText(demandeur.lastName, 155, 687);
        appendOptionalText(demandeur.firstName, 170, 648);
        appendDate(demandeur.dateDeNaissance, 113, 635);
        Point checkboxNationalite = nationaliteCheckboxes.get(IndividuRole.DEMANDEUR).get(demandeur.nationalite);
        checkbox(checkboxNationalite.x, checkboxNationalite.y);

        currentPage = 1;
        if (StatutMarital.SEUL == demandeur.statusMarital) {
            checkbox(31, 670);
        } else {
            checkbox(31, 746);
            Point statutMaritalCheckbox = statutMaritalCheckboxes.get(demandeur.statusMarital);
            checkbox(statutMaritalCheckbox.x, statutMaritalCheckbox.y);
        }

        if (demandeur.enceinte) {
            checkbox(155, 551);
        } else {
            checkbox(193, 551);
        }
    }

    private void fillConjoint(Individu conjoint) {
        currentPage = 0;
        appendOptionalText(conjoint.lastName, 430, 687);
        appendOptionalText(conjoint.firstName, 442, 648);
        appendDate(conjoint.dateDeNaissance, 389, 635);
        Point checkboxNationalite = nationaliteCheckboxes.get(IndividuRole.CONJOINT).get(conjoint.nationalite);
        checkbox(checkboxNationalite.x, checkboxNationalite.y);
    }

    private void fillEnfant(Individu individu) {
        currentPage = 1;
        individu.lastName = "kleinpeter";
        individu.firstName = "arnaud";
        String nomPrenom = null;
        if (null != individu.lastName) {
            nomPrenom = individu.lastName;
            if (null != individu.firstName) {
                nomPrenom += " " + individu.firstName;
            }
        }
        appendOptionalText(nomPrenom, 117 + currentPersonneACharge * 113, 515, 7);
        if (Nationalite.FRANCAISE == individu.nationalite) {
            appendText("Française", 117 + currentPersonneACharge * 113, 453, 7);
        }
        currentPersonneACharge++;
    }

    private void fillLogement() {
        currentPage = 0;
        appendNumber(situation.logement.codePostal, 88, 352);
        Point logementTypeCheckbox = logementTypeCheckboxes.get(situation.logement.type);
        if (null != logementTypeCheckbox) {
            checkbox(logementTypeCheckbox.x, logementTypeCheckbox.y);
        }
    }
    private void fillCurrentDate() {
        currentPage = 4;
        String currentDate = LocalDate.now().toString("dd/MM/yyyy");
        appendText(currentDate, 150, 200);
    }
}
