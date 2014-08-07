package formfiller;

import models.Individu;
import models.Individu.IndividuRole;
import models.Situation;

import org.joda.time.LocalDate;

import pdfwriter.PdfWriter;

public class ASFFormFiller extends FormFiller {

    private int currentEnfant = 0;

    public ASFFormFiller(PdfWriter writer, Situation situation) {
        super(writer, situation);
    }

    @Override
    public void fill() {
        for (Individu individu : situation.individus) {
            if (IndividuRole.DEMANDEUR == individu.role) {
                fillDemandeur(individu);
            } else if (IndividuRole.ENFANT == individu.role) {
                fillEnfant(individu);
            }
        }

        fillCurrentDate();
    }

    private void fillDemandeur(Individu demandeur) {
        writer.setPage(0);
        writer.appendOptionalText(demandeur.lastName, 100, 290, 9);
        writer.appendOptionalText(demandeur.firstName, 402, 290, 9);
        writer.setNumberSpacing(15.5f);
        writer.appendDate(demandeur.dateDeNaissance, 112, 247);
        if (null != demandeur.nir) {
            writer.setNumberSpacing(14.8f);
            writer.appendNumber(demandeur.nir.substring(0, 13), 149, 214);
            writer.appendNumber(demandeur.nir.substring(13, 15), 344, 214);
        }
    }

    private void fillEnfant(Individu enfant) {
        writer.setPage(0);
        writer.setFontSize(10);
        writer.appendOptionalText(enfant.lastName, 45, 143 - currentEnfant * 10);
        writer.appendOptionalText(enfant.firstName, 240, 143 - currentEnfant * 10);
        writer.setNumberSpacing(15.5f);
        writer.appendDate(enfant.dateDeNaissance, 430, 144 - currentEnfant * 10);
        currentEnfant++;
    }

    private void fillCurrentDate() {
        writer.setPage(2);
        String currentDate = LocalDate.now().toString("dd/MM/yyyy");
        writer.appendText(currentDate, 310, 385);
    }
}
