package formfiller;

import java.util.EnumMap;

import models.Situation;
import models.Situation.Individu;
import models.Situation.IndividuRole;
import models.Situation.Nationalite;
import models.Situation.StatutMarital;

import org.joda.time.LocalDate;

import pdfwriter.PdfWriter;

public class CAFFormFiller extends FormFiller {

    private static final EnumMap<IndividuRole, EnumMap<Nationalite, Point>> nationaliteCheckboxes = new EnumMap<>(IndividuRole.class);
    private static final EnumMap<StatutMarital, Point> statutMaritalCheckboxes = new EnumMap<>(StatutMarital.class);

    private int currentPersonneACharge = 0;

    public CAFFormFiller(PdfWriter writer, Situation situation) {
        super(writer, situation);
        initNationaliteCheckboxes();
        initStatutMaritalCheckboxes();
    }

    private void initNationaliteCheckboxes() {
        EnumMap<Nationalite, Point> demandeurCheckboxes = new EnumMap<>(Nationalite.class);
        demandeurCheckboxes.put(Nationalite.FRANCAISE, new Point(31, 493));
        demandeurCheckboxes.put(Nationalite.EEE_UE_SUISSE, new Point(91, 493));
        demandeurCheckboxes.put(Nationalite.AUTRE, new Point(198, 493));
        nationaliteCheckboxes.put(IndividuRole.DEMANDEUR, demandeurCheckboxes);

        EnumMap<Nationalite, Point> conjointCheckboxes = new EnumMap<>(Nationalite.class);
        conjointCheckboxes.put(Nationalite.FRANCAISE, new Point(306, 493));
        conjointCheckboxes.put(Nationalite.EEE_UE_SUISSE, new Point(366, 493));
        conjointCheckboxes.put(Nationalite.AUTRE, new Point(477, 493));
        nationaliteCheckboxes.put(IndividuRole.CONJOINT, conjointCheckboxes);
    }

    private void initStatutMaritalCheckboxes() {
        statutMaritalCheckboxes.put(StatutMarital.MARIAGE, new Point(30, 722));
        statutMaritalCheckboxes.put(StatutMarital.PACS, new Point(30, 711));
        statutMaritalCheckboxes.put(StatutMarital.RELATION_LIBRE, new Point(30, 734));
    }

    @Override
    public void fill() {
        writer.setNumberSpacing(15.4f);
        for (Individu individu : situation.individus) {
            if (IndividuRole.DEMANDEUR == individu.role) {
                fillDemandeur(individu);
            } else if (IndividuRole.CONJOINT == individu.role) {
                fillConjoint(individu);
            }
        }
        fillLogement();
        fillPersonnesACharge();
        fillCurrentDate();
    }

    private void fillDemandeur(Individu demandeur) {
        writer.setPage(0);
        writer.appendOptionalText(demandeur.lastName, 160, 627);
        writer.appendOptionalText(demandeur.firstName, 170, 587);
        writer.appendDate(demandeur.dateDeNaissance, 114, 557);
        Point checkboxCoordinates = nationaliteCheckboxes.get(IndividuRole.DEMANDEUR).get(demandeur.nationalite);
        writer.checkbox(checkboxCoordinates.x, checkboxCoordinates.y);
        if (null != demandeur.numeroSecu) {
            writer.appendNumber(demandeur.numeroSecu.substring(0, 13), 55, 465);
            writer.appendNumber(demandeur.numeroSecu.substring(13, 15), 260, 465);
        }

        writer.setPage(1);
        Point statutMaritalCheckbox = statutMaritalCheckboxes.get(demandeur.statusMarital);
        if (null != statutMaritalCheckbox) {
            writer.checkbox(statutMaritalCheckbox.x, statutMaritalCheckbox.y);
        }

        writer.setPage(2);
        if (demandeur.demandeurEmploi) {
            writer.checkbox(221, 494);
        }
        if (demandeur.etudiant) {
            writer.checkbox(221, 305);
        }
        if (demandeur.retraite) {
            writer.checkbox(221, 450);
        }
    }

    private void fillConjoint(Individu conjoint) {
        writer.setPage(0);
        writer.appendOptionalText(conjoint.lastName, 435, 627);
        writer.appendOptionalText(conjoint.firstName, 445, 587);
        writer.appendDate(conjoint.dateDeNaissance, 389, 557);
        Point checkboxCoordinates = nationaliteCheckboxes.get(IndividuRole.CONJOINT).get(conjoint.nationalite);
        writer.checkbox(checkboxCoordinates.x, checkboxCoordinates.y);
        if (null != conjoint.numeroSecu) {
            writer.appendNumber(conjoint.numeroSecu.substring(0, 13), 330, 465);
            writer.appendNumber(conjoint.numeroSecu.substring(13, 15), 535, 465);
        }

        writer.setPage(2);
        if (conjoint.demandeurEmploi) {
            writer.checkbox(405, 494);
        }
        if (conjoint.etudiant) {
            writer.checkbox(405, 305);
        }
        if (conjoint.retraite) {
            writer.checkbox(405, 450);
        }
    }

    private void fillLogement() {
        writer.setPage(0);
        writer.appendNumber(situation.logement.codePostal, 89, 243);
    }

    private void fillPersonnesACharge() {
        writer.setPage(1);
        for (Individu individu : situation.individus) {
            if (IndividuRole.ENFANT == individu.role || IndividuRole.PERSONNE_A_CHARGE == individu.role) {
                fillPersonneACharge(individu);
            }
        }
    }

    private void fillPersonneACharge(Individu individu) {
        float verticalCoordinateTop = 454.0f - currentPersonneACharge * 28.1f;
        float verticalCoordinateBottom = 440.0f - currentPersonneACharge * 28.1f;
        writer.appendOptionalText(individu.lastName, 37, verticalCoordinateTop, 7);
        writer.appendOptionalText(individu.firstName, 37, verticalCoordinateBottom, 7);
        writer.appendDate(individu.dateDeNaissance, 144, verticalCoordinateTop + 1);
        currentPersonneACharge++;
    }

    private void fillCurrentDate() {
        writer.setPage(2);
        String currentDate = LocalDate.now().toString("ddMMyyyy");
        writer.appendNumber(currentDate, 307, 233);
    }
}
