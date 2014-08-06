package formfiller;

import models.Situation;
import models.Situation.Individu;
import models.Situation.IndividuRole;
import pdfwriter.PdfWriter;

public class ASFFormFiller {

    private PdfWriter writer;
    private Situation situation;
    private int currentEnfant = 0;

    public ASFFormFiller(PdfWriter writer, Situation situation) {
        this.writer = writer;
        this.situation = situation;
    }

    public void fill() {
        for (Individu individu : situation.individus) {
            if (IndividuRole.DEMANDEUR == individu.role) {
                fillDemandeur(individu);
            } else if (IndividuRole.ENFANT == individu.role) {
                fillEnfant(individu);
            }
        }
    }

    private void fillDemandeur(Individu demandeur) {
        writer.setPage(0);
        writer.appendOptionalText(demandeur.lastName, 100, 290, 9);
        writer.appendOptionalText(demandeur.firstName, 402, 290, 9);
        writer.setNumberSpacing(15.5f);
        writer.appendDate(demandeur.dateDeNaissance, 112, 247);
        if (null != demandeur.numeroSecu) {
            writer.setNumberSpacing(14.8f);
            writer.appendNumber(demandeur.numeroSecu.substring(0, 13), 149, 214);
            writer.appendNumber(demandeur.numeroSecu.substring(13, 15), 344, 214);
        }
    }

    private void fillEnfant(Individu enfant) {
        writer.setPage(0);
        writer.setFontSize(10);
        writer.appendOptionalText(enfant.lastName, 45, 142 - currentEnfant * 10);
        writer.appendOptionalText(enfant.firstName, 240, 142 - currentEnfant * 10);
        writer.setNumberSpacing(15.5f);
        writer.appendDate(enfant.dateDeNaissance, 430, 144 - currentEnfant * 10);
        currentEnfant++;
    }
}
