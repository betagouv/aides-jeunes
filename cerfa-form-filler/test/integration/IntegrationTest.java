package integration;

import java.io.IOException;
import java.util.ArrayList;

import models.Individu;
import models.Individu.IndividuRole;
import models.Individu.Nationalite;
import models.Logement;
import models.Logement.LogementType;
import models.Situation;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.junit.Test;

import pdfwriter.PdfWriter;
import controllers.Application.Forms;
import formfiller.FormFiller;

public class IntegrationTest {

    @Test
    public void testAllForms_PartialSituation() throws IOException {
        fillAllFormsWithSituation(createPartialSituation());
    }

    @Test
    public void testAllForms_PartialSituationIncludingConjoint() throws IOException {
        fillAllFormsWithSituation(createPartialSituationIncludingConjoint());
    }

    private void fillAllFormsWithSituation(Situation situation) throws IOException {
        for (Forms form : Forms.values()) {
            FormFiller formFiller = form.createFormFiller();
            formFiller.setSituation(situation);
            PDDocument document = PDDocument.load(String.format("resources/%s.pdf", form.id));
            PdfWriter writer = new PdfWriter(document);
            formFiller.setWriter(writer);
            formFiller.fill();
        }
    }

    /**
     * Crée une situation dont seuls les champs obligatoires sont remplis.
     */
    private Situation createPartialSituation() {
        Situation situation = new Situation();
        situation.individus = new ArrayList<>();
        Individu demandeur = createPartialIndividu();
        demandeur.role = IndividuRole.DEMANDEUR;
        situation.individus.add(demandeur);
        situation.logement = new Logement();
        situation.logement.type = LogementType.GRATUIT;
        situation.logement.codePostal = "75011";

        return situation;
    }

    private Situation createPartialSituationIncludingConjoint() {
        Situation situation = createPartialSituation();
        Individu conjoint = createPartialIndividu();
        conjoint.role = IndividuRole.CONJOINT;
        situation.individus.add(conjoint);

        return situation;
    }

    private Individu createPartialIndividu() {
        Individu individu = new Individu();
        individu.dateDeNaissance = "14/09/1989";
        individu.nationalite = Nationalite.FRANCAISE;

        return individu;
    }
}
