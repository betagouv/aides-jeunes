package integration;

import java.io.IOException;
import java.util.ArrayList;

import models.Individu;
import models.Individu.Civilite;
import models.Individu.IndividuRole;
import models.Individu.LienParente;
import models.Individu.Nationalite;
import models.Individu.StatutMarital;
import models.Logement;
import models.Logement.Adresse;
import models.Logement.LogementType;
import models.Situation;
import models.SituationPro;
import models.SituationPro.SituationProType;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.junit.Test;

import pdfwriter.PdfWriter;
import controllers.Application.Forms;
import formfiller.FormFiller;

public class IntegrationTest {

    @Test
    public void testAllForms_PartialSituation() throws IOException {
        fillAllFormsWithSituation(createIncompleteSituation());
    }

    @Test
    public void testAllForms_PartialSituationIncludingConjoint() throws IOException {
        fillAllFormsWithSituation(createIncompleteSituationIncludingConjoint());
    }

    @Test
    public void testAllForms_PartialSituationIncludingChildren() throws IOException {
        fillAllFormsWithSituation(createIncompleteSituationIncludingChildren());
    }

    @Test
    public void testAllForms_CompleteSituation() throws IOException {
        fillAllFormsWithSituation(createCompleteSituation());
    }

    @Test
    public void testAllForms_CompleteSituationIncludingChildren() throws IOException {
        fillAllFormsWithSituation(createCompleteSituationIncludingChildren());
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
    private Situation createIncompleteSituation() {
        Situation situation = new Situation();
        situation.individus = new ArrayList<>();
        Individu demandeur = createIncompleteIndividu();
        demandeur.role = IndividuRole.DEMANDEUR;
        situation.individus.add(demandeur);
        situation.logement = new Logement();
        situation.logement.type = LogementType.GRATUIT;
        situation.logement.adresse = new Adresse();
        situation.logement.adresse.codePostal = "75011";

        return situation;
    }

    private Situation createIncompleteSituationIncludingConjoint() {
        Situation situation = createIncompleteSituation();
        Individu conjoint = createIncompleteIndividu();
        conjoint.role = IndividuRole.CONJOINT;
        situation.individus.add(conjoint);

        return situation;
    }

    private Situation createIncompleteSituationIncludingChildren() {
        Situation situation = createIncompleteSituationIncludingConjoint();
        Individu individu = createIncompleteIndividu();
        individu.role = IndividuRole.ENFANT;
        situation.individus.add(individu);
        individu = createIncompleteIndividu();
        individu.role = IndividuRole.ENFANT;
        situation.individus.add(individu);
        individu = createIncompleteIndividu();
        individu.role = IndividuRole.ENFANT;
        situation.individus.add(individu);

        return situation;
    }

    private Individu createIncompleteIndividu() {
        Individu individu = new Individu();
        individu.dateDeNaissance = "14/09/1989";
        individu.nationalite = Nationalite.FRANCAISE;

        return individu;
    }

    private Situation createCompleteSituation() {
        Situation situation = createIncompleteSituationIncludingConjoint();
        situation.email = "prenom.nom@gmail.com";
        situation.phoneNumber = "0685644221";

        situation.logement.adresse = new Adresse();
        situation.logement.adresse.adresse = "10 avenue du Général de Gaulle";
        situation.logement.adresse.ville = "Paris";
        situation.logement.dateArrivee = "12/07/2009";
        situation.logement.type = LogementType.LOCATAIRE;
        situation.logement.loyer = 450;

        situation.logement.conjointMemeAdresse = false;
        Adresse adresseConjoint = new Adresse();
        situation.logement.adresseConjoint = adresseConjoint;
        adresseConjoint.adresse = "12 avenue des Champs-Elysées";
        adresseConjoint.codePostal = "32256";
        adresseConjoint.ville = "Montluchon";
        adresseConjoint.pays = "France";

        Individu demandeur = situation.individus.get(0);
        fillIndividu(demandeur);
        Individu conjoint = situation.individus.get(1);
        fillIndividu(conjoint);

        return situation;
    }

    private Situation createCompleteSituationIncludingChildren() {
        Situation situation = createIncompleteSituationIncludingChildren();
        fillEnfant(situation.individus.get(2));
        fillEnfant(situation.individus.get(3));
        fillEnfant(situation.individus.get(4));

        return situation;
    }

    private void fillIndividu(Individu individu) {
        individu.civilite = Civilite.HOMME;
        individu.firstName = "Bernard";
        individu.lastName = "Dupont";
        individu.nomUsage = "Martin";
        individu.villeNaissance = "Montluçon";
        individu.paysNaissance = "France";
        individu.departementNaissance = "67";
        individu.nir = "189090909090909";
        individu.statutMarital = StatutMarital.MARIAGE;
        individu.dateSituationFamiliale = "12/07/2009";
        individu.demandeurEmploi = true;
        individu.enceinte = true;
        individu.etudiant = true;
        individu.inscritCaf = true;
        individu.numeroAllocataire = "1234567";

        SituationPro situationPro = new SituationPro();
        situationPro.situation = SituationProType.SALARIE;
        situationPro.since = "12/07/2009";
        individu.situationsPro.add(situationPro);
        situationPro = new SituationPro();
        situationPro.situation = SituationProType.DEMANDEUR_EMPLOI;
        situationPro.since = "12/07/2012";
        situationPro.isIndemnise = true;
        individu.situationsPro.add(situationPro);
    }

    private void fillEnfant(Individu enfant) {
        fillIndividu(enfant);
        enfant.dateArriveeFoyer = "12/07/2010";
        enfant.lienParente = LienParente.FILS;
    }
}
