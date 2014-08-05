package formfiller;

import java.util.EnumMap;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;

import models.Situation;
import models.Situation.Individu;
import models.Situation.IndividuRole;
import models.Situation.Logement;
import models.Situation.Nationalite;
import models.Situation.StatutMarital;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.joda.time.LocalDate;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;

public class AspaFormFiller extends FormFiller {

    private static final EnumMap<StatutMarital, Point> statutMaritalCheckboxes = new EnumMap<>(StatutMarital.class);
    private static DateTimeFormatter monthFormatter;

    public AspaFormFiller(PDDocument document, Situation situation) {
        super(document, situation);
        initStatutMaritalCheckboxesCoordinates();
        monthFormatter = DateTimeFormat.forPattern("MMMM yyyy").withLocale(Locale.FRANCE);
    }

    private static void initStatutMaritalCheckboxesCoordinates() {
        statutMaritalCheckboxes.put(StatutMarital.SEUL, new Point(75, 475));
        statutMaritalCheckboxes.put(StatutMarital.MARIAGE, new Point(144, 475));
        statutMaritalCheckboxes.put(StatutMarital.PACS, new Point(388, 435));
        statutMaritalCheckboxes.put(StatutMarital.RELATION_LIBRE, new Point(228, 435));
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
        currentPage = 4;
        appendOptionalText(demandeur.lastName, 140, 715);
        appendOptionalText(demandeur.firstName, 225, 655);
        appendDate(demandeur.dateDeNaissance, 140, 634);
        if (Nationalite.FRANCAISE == demandeur.nationalite) {
            appendText("française", 390, 635);
        }
        appendText("FRANCE", 470, 545);
        if (null != demandeur.numeroSecu) {
            appendNumber(demandeur.numeroSecu.substring(0, 13), 155, 523);
            appendNumber(demandeur.numeroSecu.substring(13, 15), 323, 523);
        }
        Point statutMaritalCheckbox = statutMaritalCheckboxes.get(demandeur.statusMarital);
        checkbox(statutMaritalCheckbox.x, statutMaritalCheckbox.y);
    }

    private void fillConjoint(Individu conjoint) {
        currentPage = 4;
        appendOptionalText(conjoint.lastName, 140, 367);
        appendOptionalText(conjoint.firstName, 220, 347);
        appendDate(conjoint.dateDeNaissance, 129, 325);
        if (Nationalite.FRANCAISE == conjoint.nationalite) {
            appendText("française", 380, 327);
        }
        if (null != conjoint.numeroSecu) {
            appendNumber(conjoint.numeroSecu.substring(0, 13), 150, 275);
            appendNumber(conjoint.numeroSecu.substring(13, 15), 318, 275);
        }
    }

    private void fillLogement(Logement logement) {
        appendOptionalText(logement.adresse, 100, 565);
        appendNumber(logement.codePostal, 91, 543);
        appendOptionalText(logement.ville, 210, 545);
    }

    private void fillMonthsLabels() {
        LocalDate currentMonth = LocalDate.now().withDayOfMonth(1);
        Map<LocalDate, Point> months = new LinkedHashMap<>();
        months.put(currentMonth.minusMonths(3), new Point(320, 675));
        months.put(currentMonth.minusMonths(2), new Point(405, 675));
        months.put(currentMonth.minusMonths(1), new Point(490, 675));
        currentPage = 5;
        for (Map.Entry<LocalDate, Point> entry : months.entrySet()) {
            appendText(entry.getKey().toString(monthFormatter), entry.getValue().x, entry.getValue().y, 9);
        }
        currentPage = 6;
        for (Map.Entry<LocalDate, Point> entry : months.entrySet()) {
            appendText(entry.getKey().toString(monthFormatter), entry.getValue().x, entry.getValue().y, 9);
        }
    }

    private void fillCurrentDate() {
        currentPage = 7;
        String currentDate = LocalDate.now().toString("ddMMyyyy");
        appendNumber(currentDate, 198, 141);
    }
}
