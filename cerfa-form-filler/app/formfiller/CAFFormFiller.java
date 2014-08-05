package formfiller;

import java.util.EnumMap;

import models.Situation;
import models.Situation.Individu;
import models.Situation.IndividuRole;
import models.Situation.Nationalite;
import models.Situation.StatutMarital;

import org.apache.pdfbox.pdmodel.PDDocument;

public class CAFFormFiller extends FormFiller {

    private static final EnumMap<IndividuRole, EnumMap<Nationalite, Point>> nationaliteCheckboxes = new EnumMap<>(IndividuRole.class);
    private static final EnumMap<StatutMarital, Point> statutMaritalCheckboxes = new EnumMap<>(StatutMarital.class);

    private int currentPersonneACharge = 0;

    public CAFFormFiller(PDDocument document, Situation situation) {
        super(document, situation);
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
        for (Individu individu : situation.individus) {
            if (IndividuRole.DEMANDEUR == individu.role) {
                fillDemandeur(individu);
            } else if (IndividuRole.CONJOINT == individu.role) {
                fillConjoint(individu);
            }
        }
        fillLogement();
        fillPersonnesACharge();
    }

    private void fillDemandeur(Individu demandeur) {
        currentPage = 0;
        appendOptionalText(demandeur.lastName, 160, 627);
        appendOptionalText(demandeur.firstName, 170, 587);
        appendDate(demandeur.dateDeNaissance, 114, 557);
        Point checkboxCoordinates = nationaliteCheckboxes.get(IndividuRole.DEMANDEUR).get(demandeur.nationalite);
        checkbox(checkboxCoordinates.x, checkboxCoordinates.y);
        if (null != demandeur.numeroSecu) {
            appendNumber(demandeur.numeroSecu.substring(0, 13), 55, 465);
            appendNumber(demandeur.numeroSecu.substring(13, 15), 260, 465);
        }

        currentPage = 1;
        Point statutMaritalCheckbox = statutMaritalCheckboxes.get(demandeur.statusMarital);
        if (null != statutMaritalCheckbox) {
            checkbox(statutMaritalCheckbox.x, statutMaritalCheckbox.y);
        }
    }

    private void fillConjoint(Individu conjoint) {
        currentPage = 0;
        appendOptionalText(conjoint.lastName, 435, 627);
        appendOptionalText(conjoint.firstName, 445, 587);
        appendDate(conjoint.dateDeNaissance, 389, 557);
        Point checkboxCoordinates = nationaliteCheckboxes.get(IndividuRole.CONJOINT).get(conjoint.nationalite);
        checkbox(checkboxCoordinates.x, checkboxCoordinates.y);
        if (null != conjoint.numeroSecu) {
            appendNumber(conjoint.numeroSecu.substring(0, 13), 330, 465);
            appendNumber(conjoint.numeroSecu.substring(13, 15), 535, 465);
        }
    }

    private void fillLogement() {
        currentPage = 0;
        appendNumber(situation.logement.codePostal, 89, 243);
    }

    private void fillPersonnesACharge() {
        currentPage = 1;
        for (Individu individu : situation.individus) {
            if (IndividuRole.ENFANT == individu.role || IndividuRole.PERSONNE_A_CHARGE == individu.role) {
                fillPersonneACharge(individu);
            }
        }
    }

    private void fillPersonneACharge(Individu individu) {
        individu.lastName = "Kleinpeter";
        individu.firstName = "Arnaud";
        float verticalCoordinateTop = 398 + currentPersonneACharge * 28.5f;
        float verticalCoordinateBottom = 384 + currentPersonneACharge * 28.5f;
        appendOptionalText(individu.lastName, 37, verticalCoordinateTop);
        appendOptionalText(individu.firstName, 37, verticalCoordinateBottom);
        appendDate(individu.dateDeNaissance, 144, verticalCoordinateTop);
        currentPersonneACharge++;
    }

    @Override
    protected float getNumberSpacing() {
        return 15.5f;
    }
}
